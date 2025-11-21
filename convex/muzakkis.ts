import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List muzakkis for a relawan
 */
export const listByRelawan = query({
    args: { relawanId: v.id("users") },
    handler: async (ctx, args) => {
        const muzakkis = await ctx.db
            .query("muzakkis")
            .withIndex("by_created_by", (q) => q.eq("createdBy", args.relawanId))
            .collect();

        // Map to match Supabase response format if needed
        // Based on useMuzakki.ts, it expects an array of Muzakki objects
        return muzakkis.map(m => ({
            id: m._id,
            name: m.name,
            address: m.address,
            phone: m.phone,
            status: m.status,
            notes: m.notes,
            created_at: new Date(m.createdAt).toISOString(),
            updated_at: m.updatedAt ? new Date(m.updatedAt).toISOString() : undefined,
            created_by: m.createdBy,
        }));
    },
});
