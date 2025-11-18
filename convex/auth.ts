import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (identity) {
      try {
        const user = await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
          .first();

        if (user) {
          console.log('Found user via Convex identity:', user._id);
          return {
            _id: user._id,
            fullName: user.fullName,
            phone: user.phone,
            city: user.city,
            role: user.role,
            regu_id: user.regu_id || null,
            isPhoneVerified: user.isPhoneVerified,
            tokenIdentifier: user.tokenIdentifier,
            _creationTime: user._creationTime,
            createdAt: user.createdAt
          };
        }
      } catch (error) {
        console.error('Error fetching user via identity:', error);
      }
    }
    
    console.log('No valid Convex identity found');
    return null;
  },
});

export const login = mutation({
  args: { phone: v.string(), otp: v.string() },
  handler: async (ctx, args) => {
    console.log(`Login attempt for phone: ${args.phone}`);

    // Find user by phone
    const user = await findUserByPhone(ctx, args.phone);

    if (!user) {
      console.log(`User with phone ${args.phone} not found`);
      throw new Error("User not found");
    }

    // Verify OTP
    const now = Date.now();
    
    // Check if OTP is valid and not expired
    if (!user.otp || user.otp !== args.otp) {
      throw new Error("Invalid OTP");
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < now) {
      throw new Error("OTP has expired");
    }

    // OTP is valid, generate token identifier
    const tokenIdentifier = `phone:${user.phone}`;

    // Update user record
    await ctx.db.patch(user._id, {
      isPhoneVerified: true,
      otp: "", // Clear OTP
      otpExpiresAt: undefined,
      tokenIdentifier,
      otpAttempts: 0, // Reset failed attempts
      lastLoginAt: now,
      updatedAt: now
    });

    // Get updated user data
    const updatedUser = await ctx.db.get(user._id);
    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return {
      success: true,
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        city: updatedUser.city,
        role: updatedUser.role,
        regu_id: updatedUser.regu_id || null,
        isPhoneVerified: true,
        tokenIdentifier,
        backend: process.env.CONVEX_CLOUD_ENVIRONMENT || 'development'
      }
    };
  }
});

// Helper function to find user by phone (with format handling)
async function findUserByPhone(ctx: any, phone: string) {
  // Try different phone number formats
  const formats = [
    phone, // original format
    phone.startsWith('0') ? `+62${phone.substring(1)}` : null,
    phone.startsWith('62') ? `0${phone.substring(2)}` : null,
    phone.startsWith('+62') ? `0${phone.substring(3)}` : null
  ].filter(Boolean);

  for (const format of formats) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", format))
      .first();
    if (user) return user;
  }
  return null;
}

export const sendOtp = mutation({
  args: { 
    phone: v.string(),
    type: v.optional(v.union(v.literal("login"), v.literal("verify_phone")))
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const cooldownPeriod = 60 * 1000; // 1 minute cooldown
    const otpExpiresIn = 5 * 60 * 1000; // 5 minutes

    // Find user by phone (with format handling)
    const user = await findUserByPhone(ctx, args.phone);
    
    // For login, user must exist
    const otpType = args.type || 'login';
    if (otpType === "login" && !user) {
      throw new Error("User not found");
    }

    // Check cooldown
    if (user?.lastOtpSentAt && (now - user.lastOtpSentAt < cooldownPeriod)) {
      const remaining = Math.ceil((cooldownPeriod - (now - user.lastOtpSentAt)) / 1000);
      throw new Error(`Please wait ${remaining} seconds before requesting a new OTP`);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = {
      otp,
      otpExpiresAt: now + otpExpiresIn,
      otpAttempts: 0,
      lastOtpSentAt: now,
      updatedAt: now
    };

    if (user) {
      // Update existing user
      await ctx.db.patch(user._id, otpData);
      console.log("OTP sent to existing user:", user.phone);
    } else if (otpType === "verify_phone") {
      // For new user verification, create a temporary user
      await ctx.db.insert("users", {
        phone: args.phone,
        ...otpData,
        isPhoneVerified: false,
        role: "user", // Default role
        fullName: "", // Will be set during registration
        city: "",     // Will be set during registration
        createdAt: now
      });
    }

    // Log OTP activity
    await ctx.db.insert("otpLogs", {
      userId: user?._id,
      phone: args.phone,
      otp,
      type: otpType,
      status: "sent",
      createdAt: now
    });

    // In development, log the OTP to console
    if (process.env.NODE_ENV !== "production") {
      console.log(`OTP for ${args.phone}: ${otp} (valid for 5 minutes)`);
    }

    return { 
      success: true,
      demo_otp: process.env.NODE_ENV !== "production" ? otp : undefined,
      message: 'OTP sent successfully' 
    };
  },
});

export const register = mutation({
  args: { 
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    role: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if user already exists
    const existingUser = await findUserByPhone(ctx, args.phone);

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      fullName: args.fullName,
      phone: args.phone,
      city: args.city,
      role: args.role || "relawan", // Default role is "relawan"
      regu_id: null,
      isPhoneVerified: false,
      createdAt: now,
      updatedAt: now
    });

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Failed to create user");
    }
    
    return {
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        city: user.city,
        role: user.role,
        regu_id: user.regu_id || null,
        isPhoneVerified: false,
        createdAt: user.createdAt
      }
    };
  },
});

