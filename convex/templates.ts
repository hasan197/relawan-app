import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const templates = await ctx.db
            .query("messageTemplates")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();

        return templates.map((t) => ({
            id: t._id,
            title: t.title,
            category: t.category,
            content: t.content,
            tags: t.tags,
            is_active: t.isActive,
            created_at: new Date(t.createdAt).toISOString(),
        }));
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        category: v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf"),
            v.literal("umum")
        ),
        content: v.string(),
        tags: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("messageTemplates", {
            title: args.title,
            category: args.category,
            content: args.content,
            tags: args.tags,
            isActive: true,
            createdAt: Date.now(),
        });
        return id;
    },
});
