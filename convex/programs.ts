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
            current_amount: p.currentAmount,
            image_url: p.imageUrl,
            donation_link: p.donationLink,
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
            current_amount: p.currentAmount,
            image_url: p.imageUrl,
            donation_link: p.donationLink,
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
        image_url: v.string(),
        donation_link: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("programs", {
            title: args.title,
            description: args.description,
            category: args.category,
            targetAmount: args.target_amount,
            currentAmount: 0,
            imageUrl: args.image_url,
            donationLink: args.donation_link,
            isActive: true,
            createdAt: Date.now(),
        });
        return id;
    },
});
