import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Type for table names
type TableName = "users" | "otpLogs";

// Query documents from a table
export const queryDocuments = query({
  args: {
    table: v.string(),
    column: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      // Validate table name
      const validTables = ["users", "otpLogs"];
      if (!validTables.includes(args.table)) {
        throw new Error(`Invalid table: ${args.table}`);
      }

      const table = args.table as TableName;
      
      // Simple query without index checking
      const allDocs = await ctx.db.query(table).collect();
      return allDocs.filter((doc: any) => doc[args.column] === args.value);
    } catch (error) {
      console.error('Error in queryDocuments:', error);
      throw error;
    }
  },
});

// Insert a document into a table
export const insert = mutation({
  args: {
    table: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      // Validate table name
      const validTables = ["users", "otpLogs"];
      if (!validTables.includes(args.table)) {
        throw new Error(`Invalid table: ${args.table}`);
      }
      
      // Add timestamp if not provided
      const dataWithTimestamp = {
        ...args.data,
        createdAt: args.data.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      
      return await ctx.db.insert(args.table as any, dataWithTimestamp);
    } catch (error) {
      console.error('Error in insert:', error);
      throw error;
    }
  },
});

// Update documents in a table
export const update = mutation({
  args: {
    table: v.string(),
    column: v.string(),
    value: v.any(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      // Validate table name
      const validTables = ["users", "otpLogs"];
      if (!validTables.includes(args.table)) {
        throw new Error(`Invalid table: ${args.table}`);
      }

      // Find the document(s) to update
      const docs = await ctx.db
        .query(args.table as any)
        .withIndex(`by_${args.column}` as any, (q) => q.eq(args.column as any, args.value))
        .collect();

      // Update each matching document
      const results = [];
      for (const doc of docs) {
        const updateData = {
          ...args.data,
          updatedAt: Date.now(),
        };
        results.push(await ctx.db.patch(doc._id, updateData));
      }

      return results;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },
});

// Remove documents from a table
export const remove = mutation({
  args: {
    table: v.string(),
    column: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      // Validate table name
      const validTables = ["users", "otpLogs"];
      if (!validTables.includes(args.table)) {
        throw new Error(`Invalid table: ${args.table}`);
      }

      // Find the document(s) to delete
      const docs = await ctx.db
        .query(args.table as any)
        .withIndex(`by_${args.column}` as any, (q) => q.eq(args.column as any, args.value))
        .collect();

      // Delete each matching document
      const results = [];
      for (const doc of docs) {
        results.push(await ctx.db.delete(doc._id));
      }

      return results;
    } catch (error) {
      console.error('Error in remove:', error);
      throw error;
    }
  },
});
