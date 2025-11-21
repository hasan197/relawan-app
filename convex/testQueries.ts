import { query } from "./_generated/server";
import { v } from "convex/values";

// Test query to verify database connection
export const testConnection = query({
  handler: async (ctx) => {
    // This will throw if the connection fails
    await ctx.db.query("users").collect();
    return { status: "connected" };
  },
});

// Test query to get all users
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Test query to get all regus
export const getAllRegus = query({
  handler: async (ctx) => {
    return await ctx.db.query("regus").collect();
  },
});

// Get all donations
export const getAllDonations = query({
  handler: async (ctx) => {
    return await ctx.db.query("donations").collect();
  },
});

// Get all targets
export const getAllTargets = query({
  handler: async (ctx) => {
    return await ctx.db.query("targets").collect();
  },
});

// Get all muzakkis
export const getAllMuzakkis = query({
  handler: async (ctx) => {
    return await ctx.db.query("muzakkis").collect();
  },
});