export const verifyOtp = mutation({
  args: { 
    phone: v.string(),
    otp: v.string()
  },
  handler: async (ctx, args) => {
    console.log(`Verifying OTP for phone: ${args.phone}`);
    const now = Date.now();
    const maxAttempts = 5;
    const blockDuration = 15 * 60 * 1000; // 15 minutes

    // Find user by phone
    const user = await findUserByPhone(ctx, args.phone);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is blocked
    if (user.otpAttempts >= maxAttempts) {
      const timeSinceLastAttempt = now - (user.lastOtpSentAt || 0);
      if (timeSinceLastAttempt < blockDuration) {
        const remaining = Math.ceil((blockDuration - timeSinceLastAttempt) / 60000);
        throw new Error(`Too many attempts. Please try again in ${remaining} minutes.`);
      } else {
        // Reset attempts if block time has passed
        await ctx.db.patch(user._id, { 
          otpAttempts: 0,
          updatedAt: now
        });
      }
    }

    // Check OTP validity
    if (!user.otp || user.otp !== args.otp) {
      const attemptsLeft = maxAttempts - (user.otpAttempts || 0) - 1;
      await ctx.db.patch(user._id, { 
        otpAttempts: (user.otpAttempts || 0) + 1,
        updatedAt: now
      });

      // Log failed attempt
      await ctx.db.insert("otpLogs", {
        userId: user._id,
        phone: user.phone,
        otp: args.otp,
        type: "login",
        status: "failed",
        createdAt: now
      });

      throw new Error(`Invalid OTP. ${attemptsLeft > 0 ? attemptsLeft + ' attempts left.' : 'Account will be temporarily locked after 5 failed attempts.'}`);
    }

    // Check if OTP is expired
    if (!user.otpExpiresAt || user.otpExpiresAt < now) {
      await ctx.db.patch(user._id, { 
        otp: null,
        otpExpiresAt: null,
        updatedAt: now
      });

      // Log expired OTP
      await ctx.db.insert("otpLogs", {
        userId: user._id,
        phone: user.phone,
        otp: args.otp,
        type: "login",
        status: "expired",
        createdAt: now
      });

      throw new Error("OTP has expired. Please request a new one.");
    }

    // OTP is valid, update user record
    const tokenIdentifier = `phone:${user.phone}`;

    // Update user record
    await ctx.db.patch(user._id, {
      isPhoneVerified: true,
      otp: "", // Clear OTP
      otpExpiresAt: undefined,
      tokenIdentifier,
      otpAttempts: 0, // Reset failed attempts
      lastLoginAt: now,
      updatedAt: now
    });

    // Log successful verification
    await ctx.db.insert("otpLogs", {
      userId: user._id,
      phone: user.phone,
      otp: args.otp,
      type: "login",
      status: "verified",
      createdAt: now
    });

    // Get updated user
    const updatedUser = await ctx.db.get(user._id);
    if (!updatedUser) {
      throw new Error("User not found after update");
    }

    console.log("User updated:", updatedUser);

    // Return response format that matches frontend expectations
    const userResponse = {
      id: updatedUser._id,
      full_name: updatedUser.fullName,
      phone: updatedUser.phone,
      city: updatedUser.city,
      role: updatedUser.role,
      regu_id: updatedUser.regu_id || null,
      isPhoneVerified: true,
      tokenIdentifier
    };

    console.log('✅ OTP verified successfully, returning user:', userResponse);

    return {
      success: true,
      user: userResponse,
      access_token: tokenIdentifier // For compatibility with frontend
    };
  },
});

export const logout = mutation({
  args: {},
  handler: async (ctx) => {
    // In a real app, you might want to invalidate the token here
    return { success: true };
  },
});
