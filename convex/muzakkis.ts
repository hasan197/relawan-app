import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromToken } from "./auth";

/**
 * List muzakkis for a relawan
 */
export const listByRelawan = query({
    args: { relawanId: v.id("users"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const muzakkis = await ctx.db
            .query("muzakkis")
            .withIndex("by_created_by", (q) => q.eq("createdBy", args.relawanId))
            .collect();

        // Map to match Supabase response format if needed
        // Based on useMuzakki.ts, it expects an array of Muzakki objects
        return muzakkis.map(m => ({
            id: m._id,
            name: m.name,
            phone: m.phone,
            status: m.status,
            notes: m.notes,
            created_at: new Date(m.createdAt).toISOString(),
            updated_at: m.updatedAt ? new Date(m.updatedAt).toISOString() : undefined,
            created_by: m.createdBy,
        }));
    },
});

export const get = query({
    args: { id: v.id("muzakkis"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const m = await ctx.db.get(args.id);
        if (!m) return null;
        return {
            id: m._id,
            name: m.name,
            phone: m.phone,
            city: m.city,
            status: m.status,
            notes: m.notes,
            created_at: new Date(m.createdAt).toISOString(),
            updated_at: m.updatedAt ? new Date(m.updatedAt).toISOString() : undefined,
            created_by: m.createdBy,
            last_contact: m.lastContact ? new Date(m.lastContact).toISOString() : undefined,
        };
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        phone: v.string(),
        city: v.optional(v.string()),
        status: v.union(
            v.literal("baru"),
            v.literal("follow-up"),
            v.literal("donasi")
        ),
        notes: v.optional(v.string()),
        relawan_id: v.id("users"),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const id = await ctx.db.insert("muzakkis", {
            name: args.name,
            phone: args.phone,
            city: args.city,
            status: args.status,
            notes: args.notes,
            createdBy: args.relawan_id,
            relawan_id: args.relawan_id,
            createdAt: Date.now(),
        });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("muzakkis"),
        name: v.optional(v.string()),
        phone: v.optional(v.string()),
        city: v.optional(v.string()),
        status: v.optional(v.union(
            v.literal("baru"),
            v.literal("follow-up"),
            v.literal("donasi")
        )),
        notes: v.optional(v.string()),
        relawan_id: v.id("users"), // Just for verification if needed
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const { id, relawan_id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
        return { success: true };
    },
});

export const deleteMuzakki = mutation({
    args: { id: v.id("muzakkis"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// Communications
export const listCommunications = query({
    args: { muzakkiId: v.id("muzakkis"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const comms = await ctx.db
            .query("communications")
            .withIndex("by_muzakki", (q) => q.eq("muzakkiId", args.muzakkiId))
            .order("desc")
            .collect();

        return comms.map(c => ({
            id: c._id,
            muzakki_id: c.muzakkiId,
            relawan_id: c.relawanId,
            type: c.type,
            notes: c.notes,
            created_at: new Date(c.createdAt).toISOString(),
        }));
    },
});

export const addCommunication = mutation({
    args: {
        muzakki_id: v.id("muzakkis"),
        relawan_id: v.id("users"),
        type: v.union(
            v.literal("call"),
            v.literal("whatsapp"),
            v.literal("meeting"),
            v.literal("other")
        ),
        notes: v.string(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromToken(ctx, args.token);
        if (!user) throw new Error("Unauthenticated");
        const id = await ctx.db.insert("communications", {
            muzakkiId: args.muzakki_id,
            relawanId: args.relawan_id,
            type: args.type,
            notes: args.notes,
            createdAt: Date.now(),
        });

        // Also update last contact on muzakki
        await ctx.db.patch(args.muzakki_id, {
            lastContact: Date.now(),
        });

        return id;
    },
});
