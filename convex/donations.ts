import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserFromToken } from "./auth";

export const listByRelawan = query({
    args: { relawanId: v.id("users"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        console.log('🔍 listByRelawan called with:', { relawanId: args.relawanId, hasToken: !!args.token });

        const user = await getUserFromToken(ctx, args.token);
        if (!user) {
            console.log('❌ Unauthenticated in listByRelawan');
            throw new Error("Unauthenticated");
        }

        console.log('✅ Authenticated user:', user._id);

        const donations = await ctx.db
            .query("donations")
            .withIndex("by_relawan", (q) => q.eq("relawanId", args.relawanId))
            .order("desc")
            .collect();

        console.log('📊 Found donations:', donations.length);

        const result = donations.map((d) => ({
            id: d._id,
            amount: d.amount,
            category: d.category,
            donor_name: d.donorName,
            donor_id: d.donorId,
            relawan_id: d.relawanId,
            event_name: d.eventName,
            type: d.type,
            notes: d.notes,
            created_at: new Date(d.createdAt).toISOString(),
        }));

        console.log('✅ Returning mapped donations:', result.length);
        return result;
    },
});

export const listByMuzakki = query({
    args: { muzakkiId: v.id("muzakkis"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        // Note: Schema doesn't have by_muzakki index on donations, but it has donorId.
        // We might need to add an index or filter.
        // For now, we'll filter in memory or add index if needed.
        // Schema has `donorId: v.optional(v.id("muzakkis"))`.
        // It doesn't have an index for it.
        // I should probably add an index, but for now I'll just filter.
        // Wait, schema has `by_category`, `by_type`, `by_created_at`.
        // I'll use `collect` and filter, or just return empty if not critical.
        // But `useDonations` calls `/donations?muzakki_id=...`.
        // I'll implement filtering.
        const donations = await ctx.db
            .query("donations")
            .filter((q) => q.eq(q.field("donorId"), args.muzakkiId))
            .collect();

        return donations.map((d) => ({
            id: d._id,
            amount: d.amount,
            category: d.category,
            donor_name: d.donorName,
            donor_id: d.donorId,
            relawan_id: d.relawanId,
            event_name: d.eventName,
            type: d.type,
            notes: d.notes,
            created_at: new Date(d.createdAt).toISOString(),
        }));
    },
});

export const create = mutation({
    args: {
        amount: v.number(),
        category: v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf")
        ),
        donor_name: v.string(),
        donor_id: v.optional(v.id("muzakkis")),
        relawan_id: v.id("users"),
        relawan_name: v.optional(v.string()),
        event_name: v.optional(v.string()),
        type: v.union(
            v.literal("incoming"),
            v.literal("outgoing")
        ),
        notes: v.optional(v.string()),
        bukti_transfer_url: v.union(v.string(), v.null()),
        payment_method: v.optional(v.string()),
        receipt_number: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        
        // Verify relawan_id matches authenticated user for donation creation
        if (args.relawan_id !== user._id && args.relawan_id !== user.tokenIdentifier) {
            console.error('Donation creation relawan mismatch:', {
                provided_relawan_id: args.relawan_id,
                user_id: user._id,
                user_tokenIdentifier: user.tokenIdentifier
            });
            throw new Error("Unauthorized: Cannot create donation as another user");
        }

        // Fetch relawan name if not provided
        let relawanName = args.relawan_name;
        if (!relawanName) {
            const relawan = await ctx.db.get(args.relawan_id);
            relawanName = relawan?.fullName || "Unknown";
        }

        const id = await ctx.db.insert("donations", {
            amount: args.amount,
            category: args.category,
            donorName: args.donor_name,
            donorId: args.donor_id,
            relawanId: args.relawan_id,
            relawanName: relawanName,
            eventName: args.event_name,
            type: args.type,
            notes: args.notes,
            buktiTransferUrl: args.bukti_transfer_url,
            paymentMethod: args.payment_method,
            receiptNumber: args.receipt_number,
            status: "pending", // New donations start as pending
            validatedBy: undefined,
            validatedByName: undefined,
            validatedAt: undefined,
            rejectionReason: undefined,
            createdAt: Date.now(),
        });

        // Create activity record for the donation
        await ctx.db.insert("activities", {
            type: "donation",
            title: `Donasi ${args.category} dari ${args.donor_name}`,
            amount: args.amount,
            relawanId: args.relawan_id,
            muzakkiId: args.donor_id,
            donationId: id,
            description: args.donor_name,
            time: Date.now(),
            createdAt: Date.now(),
        });

        return id;
    },
});

export const updateBuktiTransferUrl = mutation({
    args: {
        donationId: v.id("donations"),
        buktiTransferUrl: v.string(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        console.log('🔄 Updating buktiTransferUrl for donation:', args.donationId);
        console.log('📄 Setting URL:', args.buktiTransferUrl);

        await ctx.db.patch(args.donationId, {
            buktiTransferUrl: args.buktiTransferUrl,
        });

        console.log('✅ Database update completed for donation:', args.donationId);
        return { success: true };
    },
});

export const validate = mutation({
    args: {
        donationId: v.id("donations"),
        adminId: v.id("users"),
        adminName: v.string(),
        action: v.union(v.literal("validate"), v.literal("reject")),
        rejectionReason: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        
        // Verify admin_id matches authenticated user or user is admin
        if (args.adminId !== user._id && args.adminId !== user.tokenIdentifier && user.role !== "admin") {
            console.error('Admin validation mismatch:', {
                provided_admin_id: args.adminId,
                user_id: user._id,
                user_tokenIdentifier: user.tokenIdentifier,
                user_role: user.role
            });
            throw new Error("Unauthorized: Cannot validate donation as another user");
        }
        
        const donation = await ctx.db.get(args.donationId);
        if (!donation) {
            throw new Error("Donation not found");
        }

        const updateData: any = {
            status: args.action === "validate" ? "validated" : "rejected",
            validatedBy: args.adminId,
            validatedByName: args.adminName,
            validatedAt: Date.now(),
        };

        if (args.action === "reject" && args.rejectionReason) {
            updateData.rejectionReason = args.rejectionReason;
        }

        await ctx.db.patch(args.donationId, updateData);
        return { success: true };
    },
});

export const getById = query({
    args: { donationId: v.id("donations"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const donation = await ctx.db.get(args.donationId);

        if (!donation) {
            return null;
        }

        return {
            id: donation._id,
            amount: donation.amount,
            category: donation.category,
            donor_name: donation.donorName,
            donor_id: donation.donorId,
            relawan_id: donation.relawanId,
            relawan_name: donation.relawanName,
            event_name: donation.eventName,
            type: donation.type,
            notes: donation.notes,
            bukti_transfer_url: donation.buktiTransferUrl,
            payment_method: donation.paymentMethod,
            receipt_number: donation.receiptNumber,
            status: donation.status,
            validated_by: donation.validatedBy,
            validated_by_name: donation.validatedByName,
            validated_at: donation.validatedAt,
            rejection_reason: donation.rejectionReason,
            created_at: new Date(donation.createdAt).toISOString(),
        };
    },
});

export const listAll = query({
    args: { token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const donations = await ctx.db
            .query("donations")
            .order("desc")
            .collect();

        return donations.map((d) => ({
            id: d._id,
            amount: d.amount,
            category: d.category,
            donor_name: d.donorName,
            donor_id: d.donorId,
            relawan_id: d.relawanId,
            relawan_name: d.relawanName,
            event_name: d.eventName,
            type: d.type,
            notes: d.notes,
            bukti_transfer_url: d.buktiTransferUrl,
            payment_method: d.paymentMethod,
            receipt_number: d.receiptNumber,
            status: d.status,
            validated_by: d.validatedBy,
            validated_by_name: d.validatedByName,
            validated_at: d.validatedAt,
            rejection_reason: d.rejectionReason,
            created_at: new Date(d.createdAt).toISOString(),
        }));
    },
});

export const listPending = query({
    args: { token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const donations = await ctx.db
            .query("donations")
            .filter((q) => q.eq(q.field("status"), "pending"))
            .order("desc")
            .collect();

        return donations.map((d) => ({
            id: d._id,
            amount: d.amount,
            category: d.category,
            donor_name: d.donorName,
            donor_id: d.donorId,
            relawan_id: d.relawanId,
            relawan_name: d.relawanName,
            event_name: d.eventName,
            type: d.type,
            notes: d.notes,
            bukti_transfer_url: d.buktiTransferUrl,
            payment_method: d.paymentMethod,
            receipt_number: d.receiptNumber,
            status: d.status,
            validated_by: d.validatedBy,
            validated_by_name: d.validatedByName,
            validated_at: d.validatedAt,
            rejection_reason: d.rejectionReason,
            created_at: new Date(d.createdAt).toISOString(),
        }));
    },
});
