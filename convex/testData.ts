import { query } from "./_generated/server";

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