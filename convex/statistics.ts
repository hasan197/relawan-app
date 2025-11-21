import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get statistics for a relawan
 * This query matches the Supabase API response format exactly
 * to ensure compatibility with the frontend
 */
export const getRelawanStatistics = query({
    args: { relawanId: v.id("users") },
    handler: async (ctx, args) => {
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
