import { query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromToken } from "./auth";

/**
 * Get statistics for a relawan
 * This query matches the Supabase API response format exactly
 * to ensure compatibility with the frontend
 */
export const getRelawanStatistics = query({
    args: { relawanId: v.id("users"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");

        // Verify user is requesting their own stats or is admin
        if (args.relawanId !== user._id && user.role !== "admin") {
            throw new Error("Unauthorized: Can only view your own statistics");
        }

        // Get all donations for this relawan
        const donations = await ctx.db
            .query("donations")
            .withIndex("by_relawan", (q) => q.eq("relawanId", args.relawanId))
            .collect();

        // Get all muzakkis created by this relawan
        const muzakkis = await ctx.db
            .query("muzakkis")
            .withIndex("by_created_by", (q) => q.eq("createdBy", args.relawanId))
            .collect();

        // Get targets for this relawan
        const targets = await ctx.db
            .query("targets")
            .withIndex("by_relawan", (q) => q.eq("relawanId", args.relawanId))
            .collect();

        // Get activities for this relawan
        const activities = await ctx.db
            .query("activities")
            .withIndex("by_relawan", (q) => q.eq("relawanId", args.relawanId))
            .collect();

        // Calculate total donations (incoming only)
        const totalDonations = donations
            .filter((d) => !d.type || d.type === "incoming")
            .reduce((sum, d) => sum + (d.amount || 0), 0);

        // Calculate total distributed (outgoing)
        const totalDistributed = donations
            .filter((d) => d.type === "outgoing")
            .reduce((sum, d) => sum + (d.amount || 0), 0);

        // Calculate donations by category
        const donationsByCategory = donations
            .filter((d) => !d.type || d.type === "incoming")
            .reduce(
                (acc, d) => {
                    if (d.category) {
                        acc[d.category] = (acc[d.category] || 0) + (d.amount || 0);
                    }
                    return acc;
                },
                { zakat: 0, infaq: 0, sedekah: 0, wakaf: 0 } as Record<string, number>
            );

        // Get monthly target (from targets table or default)
        const currentTarget = targets.length > 0 ? targets[0] : null;
        const monthlyTarget = currentTarget?.targetAmount || 15000000;
        const muzakkiTarget = currentTarget?.targetMuzakki || 100;

        // Map activities to match Supabase format
        const recentActivities = activities
            .sort((a, b) => b.time - a.time)
            .slice(0, 10)
            .map((activity) => ({
                id: activity._id,
                type: activity.type,
                title: activity.title,
                amount: activity.amount,
                time: new Date(activity.time).toISOString(),
                muzakki_name: activity.description || "",
                category: activity.type === "donation" ? "donation" : undefined,
            }));

        // Return data in Supabase API format
        return {
            total_donations: totalDonations,
            total_distributed: totalDistributed,
            total_muzakki: muzakkis.length,
            donations_by_category: {
                zakat: donationsByCategory.zakat || 0,
                infaq: donationsByCategory.infaq || 0,
                sedekah: donationsByCategory.sedekah || 0,
                wakaf: donationsByCategory.wakaf || 0,
            },
            balance: totalDonations - totalDistributed,
            monthly_target: monthlyTarget,
            muzakki_target: muzakkiTarget,
            monthly_progress: (totalDonations / monthlyTarget) * 100,
            muzakki_progress: (muzakkis.length / muzakkiTarget) * 100,
            recent_activities: recentActivities,
        };
    },
});

export const getGlobalStats = query({
    args: { token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user || user.role !== "admin") throw new Error("Unauthorized");
        const donations = await ctx.db.query("donations").collect();
        const muzakkis = await ctx.db.query("muzakkis").collect();
        const relawans = await ctx.db.query("users").filter(q => q.eq(q.field("role"), "relawan")).collect();
        const regus = await ctx.db.query("regus").collect();

        const totalDonations = donations
            .filter((d) => !d.type || d.type === "incoming")
            .reduce((sum, d) => sum + (d.amount || 0), 0);

        return {
            total_donations: totalDonations,
            total_muzakki: muzakkis.length,
            total_relawan: relawans.length,
            total_regu: regus.length,
        };
    },
});

export const getReguStats = query({
    args: { token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user || user.role !== "admin") throw new Error("Unauthorized");
        const regus = await ctx.db.query("regus").collect();
        const stats = [];

        for (const regu of regus) {
            const members = await ctx.db
                .query("users")
                .withIndex("by_regu", (q) => q.eq("regu_id", regu._id))
                .collect();

            const memberIds = members.map(m => m._id);

            // This is inefficient (N+1), but fine for small scale. 
            // Ideally we'd aggregate or use a better query structure.
            let reguDonations = 0;
            let reguMuzakkis = 0;

            for (const memberId of memberIds) {
                const donations = await ctx.db
                    .query("donations")
                    .withIndex("by_relawan", (q) => q.eq("relawanId", memberId))
                    .collect();

                reguDonations += donations
                    .filter((d) => !d.type || d.type === "incoming")
                    .reduce((sum, d) => sum + (d.amount || 0), 0);

                const muzakkis = await ctx.db
                    .query("muzakkis")
                    .withIndex("by_created_by", (q) => q.eq("createdBy", memberId))
                    .collect();

                reguMuzakkis += muzakkis.length;
            }

            stats.push({
                id: regu._id,
                name: regu.name,
                member_count: members.length,
                total_donations: reguDonations,
                total_muzakki: reguMuzakkis,
            });
        }

        return stats;
    },
});

