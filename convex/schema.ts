import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    email: v.optional(v.string()),
    role: v.union(v.literal("relawan"), v.literal("pembimbing"), v.literal("admin")),
    regu_id: v.optional(v.id("regus")),
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
    .index("by_regu", ["regu_id"])
    .index("by_role", ["role"]),

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
    targetAmount: v.optional(v.number()),
    joinCode: v.optional(v.string()),
    memberCount: v.optional(v.number()),
    totalDonations: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_pembimbing", ["pembimbingId"])
    .index("by_join_code", ["joinCode"]),

  // Muzakki (donors) table
  muzakkis: defineTable({
    name: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    category: v.optional(v.union(v.literal("muzakki"), v.literal("donatur"), v.literal("prospek"))),
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
    .index("by_category", ["category"])
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
    relawanName: v.optional(v.string()),
    eventName: v.optional(v.string()),
    type: v.union(
      v.literal("incoming"),
      v.literal("outgoing")
    ),
    notes: v.optional(v.string()),
    buktiTransferUrl: v.optional(v.union(v.string(), v.null())),
    paymentMethod: v.optional(v.string()),
    receiptNumber: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("validated"), v.literal("rejected"))),
    validatedBy: v.optional(v.id("users")),
    validatedByName: v.optional(v.string()),
    validatedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_relawan", ["relawanId"])
    .index("by_category", ["category"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
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
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    category: v.union(
      v.literal("zakat"),
      v.literal("infaq"),
      v.literal("sedekah"),
      v.literal("wakaf"),
      v.literal("umum"),
      v.literal("greeting"),
      v.literal("reminder"),
      v.literal("thanks"),
      v.literal("invitation"),
      v.literal("follow-up"),
      v.literal("info")
    ),
    message: v.optional(v.string()),
    content: v.optional(v.string()), // For compatibility
    variables: v.optional(v.array(v.string())),
    tags: v.array(v.string()),
    isActive: v.boolean(),
    isShared: v.optional(v.boolean()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_shared", ["isShared"]),

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
    collectedAmount: v.optional(v.number()),
    currentAmount: v.optional(v.number()), // For compatibility
    imageUrl: v.optional(v.string()),
    donationLink: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("completed"))),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_status", ["status"]),

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

  // Notifications table
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("reminder")
    ),
    read: v.boolean(),
    action_url: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),

  // Communications table
  communications: defineTable({
    muzakkiId: v.id("muzakkis"),
    relawanId: v.id("users"),
    type: v.union(
      v.literal("call"),
      v.literal("whatsapp"),
      v.literal("meeting"),
      v.literal("other")
    ),
    notes: v.string(),
    createdAt: v.number(),
  })
    .index("by_muzakki", ["muzakkiId"])
    .index("by_relawan", ["relawanId"])
    .index("by_created_at", ["createdAt"]),
});
