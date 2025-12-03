import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserFromToken } from "./auth";

export const list = query({
    args: {
        all: v.optional(v.boolean()),
        relawanId: v.optional(v.string()),
        token: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        // Admin mode or get all templates
        if (args.all === true || !args.relawanId) {
            const templates = await ctx.db.query("messageTemplates").collect();

            return templates.map((t) => ({
                id: t._id,
                name: t.name,
                title: t.title,
                category: t.category,
                message: t.message,
                content: t.content,
                variables: t.variables || [],
                is_shared: t.isShared || false,
                created_at: new Date(t.createdAt).toISOString(),
            }));
        }

        // Get templates for specific relawan (not implemented in this schema)
        // For now, return all active templates
        const templates = await ctx.db
            .query("messageTemplates")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();

        return templates.map((t) => ({
            id: t._id,
            name: t.name,
            title: t.title,
            category: t.category,
            message: t.message,
            content: t.content,
            variables: t.variables || [],
            is_shared: t.isShared || false,
            created_at: new Date(t.createdAt).toISOString(),
        }));
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        category: v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf"),
            v.literal("umum"),
            v.literal("greeting"),
            v.literal("reminder"),
            v.literal("thanks"),
            v.literal("invitation"),
            v.literal("follow-up"),
            v.literal("info")
        ),
        message: v.string(),
        variables: v.optional(v.array(v.string())),
        is_shared: v.optional(v.boolean()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const id = await ctx.db.insert("messageTemplates", {
            name: args.name,
            category: args.category,
            message: args.message,
            content: args.message, // For compatibility
            variables: args.variables || [],
            tags: [], // For compatibility
            isActive: true,
            isShared: args.is_shared || false,
            createdAt: Date.now(),
        });
        return id;
    },
});

// Admin functions
export const adminList = query({
    args: { token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user || user.role !== "admin") throw new Error("Unauthorized");
        const templates = await ctx.db.query("messageTemplates").collect();

        return templates.map((t) => ({
            id: t._id,
            name: t.name,
            title: t.title,
            category: t.category,
            message: t.message,
            content: t.content,
            variables: t.variables || [],
            is_shared: t.isShared || false,
            created_at: new Date(t.createdAt).toISOString(),
        }));
    },
});

export const adminCreate = mutation({
    args: {
        name: v.string(),
        category: v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf"),
            v.literal("umum"),
            v.literal("greeting"),
            v.literal("reminder"),
            v.literal("thanks"),
            v.literal("invitation"),
            v.literal("follow-up"),
            v.literal("info")
        ),
        message: v.string(),
        variables: v.optional(v.array(v.string())),
        is_shared: v.optional(v.boolean()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user || user.role !== "admin") throw new Error("Unauthorized");
        const templateId = await ctx.db.insert("messageTemplates", {
            name: args.name,
            category: args.category,
            message: args.message,
            content: args.message, // For compatibility
            variables: args.variables || [],
            tags: [], // For compatibility
            isActive: true,
            isShared: args.is_shared || false,
            createdAt: Date.now(),
        });

        const template = await ctx.db.get(templateId);
        return template;
    },
});

export const adminUpdate = mutation({
    args: {
        templateId: v.id("messageTemplates"),
        name: v.optional(v.string()),
        category: v.optional(v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf"),
            v.literal("umum"),
            v.literal("greeting"),
            v.literal("reminder"),
            v.literal("thanks"),
            v.literal("invitation"),
            v.literal("follow-up"),
            v.literal("info")
        )),
        message: v.optional(v.string()),
        variables: v.optional(v.array(v.string())),
        is_shared: v.optional(v.boolean()),
        isActive: v.optional(v.boolean()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user || user.role !== "admin") throw new Error("Unauthorized");
        const { templateId, ...updates } = args;

        const updatedTemplate = await ctx.db.patch(templateId, {
            ...(updates.name && { name: updates.name }),
            ...(updates.category && { category: updates.category }),
            ...(updates.message && {
                message: updates.message,
                content: updates.message // For compatibility
            }),
            ...(updates.variables && { variables: updates.variables }),
            ...(updates.is_shared !== undefined && { isShared: updates.is_shared }),
            ...(updates.isActive !== undefined && { isActive: updates.isActive }),
            updatedAt: Date.now(),
        });

        return updatedTemplate;
    },
});

export const adminDelete = mutation({
    args: {
        templateId: v.id("messageTemplates"),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user || user.role !== "admin") throw new Error("Unauthorized");
        await ctx.db.delete(args.templateId);
        return { success: true };
    },
});
