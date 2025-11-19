import { mutation } from "./_generated/server";

export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🗑️ Starting to clear all data from production...");
    
    const tables = ["users", "regus", "muzakkis", "donations", "activities", "targets", "messageTemplates", "programs", "otpLogs"];
    
    let totalDeleted = 0;
    
    for (const table of tables) {
      try {
        const documents = await ctx.db.query(table).collect();
        console.log(`🗑️ Found ${documents.length} documents in ${table}`);
        
        for (const doc of documents) {
          await ctx.db.delete(doc._id);
        }
        
        totalDeleted += documents.length;
        console.log(`✅ Cleared ${documents.length} documents from ${table}`);
      } catch (error) {
        console.error(`❌ Error clearing ${table}:`, error);
      }
    }
    
    console.log(`✅ All data cleared! Total documents deleted: ${totalDeleted}`);
    
    return {
      success: true,
      message: `Cleared ${totalDeleted} documents from database`,
      totalDeleted
    };
  },
});