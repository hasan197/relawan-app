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
