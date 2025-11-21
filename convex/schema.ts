import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    role: v.string(),
    regu_id: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
    isPhoneVerified: v.optional(v.boolean()),
    otp: v.optional(v.string()),
    otpExpiresAt: v.optional(v.number()),
    otpAttempts: v.optional(v.number()),
    lastOtpSentAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_phone", ["phone"])
    .index("by_token", ["tokenIdentifier"])
    .index("by_otp", ["phone", "otp"])
    .index("by_regu", ["regu_id"]),

  // Table for OTP logs and audit trail
  otpLogs: defineTable({
    userId: v.optional(v.id("users")),
    phone: v.string(),
    otp: v.string(),
    type: v.union(
      v.literal("login"),
      v.literal("verify_phone"),
      v.literal("reset_password")
    ),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    status: v.union(
      v.literal("sent"),
      v.literal("verified"),
      v.literal("expired"),
      v.literal("failed")
    ),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_phone", ["phone"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // Regu/Team table
  regus: defineTable({
    name: v.string(),
    pembimbingId: v.id("users"),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_pembimbing", ["pembimbingId"]),

  // Muzakki (donors) table
  muzakkis: defineTable({
    name: v.string(),
    phone: v.string(),
    city: v.optional(v.string()),
    status: v.union(
      v.literal("baru"),
      v.literal("follow-up"),
      v.literal("donasi")
    ),
    notes: v.optional(v.string()),
    lastContact: v.optional(v.number()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_phone", ["phone"])
    .index("by_status", ["status"])
    .index("by_created_by", ["createdBy"]),

  // Donations table
  donations: defineTable({
    amount: v.number(),
    category: v.union(
      v.literal("zakat"),
      v.literal("infaq"),
      v.literal("sedekah"),
      v.literal("wakaf")
    ),
    donorName: v.string(),
    donorId: v.optional(v.id("muzakkis")),
    relawanId: v.id("users"),
    eventName: v.optional(v.string()),
    type: v.union(
      v.literal("incoming"),
      v.literal("outgoing")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_relawan", ["relawanId"])
    .index("by_category", ["category"])
    .index("by_type", ["type"])
    .index("by_created_at", ["createdAt"]),

  // Activities table
  activities: defineTable({
    type: v.union(
      v.literal("donation"),
      v.literal("follow-up"),
      v.literal("distribution")
    ),
    title: v.string(),
    amount: v.optional(v.number()),
    relawanId: v.id("users"),
    muzakkiId: v.optional(v.id("muzakkis")),
    donationId: v.optional(v.id("donations")),
    description: v.optional(v.string()),
    time: v.number(),
    createdAt: v.number(),
  })
    .index("by_relawan", ["relawanId"])
    .index("by_type", ["type"])
    .index("by_time", ["time"]),

  // Targets table
  targets: defineTable({
    relawanId: v.id("users"),
    targetAmount: v.number(),
    currentAmount: v.number(),
    targetMuzakki: v.number(),
    currentMuzakki: v.number(),
    period: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_relawan", ["relawanId"])
    .index("by_period", ["period"]),

  // Message templates table
  messageTemplates: defineTable({
    title: v.string(),
    category: v.union(
      v.literal("zakat"),
      v.literal("infaq"),
      v.literal("sedekah"),
      v.literal("wakaf"),
      v.literal("umum")
    ),
    content: v.string(),
    tags: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // Programs table
  programs: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("zakat"),
      v.literal("infaq"),
      v.literal("sedekah"),
      v.literal("wakaf")
    ),
    targetAmount: v.number(),
    currentAmount: v.number(),
    imageUrl: v.string(),
    donationLink: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // Chat messages table
  chatMessages: defineTable({
    regu_id: v.string(),
    sender_id: v.string(),
    sender_name: v.string(),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_regu", ["regu_id"])
    .index("by_created_at", ["createdAt"]),
});
