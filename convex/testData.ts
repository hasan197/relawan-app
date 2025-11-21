import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserData = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return { error: "User not found", userId: args.userId };
    }

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_relawan", (q) => q.eq("relawanId", args.userId))
      .collect();

    const targets = await ctx.db
      .query("targets")
      .withIndex("by_relawan", (q) => q.eq("relawanId", args.userId))
      .collect();

    const muzakkis = await ctx.db
      .query("muzakkis")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
      .collect();

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_relawan", (q) => q.eq("relawanId", args.userId))
      .collect();

    return {
      user: {
        id: user._id,
        name: user.fullName,
        phone: user.phone,
        role: user.role,
        regu_id: user.regu_id,
      },
      donations: {
        count: donations.length,
        data: donations,
      },
      targets: {
        count: targets.length,
        data: targets,
      },
      muzakkis: {
        count: muzakkis.length,
        data: muzakkis,
      },
      activities: {
        count: activities.length,
        data: activities,
      },
    };
  },
});

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

export const getAllMuzakkis = query({
  args: {},
  handler: async (ctx) => {
    const muzakkis = await ctx.db.query("muzakkis").take(10);
    return {
      count: muzakkis.length,
      items: muzakkis
    };
  },
});

export const getDatabaseStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const regus = await ctx.db.query("regus").collect();
    const muzakkis = await ctx.db.query("muzakkis").collect();
    const donations = await ctx.db.query("donations").collect();
    const activities = await ctx.db.query("activities").collect();
    const targets = await ctx.db.query("targets").collect();
    const templates = await ctx.db.query("messageTemplates").collect();
    const programs = await ctx.db.query("programs").collect();
    const chatMessages = await ctx.db.query("chatMessages").collect();

    // Count users by role
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count donations by category
    const donationsByCategory = donations.reduce((acc, donation) => {
      acc[donation.category] = (acc[donation.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count muzakkis by status
    const muzakkisByStatus = muzakkis.reduce((acc, muzakki) => {
      acc[muzakki.status] = (acc[muzakki.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      stats: {
        totalUsers: users.length,
        totalRegus: regus.length,
        totalMuzakkis: muzakkis.length,
        totalDonations: donations.length,
        totalActivities: activities.length,
        totalTargets: targets.length,
        totalTemplates: templates.length,
        totalPrograms: programs.length,
        totalChatMessages: chatMessages.length,
      },
      breakdown: {
        usersByRole,
        donationsByCategory,
        muzakkisByStatus,
      },
      sampleData: {
        users: users.slice(0, 3).map(user => ({
          id: user._id,
          name: user.fullName,
          role: user.role,
          regu: user.regu_id,
        })),
        regus: regus.map(regu => ({
          id: regu._id,
          name: regu.name,
          pembimbing: regu.pembimbingId,
        })),
        donations: donations.slice(0, 3).map(donation => ({
          id: donation._id,
          amount: donation.amount,
          category: donation.category,
          type: donation.type,
        })),
      }
    };
  },
});