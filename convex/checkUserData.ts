import { query } from "./_generated/server";
import { v } from "convex/values";

// Check donations for specific user
export const getUserDonations = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const donations = await ctx.db
            .query("donations")
            .withIndex("by_relawan", (q) => q.eq("relawanId", args.userId))
            .collect();

        const targets = await ctx.db
            .query("targets")
            .withIndex("by_relawan", (q) => q.eq("relawanId", args.userId))
            .collect();

        const muzakkis = await ctx.db
            .query("muzakkis")
            .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
            .collect();

        return {
            userId: args.userId,
            donationsCount: donations.length,
            donations: donations,
            targetsCount: targets.length,
            targets: targets,
            muzakkisCount: muzakkis.length,
            muzakkis: muzakkis
        };
    },
});

// Get all donations (for debugging)
export const getAllDonations = query({
    handler: async (ctx) => {
        const donations = await ctx.db.query("donations").collect();
        return donations;
    },
});

// Get all targets (for debugging)
export const getAllTargets = query({
    handler: async (ctx) => {
        const targets = await ctx.db.query("targets").collect();
        return targets;
    },
});
