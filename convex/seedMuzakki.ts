import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedForUser = mutation({
    args: { relawanId: v.id("users") },
    handler: async (ctx, args) => {
        const muzakkis = [
            {
                name: "Budi Santoso",
                phone: "+6281234567890",
                city: "Jakarta",
                status: "baru",
                notes: "Tertarik dengan program wakaf",
                createdBy: args.relawanId,
                createdAt: Date.now(),
                lastContact: Date.now(),
            },
            {
                name: "Siti Aminah",
                phone: "+6281234567891",
                city: "Depok",
                status: "follow-up",
                notes: "Sudah dikirim proposal",
                createdBy: args.relawanId,
                createdAt: Date.now(),
                lastContact: Date.now() - 86400000, // 1 day ago
            },
            {
                name: "Ahmad Dahlan",
                phone: "+6281234567892",
                city: "Bogor",
                status: "donasi",
                notes: "Donatur rutin bulanan",
                createdBy: args.relawanId,
                createdAt: Date.now(),
                lastContact: Date.now() - 172800000, // 2 days ago
            },
        ];

        const ids = [];
        for (const m of muzakkis) {
            const id = await ctx.db.insert("muzakkis", m as any);
            ids.push(id);
        }

        return { count: ids.length, ids };
    },
});
