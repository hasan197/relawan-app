import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ==================== DONATION MANAGEMENT ====================

// Get all donations (Admin)
export const getAllDonations = query({
  args: {
    admin: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const donations = await ctx.db.query("donations").collect();
    
    // Enrich with relawan and muzakki information
    const enrichedDonations = await Promise.all(
      donations.map(async (donation) => {
        const relawan = await ctx.db.get(donation.relawanId);
        const donor = donation.donorId ? await ctx.db.get(donation.donorId) : null;
        
        return {
          _id: donation._id,
          _creationTime: donation._creationTime,
          amount: donation.amount,
          category: donation.category,
          donor_name: donation.donorName || donor?.name || null,
          donor_id: donation.donorId,
          donor_phone: donor?.phone || null,
          relawan_id: donation.relawanId,
          relawan_name: relawan?.fullName || relawan?.name || null,
          event_name: donation.eventName,
          created_at: donation.createdAt,
          validated_at: donation.validatedAt,
          type: donation.type,
          status: donation.status,
          bukti_transfer_url: donation.buktiTransferUrl,
          payment_method: donation.paymentMethod,
          notes: donation.notes,
          validated_by: donation.validatedBy,
          validated_by_name: donation.validatedByName,
          rejection_reason: donation.rejectionReason
        };
      })
    );

    return enrichedDonations;
  },
});

// Get pending donations (Admin)
export const getPendingDonations = query({
  handler: async (ctx) => {
    // Get all donations and filter for pending (including undefined status)
    const allDonations = await ctx.db.query("donations").collect();
    
    const pendingDonations = allDonations.filter(d => 
      d.status === "pending" || d.status === undefined
    );
    
    // Enrich with relawan information
    const enrichedDonations = await Promise.all(
      pendingDonations.map(async (donation) => {
        const relawan = await ctx.db.get(donation.relawanId);
        const donor = donation.donorId ? await ctx.db.get(donation.donorId) : null;
        
        return {
          _id: donation._id,
          _creationTime: donation._creationTime,
          amount: donation.amount,
          category: donation.category,
          donor_name: donation.donorName || donor?.name || null,
          donor_id: donation.donorId,
          donor_phone: donor?.phone || null,
          relawan_id: donation.relawanId,
          relawan_name: relawan?.fullName || relawan?.name || null,
          event_name: donation.eventName,
          created_at: donation.createdAt,
          validated_at: donation.validatedAt,
          type: donation.type,
          status: donation.status,
          bukti_transfer_url: donation.buktiTransferUrl,
          payment_method: donation.paymentMethod,
          notes: donation.notes,
          validated_by: donation.validatedBy,
          validated_by_name: donation.validatedByName,
          rejection_reason: donation.rejectionReason
        };
      })
    );

    return enrichedDonations;
  },
});

// Create donation (Admin)
export const createDonation = mutation({
  args: {
    donor_name: v.string(),
    amount: v.number(),
    category: v.union(v.literal("zakat"), v.literal("infaq"), v.literal("sedekah"), v.literal("wakaf")),
    relawan_id: v.id("users"),
    status: v.optional(v.union(v.literal("pending"), v.literal("validated"), v.literal("rejected"))),
    donor_id: v.optional(v.id("muzakkis")),
    notes: v.optional(v.string()),
    payment_method: v.optional(v.string()),
    receipt_number: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const donationId = await ctx.db.insert("donations", {
      donorName: args.donor_name,
      amount: args.amount,
      category: args.category,
      relawanId: args.relawan_id,
      donorId: args.donor_id,
      type: "incoming",
      status: args.status || "pending",
      notes: args.notes,
      paymentMethod: args.payment_method,
      receiptNumber: args.receipt_number,
      createdAt: Date.now(),
    });

    const donation = await ctx.db.get(donationId);
    return donation;
  },
});

// Update donation (Admin)
export const updateDonation = mutation({
  args: {
    donationId: v.id("donations"),
    donor_name: v.optional(v.string()),
    amount: v.optional(v.number()),
    category: v.optional(v.union(v.literal("zakat"), v.literal("infaq"), v.literal("sedekah"), v.literal("wakaf"))),
    status: v.optional(v.union(v.literal("pending"), v.literal("validated"), v.literal("rejected"))),
    notes: v.optional(v.string()),
    payment_method: v.optional(v.string()),
    receipt_number: v.optional(v.string()),
    bukti_transfer_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { donationId, ...updates } = args;

    const updatedDonation = await ctx.db.patch(donationId, {
      ...(updates.donor_name && { donorName: updates.donor_name }),
      ...(updates.amount && { amount: updates.amount }),
      ...(updates.category && { category: updates.category }),
      ...(updates.status && { status: updates.status }),
      ...(updates.notes && { notes: updates.notes }),
      ...(updates.payment_method && { paymentMethod: updates.payment_method }),
      ...(updates.receipt_number && { receiptNumber: updates.receipt_number }),
      ...(updates.bukti_transfer_url && { buktiTransferUrl: updates.bukti_transfer_url }),
    });

    return updatedDonation;
  },
});

// Delete donation
export const deleteDonation = mutation({
  args: {
    donationId: v.id("donations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.donationId);
    return { success: true };
  },
});

// Validate donation (Admin)
export const validateDonation = mutation({
  args: {
    donationId: v.id("donations"),
    admin_id: v.id("users"),
    admin_name: v.string(),
    action: v.union(v.literal("validate"), v.literal("reject")),
    rejection_reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db.get(args.donationId);
    if (!donation) {
      throw new Error("Donasi tidak ditemukan");
    }

    const updates: any = {
      status: args.action === "validate" ? "validated" : "rejected",
      validatedBy: args.admin_id,
      validatedByName: args.admin_name,
      validatedAt: Date.now(),
    };

    if (args.action === "reject" && args.rejection_reason) {
      updates.rejectionReason = args.rejection_reason;
    }

    const updatedDonation = await ctx.db.patch(args.donationId, updates);
    return updatedDonation;
  },
});

// Get donation statistics
export const getDonationStats = query({
  args: {
    relawan_id: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let donations;
    
    if (args.relawan_id) {
      donations = await ctx.db
        .query("donations")
        .withIndex("by_relawan", (q) => q.eq("relawanId", args.relawan_id))
        .collect();
    } else {
      donations = await ctx.db.query("donations").collect();
    }

    const stats = {
      total: donations.length,
      pending: donations.filter(d => d.status === "pending" || d.status === undefined).length,
      validated: donations.filter(d => d.status === "validated").length,
      rejected: donations.filter(d => d.status === "rejected").length,
      by_category: donations
        .filter(d => d.type === "incoming")
        .reduce((acc, d) => {
          acc[d.category] = (acc[d.category] || 0) + d.amount;
          return acc;
        }, {} as Record<string, number>),
      total_amount: donations
        .filter(d => d.type === "incoming" && d.status === "validated")
        .reduce((sum, d) => sum + d.amount, 0),
    };

    return stats;
  },
});

// Upload bukti transfer (using Convex storage)
export const uploadBuktiTransfer = mutation({
  args: {
    donationId: v.id("donations"),
    file: v.string(), // Base64 encoded file
    filename: v.string(),
  },
  handler: async (ctx, args) => {
    // This would integrate with Convex storage
    // For now, just update the URL field
    const storageId = `bukti-${args.donationId}-${Date.now()}`;
    
    const updatedDonation = await ctx.db.patch(args.donationId, {
      buktiTransferUrl: storageId,
    });

    return updatedDonation;
  },
});
