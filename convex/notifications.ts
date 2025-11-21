import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        // Map to match Supabase format (snake_case)
        return notifications.map((n) => ({
            id: n._id,
            user_id: n.userId,
            title: n.title,
            message: n.message,
            type: n.type,
            read: n.read,
            created_at: new Date(n.createdAt).toISOString(),
            action_url: n.action_url,
        }));
    },
});

export const markAsRead = mutation({
    args: { id: v.id("notifications") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { read: true });
        return { success: true };
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        title: v.string(),
        message: v.string(),
        type: v.union(
            v.literal("info"),
            v.literal("success"),
            v.literal("warning"),
            v.literal("reminder")
        ),
        action_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("notifications", {
            userId: args.userId,
            title: args.title,
            message: args.message,
            type: args.type,
            read: false,
            action_url: args.action_url,
            createdAt: Date.now(),
        });
        return id;
    },
});
