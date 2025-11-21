import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByRelawan = query({
    args: { relawanId: v.id("users") },
    handler: async (ctx, args) => {
        const donations = await ctx.db
            .query("donations")
            .withIndex("by_relawan", (q) => q.eq("relawanId", args.relawanId))
            .order("desc")
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

export const listByMuzakki = query({
    args: { muzakkiId: v.id("muzakkis") },
    handler: async (ctx, args) => {
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
        event_name: v.optional(v.string()),
        type: v.union(
            v.literal("incoming"),
            v.literal("outgoing")
        ),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("donations", {
            amount: args.amount,
            category: args.category,
            donorName: args.donor_name,
            donorId: args.donor_id,
            relawanId: args.relawan_id,
            eventName: args.event_name,
            type: args.type,
            notes: args.notes,
            createdAt: Date.now(),
        });
        return id;
    },
});
