import { query } from "./_generated/server";

export const verifyProductionData = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const regus = await ctx.db.query("regus").collect();
    
    console.log('🔍 Verifying Production Data...');
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Regus: ${regus.length}`);
    
    // Show specific users with roles
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('👥 Users by Role:', usersByRole);
    
    // Show sample users
    const sampleUsers = users.slice(0, 5).map(user => ({
      id: user._id,
      name: user.fullName,
      role: user.role,
      phone: user.phone,
      regu: user.regu_id
    }));
    
    console.log('📋 Sample Users:', sampleUsers);
    
    return {
      totalUsers: users.length,
      totalRegus: regus.length,
      usersByRole,
      sampleUsers
    };
  },
});