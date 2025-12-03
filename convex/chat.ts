import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromToken } from "./auth";

export const list = query({
    args: { reguId: v.string(), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_regu", (q) => q.eq("regu_id", args.reguId))
            .order("asc")
            .collect();

        return messages.map((msg) => ({
            id: msg._id,
            regu_id: msg.regu_id,
            sender_id: msg.sender_id,
            sender_name: msg.sender_name,
            message: msg.message,
            created_at: new Date(msg.createdAt).toISOString(),
        }));
    },
});

export const send = mutation({
    args: {
        regu_id: v.string(),
        sender_id: v.string(),
        sender_name: v.string(),
        message: v.string(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");

        // Verify sender_id matches authenticated user
        if (args.sender_id !== user.tokenIdentifier && args.sender_id !== user.subject) {
            throw new Error("Cannot send message as another user");
        }

        const now = Date.now();
        const id = await ctx.db.insert("chatMessages", {
            regu_id: args.regu_id,
            sender_id: args.sender_id,
            sender_name: args.sender_name,
            message: args.message,
            createdAt: now,
        });

        return {
            id: id,
            regu_id: args.regu_id,
            sender_id: args.sender_id,
            sender_name: args.sender_name,
            message: args.message,
            created_at: new Date(now).toISOString(),
        };
    },
});
