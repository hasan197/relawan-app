import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const programs = await ctx.db
            .query("programs")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();

        return programs.map((p) => ({
            id: p._id,
            title: p.title,
            description: p.description,
            category: p.category,
            target_amount: p.targetAmount,
            collected_amount: p.collectedAmount || 0,
            image_url: p.imageUrl,
            donation_link: p.donationLink,
            status: p.status,
            start_date: p.startDate ? new Date(p.startDate).toISOString() : null,
            end_date: p.endDate ? new Date(p.endDate).toISOString() : null,
            is_active: p.isActive,
            created_at: new Date(p.createdAt).toISOString(),
        }));
    },
});

export const get = query({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        const p = await ctx.db.get(args.id);
        if (!p) return null;

        return {
            id: p._id,
            title: p.title,
            description: p.description,
            category: p.category,
            target_amount: p.targetAmount,
            collected_amount: p.collectedAmount || 0,
            image_url: p.imageUrl,
            donation_link: p.donationLink,
            status: p.status,
            start_date: p.startDate ? new Date(p.startDate).toISOString() : null,
            end_date: p.endDate ? new Date(p.endDate).toISOString() : null,
            is_active: p.isActive,
            created_at: new Date(p.createdAt).toISOString(),
        };
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        category: v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf")
        ),
        target_amount: v.number(),
        image_url: v.optional(v.string()),
        donation_link: v.optional(v.string()),
        start_date: v.optional(v.string()),
        end_date: v.optional(v.string()),
        status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("completed"))),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("programs", {
            title: args.title,
            description: args.description,
            category: args.category,
            targetAmount: args.target_amount,
            collectedAmount: 0,
            imageUrl: args.image_url,
            donationLink: args.donation_link,
            startDate: args.start_date ? new Date(args.start_date).getTime() : undefined,
            endDate: args.end_date ? new Date(args.end_date).getTime() : undefined,
            status: args.status || "active",
            isActive: args.status !== "inactive",
            createdAt: Date.now(),
        });
        return id;
    },
});

// Admin functions
export const adminList = query({
    args: {},
    handler: async (ctx) => {
        const programs = await ctx.db.query("programs").collect();

        return programs.map((p) => ({
            id: p._id,
            title: p.title,
            description: p.description,
            category: p.category,
            target_amount: p.targetAmount,
            collected_amount: p.collectedAmount || 0,
            image_url: p.imageUrl,
            donation_link: p.donationLink,
            status: p.status,
            start_date: p.startDate ? new Date(p.startDate).toISOString() : null,
            end_date: p.endDate ? new Date(p.endDate).toISOString() : null,
            is_active: p.isActive,
            created_at: new Date(p.createdAt).toISOString(),
        }));
    },
});

export const adminCreate = mutation({
    args: {
        title: v.string(),
        category: v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf")
        ),
        target_amount: v.number(),
        description: v.string(),
        start_date: v.optional(v.string()),
        end_date: v.optional(v.string()),
        status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("completed"))),
        image_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const programId = await ctx.db.insert("programs", {
            title: args.title,
            category: args.category,
            targetAmount: args.target_amount,
            description: args.description,
            startDate: args.start_date ? new Date(args.start_date).getTime() : undefined,
            endDate: args.end_date ? new Date(args.end_date).getTime() : undefined,
            status: args.status || "active",
            isActive: args.status !== "inactive",
            imageUrl: args.image_url,
            collectedAmount: 0,
            createdAt: Date.now(),
        });

        const program = await ctx.db.get(programId);
        return program;
    },
});

export const adminUpdate = mutation({
    args: {
        programId: v.id("programs"),
        title: v.optional(v.string()),
        category: v.optional(v.union(
            v.literal("zakat"),
            v.literal("infaq"),
            v.literal("sedekah"),
            v.literal("wakaf")
        )),
        target_amount: v.optional(v.number()),
        description: v.optional(v.string()),
        start_date: v.optional(v.string()),
        end_date: v.optional(v.string()),
        status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("completed"))),
        image_url: v.optional(v.string()),
        collected_amount: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { programId, ...updates } = args;

        const updatedProgram = await ctx.db.patch(programId, {
            ...(updates.title && { title: updates.title }),
            ...(updates.category && { category: updates.category }),
            ...(updates.target_amount && { targetAmount: updates.target_amount }),
            ...(updates.description && { description: updates.description }),
            ...(updates.start_date && { startDate: new Date(updates.start_date).getTime() }),
            ...(updates.end_date && { endDate: new Date(updates.end_date).getTime() }),
            ...(updates.status && { 
                status: updates.status,
                isActive: updates.status !== "inactive"
            }),
            ...(updates.image_url && { imageUrl: updates.image_url }),
            ...(updates.collected_amount !== undefined && { collectedAmount: updates.collected_amount }),
            updatedAt: Date.now(),
        });

        return updatedProgram;
    },
});

export const adminDelete = mutation({
    args: {
        programId: v.id("programs"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.programId);
        return { success: true };
    },
});

export const collect = mutation({
    args: { 
        programId: v.id("programs"), 
        amount: v.number() 
    },
    handler: async (ctx, args) => {
        const program = await ctx.db.get(args.programId);
        if (!program) {
            throw new Error("Program tidak ditemukan");
        }

        const updatedProgram = await ctx.db.patch(args.programId, {
            collectedAmount: (program.collectedAmount || 0) + args.amount,
            updatedAt: Date.now(),
        });

        return updatedProgram;
    },
});
