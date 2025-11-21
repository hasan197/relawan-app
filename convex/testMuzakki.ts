import { query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const testMuzakki = query({
    args: { relawanId: v.id("users") },
    handler: async (ctx, args) => {
        const muzakkis = await ctx.db
            .query("muzakkis")
            .withIndex("by_created_by", (q) => q.eq("createdBy", args.relawanId))
            .collect();

        return {
            count: muzakkis.length,
            items: muzakkis
        };
    },
});
