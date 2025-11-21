import { query } from "./_generated/server";
import { v } from "convex/values";

export const verify = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const userId = ctx.db.normalizeId("users", args.userId);

        if (!userId) {
            return {
                error: "Invalid User ID format",
                userId: args.userId
            };
        }

        const user = await ctx.db.get(userId);

        if (!user) {
            return {
                found: false,
                message: "User not found in Convex DB",
                userId: args.userId
            };
        }

        // Find donations for this user
        const donations = await ctx.db
            .query("donations")
            .withIndex("by_relawan", (q) => q.eq("relawanId", userId))
            .collect();

        // Find targets for this user
        const targets = await ctx.db
            .query("targets")
            .withIndex("by_relawan", (q) => q.eq("relawanId", userId))
            .collect();

        return {
            found: true,
            user: user,
            donationsCount: donations.length,
            donations: donations,
            targetsCount: targets.length,
            targets: targets,
            message: `User found with ${donations.length} donations and ${targets.length} targets.`
        };
    },
});
