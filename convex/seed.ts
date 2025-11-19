import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    console.log("🌱 Starting database seeding...");
    console.log("🔍 Deployment Info:");
    console.log("   - Convex URL:", process.env.CONVEX_URL || "Not set");
    console.log("   - Convex Deployment:", process.env.CONVEX_DEPLOYMENT || "Not set");
    console.log("   - Environment:", process.env.NODE_ENV || "Not set");
    console.log("   - Current deployment endpoint: quixotic-rhinoceros-311");

    // Clear existing data
    await clearExistingData(ctx);

    // Create admin user
    const adminId = await ctx.db.insert("users", {
      fullName: "Administrator",
      phone: "+628123456789",
      city: "Jakarta",
      role: "admin",
      isPhoneVerified: true,
      tokenIdentifier: "admin:admin",
      createdAt: now,
      updatedAt: now,
    });

    // Create pembimbing users
    const pembimbing1Id = await ctx.db.insert("users", {
      fullName: "Ustadz Abdullah",
      phone: "+628123456780",
      city: "Jakarta",
      role: "pembimbing",
      isPhoneVerified: true,
      tokenIdentifier: "pembimbing:abdullah",
      createdAt: now,
      updatedAt: now,
    });

    const pembimbing2Id = await ctx.db.insert("users", {
      fullName: "Ustadzah Maryam",
      phone: "+628123456781",
      city: "Bandung",
      role: "pembimbing",
      isPhoneVerified: true,
      tokenIdentifier: "pembimbing:maryam",
      createdAt: now,
      updatedAt: now,
    });

    // Create regus (teams)
    const regu1Id = await ctx.db.insert("regus", {
      name: "Regu Al-Ikhlas",
      pembimbingId: pembimbing1Id,
      description: "Regu dengan semangat keikhlasan dalam beramal",
      createdAt: now,
    });

    const regu2Id = await ctx.db.insert("regus", {
      name: "Regu Al-Amanah",
      pembimbingId: pembimbing2Id,
      description: "Regu yang menjaga amanah dengan baik",
      createdAt: now,
    });

    const regu3Id = await ctx.db.insert("regus", {
      name: "Regu Al-Barakah",
      pembimbingId: pembimbing1Id,
      description: "Regu yang membawa keberkahan",
      createdAt: now,
    });

    // Create relawan users
    const relawanIds = [];
    const relawanData = [
      { name: "Hasan", phone: "+628123456782", city: "Jakarta", reguId: regu1Id },
      { name: "Aminah Zahra", phone: "+628123456783", city: "Jakarta", reguId: regu1Id },
      { name: "Yusuf Rahman", phone: "+628123456784", city: "Bandung", reguId: regu1Id },
      { name: "Khadijah", phone: "+628123456785", city: "Surabaya", reguId: regu1Id },
      { name: "Muhammad Ali", phone: "+628123456786", city: "Jakarta", reguId: regu2Id },
      { name: "Fatimah", phone: "+628123456787", city: "Bandung", reguId: regu2Id },
      { name: "Abdul Rahman", phone: "+628123456788", city: "Surabaya", reguId: regu3Id },
      { name: "Aisyah", phone: "+628123456789", city: "Jakarta", reguId: regu3Id },
    ];

    for (const relawan of relawanData) {
      const relawanId = await ctx.db.insert("users", {
        fullName: relawan.name,
        phone: relawan.phone,
        city: relawan.city,
        role: "relawan",
        regu_id: relawan.reguId,
        isPhoneVerified: true,
        tokenIdentifier: `relawan:${relawan.phone}`,
        createdAt: now,
        updatedAt: now,
      });
      relawanIds.push(relawanId);
    }

    // Create muzakkis (donors)
    const muzakkiIds = [];
    const muzakkiData = [
      { name: "Ahmad Syarif", phone: "+628123450001", city: "Jakarta", status: "donasi", createdBy: relawanIds[0] },
      { name: "Fatimah Azzahra", phone: "+628123450002", city: "Bandung", status: "follow-up", createdBy: relawanIds[0] },
      { name: "Muhammad Rizki", phone: "+628123450003", city: "Surabaya", status: "baru", createdBy: relawanIds[0] },
      { name: "Siti Nurhaliza", phone: "+628123450004", city: "Jakarta", status: "follow-up", createdBy: relawanIds[1] },
      { name: "Budi Santoso", phone: "+628123450005", city: "Bandung", status: "donasi", createdBy: relawanIds[1] },
      { name: "Rina Wati", phone: "+628123450006", city: "Surabaya", status: "baru", createdBy: relawanIds[2] },
      { name: "Joko Widodo", phone: "+628123450007", city: "Jakarta", status: "donasi", createdBy: relawanIds[3] },
      { name: "Sri Mulyani", phone: "+628123450008", city: "Bandung", status: "follow-up", createdBy: relawanIds[4] },
    ];

    for (const muzakki of muzakkiData) {
      const muzakkiId = await ctx.db.insert("muzakkis", {
        name: muzakki.name,
        phone: muzakki.phone,
        city: muzakki.city,
        status: muzakki.status,
        notes: `Kontak dari ${muzakki.status === 'donasi' ? 'donasi rutin' : 'acara sosialisasi'}`,
        lastContact: now - (Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        createdBy: muzakki.createdBy,
        createdAt: now - (Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
      });
      muzakkiIds.push(muzakkiId);
    }

    // Create donations
    const donationData = [
      { amount: 250000, category: "infaq", donorName: "Kegiatan Jumat Berkah", relawanId: relawanIds[0], type: "incoming" },
      { amount: 100000, category: "sedekah", donorName: "Ahmad Syarif", donorId: muzakkiIds[0], relawanId: relawanIds[0], type: "incoming" },
      { amount: 400000, category: "zakat", donorName: "Panti Asuhan Al-Amin", relawanId: relawanIds[0], type: "outgoing" },
      { amount: 500000, category: "zakat", donorName: "Bapak Wijaya", relawanId: relawanIds[0], type: "incoming" },
      { amount: 750000, category: "wakaf", donorName: "Yayasan Pendidikan", relawanId: relawanIds[1], type: "incoming" },
      { amount: 300000, category: "infaq", donorName: "Masjid Al-Hidayah", relawanId: relawanIds[1], type: "outgoing" },
      { amount: 150000, category: "sedekah", donorName: "Ibu Siti", donorId: muzakkiIds[3], relawanId: relawanIds[2], type: "incoming" },
      { amount: 2000000, category: "zakat", donorName: "PT Sejahtera", relawanId: relawanIds[3], type: "incoming" },
    ];

    const donationIds = [];
    for (const donation of donationData) {
      const donationId = await ctx.db.insert("donations", {
        amount: donation.amount,
        category: donation.category,
        donorName: donation.donorName,
        donorId: donation.donorId,
        relawanId: donation.relawanId,
        eventName: donation.category === "infaq" ? "Jumat Berkah" : undefined,
        type: donation.type,
        notes: `Donasi ${donation.category} dari ${donation.donorName}`,
        createdAt: now - (Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
      });
      donationIds.push(donationId);
    }

    // Create activities
    const activityData = [
      { type: "donation", title: "Kegiatan Jumat Berkah", amount: 250000, relawanId: relawanIds[0], donationId: donationIds[0] },
      { type: "donation", title: "Donasi dari Ahmad", amount: 100000, relawanId: relawanIds[0], donationId: donationIds[1] },
      { type: "distribution", title: "Penyaluran ke Panti Asuhan", amount: 400000, relawanId: relawanIds[0], donationId: donationIds[2] },
      { type: "follow-up", title: "Follow-up Fatimah Azzahra", relawanId: relawanIds[0], muzakkiId: muzakkiIds[1] },
      { type: "donation", title: "Donasi Wakaf Produktif", amount: 750000, relawanId: relawanIds[1], donationId: donationIds[4] },
      { type: "follow-up", title: "Kunjungan ke Masjid", relawanId: relawanIds[1], muzakkiId: muzakkiIds[4] },
      { type: "donation", title: "Sedekah Harian", amount: 150000, relawanId: relawanIds[2], donationId: donationIds[6] },
      { type: "distribution", title: "Bantuan Pendidikan", amount: 300000, relawanId: relawanIds[1], donationId: donationIds[5] },
    ];

    for (const activity of activityData) {
      await ctx.db.insert("activities", {
        type: activity.type,
        title: activity.title,
        amount: activity.amount,
        relawanId: activity.relawanId,
        muzakkiId: activity.muzakkiId,
        donationId: activity.donationId,
        description: `Aktivitas ${activity.type}: ${activity.title}`,
        time: now - (Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        createdAt: now,
      });
    }

    // Create targets for relawan
    const targetData = [
      { relawanId: relawanIds[0], targetAmount: 15000000, currentAmount: 12450000, targetMuzakki: 20, currentMuzakki: 12, period: "November 2025" },
      { relawanId: relawanIds[1], targetAmount: 18000000, currentAmount: 18500000, targetMuzakki: 25, currentMuzakki: 18, period: "November 2025" },
      { relawanId: relawanIds[2], targetAmount: 12000000, currentAmount: 11200000, targetMuzakki: 15, currentMuzakki: 15, period: "November 2025" },
      { relawanId: relawanIds[3], targetAmount: 10000000, currentAmount: 9800000, targetMuzakki: 12, currentMuzakki: 10, period: "November 2025" },
    ];

    for (const target of targetData) {
      await ctx.db.insert("targets", {
        relawanId: target.relawanId,
        targetAmount: target.targetAmount,
        currentAmount: target.currentAmount,
        targetMuzakki: target.targetMuzakki,
        currentMuzakki: target.currentMuzakki,
        period: target.period,
        createdAt: now,
      });
    }

    // Create message templates
    const templateData = [
      {
        title: "Ajakan Zakat Profesi",
        category: "zakat",
        content: "Assalamualaikum Bapak/Ibu {{nama}},\n\nSemoga selalu dalam lindungan Allah SWT. Kami dari {{lembaga}} ingin mengingatkan tentang kewajiban zakat profesi. Mari tunaikan zakat Anda melalui kami dan salurkan kepada yang berhak.\n\nInfo lebih lanjut: {{link}}\n\nJazakumullah khairan.",
        tags: ["zakat", "profesi", "pengingat"],
      },
      {
        title: "Ucapan Terima Kasih",
        category: "umum",
        content: "Barakallahu fiikum Bapak/Ibu {{nama}},\n\nTerima kasih atas donasi Anda sebesar Rp {{nominal}}. Semoga menjadi amal jariyah dan membawa keberkahan.\n\nResi: {{resi}}\nTanggal: {{tanggal}}\n\nWassalamualaikum.",
        tags: ["terima kasih", "resi"],
      },
      {
        title: "Program Infaq Ramadhan",
        category: "infaq",
        content: "Assalamualaikum Bapak/Ibu {{nama}},\n\nMenyambut bulan Ramadhan, kami mengajak Anda untuk berinfaq membantu saudara kita yang membutuhkan.\n\nTarget: {{target}}\nTerkumpul: {{terkumpul}}\n\nInfo: {{link}}\n\nJazakallah.",
        tags: ["infaq", "ramadhan", "program"],
      },
      {
        title: "Ajakan Wakaf",
        category: "wakaf",
        content: "Assalamualaikum Bapak/Ibu {{nama}},\n\nMari berinvestasi untuk akhirat dengan berwakaf. Wakaf Anda akan terus mengalir pahalanya.\n\nProgram Wakaf: {{program}}\nNominal minimum: {{minimum}}\n\nInfo: {{link}}",
        tags: ["wakaf", "investasi akhirat"],
      },
    ];

    for (const template of templateData) {
      await ctx.db.insert("messageTemplates", {
        title: template.title,
        category: template.category,
        content: template.content,
        tags: template.tags,
        isActive: true,
        createdAt: now,
      });
    }

    // Create programs
    const programData = [
      {
        title: "Zakat Fitrah 1446 H",
        description: "Program pengumpulan dan penyaluran zakat fitrah untuk membantu fakir miskin di bulan Ramadhan",
        category: "zakat",
        targetAmount: 50000000,
        currentAmount: 32500000,
        imageUrl: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
        donationLink: "https://donasi.example.com/zakat-fitrah",
      },
      {
        title: "Infaq Pembangunan Masjid",
        description: "Bergabunglah dalam membangun rumah Allah untuk umat",
        category: "infaq",
        targetAmount: 100000000,
        currentAmount: 45000000,
        imageUrl: "https://images.unsplash.com/photo-1564769610726-4b3b8b8b8b8b?w=800",
        donationLink: "https://donasi.example.com/infaq-masjid",
      },
      {
        title: "Sedekah Pangan",
        description: "Berbagi kebahagiaan dengan menyalurkan paket sembako untuk keluarga dhuafa",
        category: "sedekah",
        targetAmount: 25000000,
        currentAmount: 18500000,
        imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
        donationLink: "https://donasi.example.com/sedekah-pangan",
      },
      {
        title: "Wakaf Produktif",
        description: "Wakaf untuk pembangunan toko/kios yang hasilnya disalurkan untuk pendidikan anak yatim",
        category: "wakaf",
        targetAmount: 200000000,
        currentAmount: 87000000,
        imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
        donationLink: "https://donasi.example.com/wakaf-produktif",
      },
    ];

    for (const program of programData) {
      await ctx.db.insert("programs", {
        title: program.title,
        description: program.description,
        category: program.category,
        targetAmount: program.targetAmount,
        currentAmount: program.currentAmount,
        imageUrl: program.imageUrl,
        donationLink: program.donationLink,
        isActive: true,
        createdAt: now,
      });
    }

    console.log("✅ Database seeding completed successfully!");
    console.log(`📊 Created:`);
    console.log(`   - ${relawanIds.length + 3} users (admin, pembimbing, relawan)`);
    console.log(`   - 3 regus (teams)`);
    console.log(`   - ${muzakkiIds.length} muzakkis (donors)`);
    console.log(`   - ${donationIds.length} donations`);
    console.log(`   - ${activityData.length} activities`);
    console.log(`   - ${targetData.length} targets`);
    console.log(`   - ${templateData.length} message templates`);
    console.log(`   - ${programData.length} programs`);

    return {
      success: true,
      message: "Database seeded successfully",
      stats: {
        users: relawanIds.length + 3,
        regus: 3,
        muzakkis: muzakkiIds.length,
        donations: donationIds.length,
        activities: activityData.length,
        targets: targetData.length,
        templates: templateData.length,
        programs: programData.length,
      }
    };
  },
});

// Function to clear existing data
async function clearExistingData(ctx: any) {
  const tables = ["users", "regus", "muzakkis", "donations", "activities", "targets", "messageTemplates", "programs", "otpLogs"];
  
  console.log("🗑️ Starting to clear existing data...");
  
  for (const table of tables) {
    try {
      const documents = await ctx.db.query(table).collect();
      console.log(`🗑️ Found ${documents.length} documents in ${table}`);
      
      for (const doc of documents) {
        await ctx.db.delete(doc._id);
      }
      console.log(`✅ Cleared ${table}`);
    } catch (error) {
      console.error(`❌ Error clearing ${table}:`, error);
    }
  }
  
  console.log("✅ All existing data cleared");
}