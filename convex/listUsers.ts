import { query } from "./_generated/server";
import { v } from "convex/values";

export default query({
  args: {},
  handler: async (ctx) => {
    // List all users
    const users = await ctx.db.query("users").collect();
    return users;
  },
});
