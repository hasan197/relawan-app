import { query } from "./_generated/server";

export const verifyAllProductionData = query({
    args: {},
    handler: async (ctx) => {
        console.log('🔍 Verifying All Production Data...');

        const users = await ctx.db.query("users").collect();
        const regus = await ctx.db.query("regus").collect();
        const muzakkis = await ctx.db.query("muzakkis").collect();
        const donations = await ctx.db.query("donations").collect();
        const activities = await ctx.db.query("activities").collect();
        const targets = await ctx.db.query("targets").collect();
        const messageTemplates = await ctx.db.query("messageTemplates").collect();
        const programs = await ctx.db.query("programs").collect();

        const stats = {
            users: users.length,
            regus: regus.length,
            muzakkis: muzakkis.length,
            donations: donations.length,
            activities: activities.length,
            targets: targets.length,
            messageTemplates: messageTemplates.length,
            programs: programs.length,
        };

        console.log('📊 Production Database Statistics:');
        console.log(`   - Users: ${stats.users}`);
        console.log(`   - Regus: ${stats.regus}`);
        console.log(`   - Muzakkis: ${stats.muzakkis}`);
        console.log(`   - Donations: ${stats.donations}`);
        console.log(`   - Activities: ${stats.activities}`);
        console.log(`   - Targets: ${stats.targets}`);
        console.log(`   - Message Templates: ${stats.messageTemplates}`);
        console.log(`   - Programs: ${stats.programs}`);

        // Check if seeding is needed
        const needsSeeding =
            stats.users === 0 ||
            stats.regus === 0 ||
            stats.muzakkis === 0 ||
            stats.donations === 0 ||
            stats.programs === 0;

        if (needsSeeding) {
            console.log('⚠️ WARNING: Some tables are empty! Seeding may be required.');
        } else {
            console.log('✅ All tables have data!');
        }

        return {
            stats,
            needsSeeding,
            message: needsSeeding
                ? 'Some tables are empty. Please run seeding.'
                : 'All production data is present.',
        };
    },
});
