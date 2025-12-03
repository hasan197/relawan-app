import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserFromToken } from "./auth";

export const list = query({
    args: { token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const regus = await ctx.db.query("regus").collect();
        return regus.map((r) => ({
            id: r._id,
            name: r.name,
            pembimbing_id: r.pembimbingId,
            description: r.description,
            created_at: new Date(r.createdAt).toISOString(),
        }));
    },
});

export const get = query({
    args: { id: v.id("regus"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const r = await ctx.db.get(args.id);
        if (!r) return null;

        // Get pembimbing name
        const pembimbing = await ctx.db.get(r.pembimbingId);

        // Get members
        const members = await ctx.db
            .query("users")
            .withIndex("by_regu", (q) => q.eq("regu_id", r._id))
            .collect();

        // Calculate total donations for the regu
        let totalDonations = 0;
        for (const member of members) {
            const donations = await ctx.db
                .query("donations")
                .withIndex("by_relawan", (q) => q.eq("relawanId", member._id))
                .collect();

            const memberTotal = donations
                .filter(d => !d.type || d.type === 'incoming')
                .reduce((sum, d) => sum + d.amount, 0);

            totalDonations += memberTotal;
        }

        // Calculate Rank
        // 1. Get all regus
        const allRegus = await ctx.db.query("regus").collect();

        // 2. Calculate donations for each regu (simplified for now, ideally cached)
        const reguStats = await Promise.all(allRegus.map(async (regu) => {
            const reguMembers = await ctx.db
                .query("users")
                .withIndex("by_regu", (q) => q.eq("regu_id", regu._id))
                .collect();

            let reguTotal = 0;
            for (const m of reguMembers) {
                const d = await ctx.db
                    .query("donations")
                    .withIndex("by_relawan", (q) => q.eq("relawanId", m._id))
                    .collect();
                reguTotal += d
                    .filter(x => !x.type || x.type === 'incoming')
                    .reduce((sum, x) => sum + x.amount, 0);
            }
            return { id: regu._id, total: reguTotal };
        }));

        // 3. Sort by total donations descending
        reguStats.sort((a, b) => b.total - a.total);

        // 4. Find rank
        const rank = reguStats.findIndex(s => s.id === r._id) + 1;

        // Calculate Achievements (Prestasi)
        // Simple logic: 1 trophy for every 10M donations
        const achievements = Math.floor(totalDonations / 10000000);

        return {
            id: r._id,
            name: r.name,
            pembimbing_id: r.pembimbingId,
            pembimbing_name: pembimbing?.fullName || 'Belum ada pembimbing',
            description: r.description,
            member_count: members.length,
            total_donations: totalDonations,
            target_amount: 60000000, // Default target
            rank: rank,
            achievements: achievements,
            created_at: new Date(r.createdAt).toISOString(),
        };
    },
});

export const getByCode = query({
    args: { code: v.string(), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        try {
            // Try to find by join code
            const r = await ctx.db
                .query("regus")
                .withIndex("by_join_code", (q) => q.eq("joinCode", args.code))
                .first();

            if (!r) return null;

            // Get pembimbing name
            const pembimbing = await ctx.db.get(r.pembimbingId);

            // Get members
            const members = await ctx.db
                .query("users")
                .withIndex("by_regu", (q) => q.eq("regu_id", r._id))
                .collect();

            // Calculate total donations for the regu
            let totalDonations = 0;
            for (const member of members) {
                const donations = await ctx.db
                    .query("donations")
                    .withIndex("by_relawan", (q) => q.eq("relawanId", member._id))
                    .collect();

                const memberTotal = donations
                    .filter(d => !d.type || d.type === 'incoming')
                    .reduce((sum, d) => sum + d.amount, 0);

                totalDonations += memberTotal;
            }

            // Calculate Rank
            const allRegus = await ctx.db.query("regus").collect();
            const reguStats = await Promise.all(allRegus.map(async (regu) => {
                const reguMembers = await ctx.db
                    .query("users")
                    .withIndex("by_regu", (q) => q.eq("regu_id", regu._id))
                    .collect();

                let reguTotal = 0;
                for (const m of reguMembers) {
                    const d = await ctx.db
                        .query("donations")
                        .withIndex("by_relawan", (q) => q.eq("relawanId", m._id))
                        .collect();
                    reguTotal += d
                        .filter(x => !x.type || x.type === 'incoming')
                        .reduce((sum, x) => sum + x.amount, 0);
                }
                return { id: regu._id, total: reguTotal };
            }));

            reguStats.sort((a, b) => b.total - a.total);
            const rank = reguStats.findIndex(s => s.id === r._id) + 1;
            const achievements = Math.floor(totalDonations / 10000000);

            return {
                id: r._id,
                name: r.name,
                pembimbing_id: r.pembimbingId,
                pembimbing_name: pembimbing?.fullName || 'Belum ada pembimbing',
                description: r.description,
                member_count: members.length,
                total_donations: totalDonations,
                target_amount: 60000000,
                rank: rank,
                achievements: achievements,
                created_at: new Date(r.createdAt).toISOString(),
            };
        } catch (e) {
            return null;
        }
    },
});

export const getMembers = query({
    args: { reguId: v.id("regus"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const members = await ctx.db
            .query("users")
            .withIndex("by_regu", (q) => q.eq("regu_id", args.reguId))
            .collect();

        const membersWithStats = await Promise.all(members.map(async (m) => {
            // Get donations
            const donations = await ctx.db
                .query("donations")
                .withIndex("by_relawan", (q) => q.eq("relawanId", m._id))
                .collect();

            const totalDonations = donations
                .filter(d => !d.type || d.type === 'incoming')
                .reduce((sum, d) => sum + d.amount, 0);

            // Get muzakkis
            const muzakkis = await ctx.db
                .query("muzakkis")
                .withIndex("by_created_by", (q) => q.eq("createdBy", m._id))
                .collect();

            return {
                id: m._id,
                full_name: m.fullName,
                phone: m.phone,
                role: m.role,
                regu_id: m.regu_id,
                total_donations: totalDonations,
                total_muzakki: muzakkis.length,
                joined_at: new Date(m.createdAt).toISOString(),
            };
        }));

        return membersWithStats;
    },
});

export const addMember = mutation({
    args: { reguId: v.id("regus"), userId: v.id("users"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        await ctx.db.patch(args.userId, { regu_id: args.reguId });
        return { success: true };
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        pembimbing_id: v.id("users"),
        description: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const id = await ctx.db.insert("regus", {
            name: args.name,
            pembimbingId: args.pembimbing_id,
            description: args.description,
            createdAt: Date.now(),
        });
        return id;
    },
});
