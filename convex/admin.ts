import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// ==================== USER MANAGEMENT ====================

// Get all users (Admin only)
export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    // Enrich with regu information
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        let reguName = null;
        if (user.regu_id) {
          const regu = await ctx.db.get(user.regu_id);
          reguName = regu?.name || null;
        }
        
        return {
          ...user,
          regu_name: reguName,
        };
      })
    );

    return enrichedUsers;
  },
});

// Create user (Admin)
export const createUser = mutation({
  args: {
    fullName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    role: v.union(v.literal("relawan"), v.literal("pembimbing"), v.literal("admin")),
    regu_id: v.optional(v.id("regus")),
  },
  handler: async (ctx, args) => {
    // Check if phone already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (existingUser) {
      throw new Error("Nomor telepon sudah terdaftar");
    }

    const userId = await ctx.db.insert("users", {
      fullName: args.fullName,
      phone: args.phone,
      email: args.email || `${args.phone}@ziswaf.app`,
      role: args.role,
      regu_id: args.regu_id,
      createdAt: Date.now(),
    });

    const user = await ctx.db.get(userId);
    return user;
  },
});

// Update user (Admin)
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.union(v.literal("relawan"), v.literal("pembimbing"), v.literal("admin"))),
    regu_id: v.optional(v.id("regus")),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    // Check if phone already exists (if updating phone)
    if (updates.phone) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_phone", (q) => q.eq("phone", updates.phone))
        .first();

      if (existingUser && existingUser._id !== userId) {
        throw new Error("Nomor telepon sudah terdaftar");
      }
    }

    const updatedUser = await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return updatedUser;
  },
});

// Delete user (Admin)
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if user has dependencies
    const muzakkis = await ctx.db
      .query("muzakkis")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
      .collect();

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_relawan", (q) => q.eq("relawanId", args.userId))
      .collect();

    if (muzakkis.length > 0 || donations.length > 0) {
      throw new Error("Tidak dapat menghapus user yang memiliki data terkait");
    }

    await ctx.db.delete(args.userId);
    return { success: true };
  },
});

// ==================== REGU MANAGEMENT ====================

// Get all regus
export const getAllRegus = query({
  handler: async (ctx) => {
    const regus = await ctx.db.query("regus").collect();
    
    // Enrich with member count and pembimbing info
    const enrichedRegus = await Promise.all(
      regus.map(async (regu) => {
        // Get pembimbing info
        const pembimbing = await ctx.db.get(regu.pembimbingId);
        
        // Count members
        const members = await ctx.db
          .query("users")
          .withIndex("by_regu", (q) => q.eq("regu_id", regu._id))
          .collect();
        
        // Calculate total donations from members
        const memberIds = members.map(m => m._id);
        const donations = await Promise.all(
          memberIds.map(async (memberId) => {
            const memberDonations = await ctx.db
              .query("donations")
              .withIndex("by_relawan", (q) => q.eq("relawanId", memberId))
              .collect();
            return memberDonations.reduce((sum, d) => sum + d.amount, 0);
          })
        );
        
        const totalDonations = donations.reduce((sum, amount) => sum + amount, 0);

        return {
          ...regu,
          pembimbing_name: pembimbing?.fullName || null,
          member_count: members.length,
          total_donations: totalDonations,
          target: regu.targetAmount || 60000000,
        };
      })
    );

    return enrichedRegus;
  },
});

// Create regu (Admin)
export const createRegu = mutation({
  args: {
    name: v.string(),
    pembimbingId: v.id("users"),
    targetAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Generate join code
    const generateJoinCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const joinCode = generateJoinCode();

    const reguId = await ctx.db.insert("regus", {
      name: args.name,
      pembimbingId: args.pembimbingId,
      targetAmount: args.targetAmount || 60000000,
      joinCode,
      memberCount: 0,
      totalDonations: 0,
      createdAt: Date.now(),
    });

    // Update pembimbing's regu_id
    await ctx.db.patch(args.pembimbingId, {
      regu_id: reguId,
      updatedAt: Date.now(),
    });

    const regu = await ctx.db.get(reguId);
    return regu;
  },
});

// Update regu (Admin)
export const updateRegu = mutation({
  args: {
    reguId: v.id("regus"),
    name: v.optional(v.string()),
    pembimbingId: v.optional(v.id("users")),
    targetAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { reguId, ...updates } = args;

    // If pembimbing is being updated, update old and new pembimbing's regu_id
    if (updates.pembimbingId) {
      const currentRegu = await ctx.db.get(reguId);
      if (currentRegu && currentRegu.pembimbingId !== updates.pembimbingId) {
        // Remove regu_id from old pembimbing
        await ctx.db.patch(currentRegu.pembimbingId, {
          regu_id: undefined,
          updatedAt: Date.now(),
        });
        
        // Set regu_id for new pembimbing
        await ctx.db.patch(updates.pembimbingId, {
          regu_id: reguId,
          updatedAt: Date.now(),
        });
      }
    }

    const updatedRegu = await ctx.db.patch(reguId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return updatedRegu;
  },
});

// Delete regu
export const deleteRegu = mutation({
  args: {
    reguId: v.id("regus"),
  },
  handler: async (ctx, args) => {
    // Check if regu has members
    const members = await ctx.db
      .query("users")
      .withIndex("by_regu", (q) => q.eq("regu_id", args.reguId))
      .collect();

    if (members.length > 0) {
      throw new Error("Tidak dapat menghapus regu yang memiliki anggota");
    }

    await ctx.db.delete(args.reguId);
    return { success: true };
  },
});

// ==================== MUZAKKI MANAGEMENT ====================

// Get all muzakkis
export const getAllMuzakkis = query({
  handler: async (ctx) => {
    const muzakkis = await ctx.db.query("muzakkis").collect();
    
    // Enrich with relawan name
    const enrichedMuzakkis = await Promise.all(
      muzakkis.map(async (muzakki) => {
        const relawan = await ctx.db.get(muzakki.createdBy);
        return {
          ...muzakki,
          relawan_name: relawan?.fullName || relawan?.name || null,
        };
      })
    );

    return enrichedMuzakkis;
  },
});

// Create muzakki
export const createMuzakki = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    category: v.union(v.literal("muzakki"), v.literal("donatur"), v.literal("prospek")),
    createdBy: v.id("users"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if phone already exists
    const existingMuzakki = await ctx.db
      .query("muzakkis")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (existingMuzakki) {
      throw new Error("Nomor telepon sudah terdaftar");
    }

    const muzakkiId = await ctx.db.insert("muzakkis", {
      name: args.name,
      phone: args.phone,
      address: args.address,
      city: args.city,
      category: args.category,
      status: "baru",
      notes: args.notes,
      createdBy: args.createdBy,
      lastContact: Date.now(),
      createdAt: Date.now(),
    });

    const muzakki = await ctx.db.get(muzakkiId);
    return muzakki;
  },
});

// Update muzakki
export const updateMuzakki = mutation({
  args: {
    muzakkiId: v.id("muzakkis"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    category: v.optional(v.union(v.literal("muzakki"), v.literal("donatur"), v.literal("prospek"))),
    status: v.optional(v.union(v.literal("baru"), v.literal("follow-up"), v.literal("donasi"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { muzakkiId, ...updates } = args;

    // Check if phone already exists (if updating phone)
    if (updates.phone) {
      const existingMuzakki = await ctx.db
        .query("muzakkis")
        .withIndex("by_phone", (q) => q.eq("phone", updates.phone))
        .first();

      if (existingMuzakki && existingMuzakki._id !== muzakkiId) {
        throw new Error("Nomor telepon sudah terdaftar");
      }
    }

    const updatedMuzakki = await ctx.db.patch(muzakkiId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return updatedMuzakki;
  },
});

// Delete muzakki
export const deleteMuzakki = mutation({
  args: {
    muzakkiId: v.id("muzakkis"),
  },
  handler: async (ctx, args) => {
    // Check if muzakki has donations
    const donations = await ctx.db
      .query("donations")
      .filter((q) => q.eq(q.field("donorId"), args.muzakkiId))
      .collect();

    if (donations.length > 0) {
      throw new Error("Tidak dapat menghapus muzakki yang memiliki donasi");
    }

    await ctx.db.delete(args.muzakkiId);
    return { success: true };
  },
});

// ==================== ADMIN STATISTICS ====================

// Get global statistics
export const getGlobalStats = query({
  handler: async (ctx) => {
    // Get all data
    const [users, muzakkis, regus, donations] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("muzakkis").collect(),
      ctx.db.query("regus").collect(),
      ctx.db.query("donations").collect(),
    ]);

    // Calculate statistics
    const totalRelawan = users.filter(u => u.role === "relawan").length;
    const totalDonations = donations
      .filter(d => d.type === "incoming")
      .reduce((sum, d) => sum + d.amount, 0);
    
    const pendingDonations = donations.filter(d => d.status === "pending" || d.status === undefined).length;

    const byCategory = donations
      .filter(d => d.type === "incoming")
      .reduce((acc, d) => {
        acc[d.category] = (acc[d.category] || 0) + d.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      total_donations: totalDonations,
      total_muzakki: muzakkis.length,
      total_relawan: totalRelawan,
      total_regu: regus.length,
      pendingDonations,
      by_category: byCategory,
    };
  },
});

// Get regu statistics
export const getReguStats = query({
  handler: async (ctx) => {
    const regus = await ctx.db.query("regus").collect();
    
    // Get all users and donations for enrichment
    const users = await ctx.db.query("users").collect();
    const donations = await ctx.db.query("donations").collect();
    const muzakkis = await ctx.db.query("muzakkis").collect();

    // Calculate stats for each regu
    const reguStats = await Promise.all(
      regus.map(async (regu) => {
        // Count members in this regu
        const members = users.filter(u => u.regu_id === regu._id);
        
        // Calculate total donations from members
        const memberIds = members.map(m => m._id);
        const reguDonations = donations.filter(d => 
          d.type === "incoming" && memberIds.includes(d.relawanId)
        );
        const totalDonations = reguDonations.reduce((sum, d) => sum + d.amount, 0);

        // Count muzakki from members
        const reguMuzakki = muzakkis.filter(m => memberIds.includes(m.createdBy));

        return {
          id: regu._id,
          name: regu.name,
          pembimbing_name: members.find(m => m._id === regu.pembimbingId)?.fullName || null,
          total_donations: totalDonations,
          total_muzakki: reguMuzakki.length,
          member_count: members.length,
          target: regu.targetAmount || 60000000,
        };
      })
    );

    // Sort by total donations (descending)
    reguStats.sort((a, b) => b.total_donations - a.total_donations);

    return reguStats;
  },
});

// ==================== DATABASE MANAGEMENT ====================

// Reset entire database (Admin only - DANGEROUS)
export const resetDatabase = mutation({
  handler: async (ctx) => {
    // Get all data
    const [users, regus, muzakkis, donations, programs, templates, notifications, communications, activities, targets, otpLogs, chatMessages] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("regus").collect(),
      ctx.db.query("muzakkis").collect(),
      ctx.db.query("donations").collect(),
      ctx.db.query("programs").collect(),
      ctx.db.query("messageTemplates").collect(),
      ctx.db.query("notifications").collect(),
      ctx.db.query("communications").collect(),
      ctx.db.query("activities").collect(),
      ctx.db.query("targets").collect(),
      ctx.db.query("otpLogs").collect(),
      ctx.db.query("chatMessages").collect(),
    ]);

    console.log('📊 Items to delete:', {
      users: users.length,
      regus: regus.length,
      muzakkis: muzakkis.length,
      donations: donations.length,
      programs: programs.length,
      templates: templates.length,
      notifications: notifications.length,
      communications: communications.length,
      activities: activities.length,
      targets: targets.length,
      otpLogs: otpLogs.length,
      chatMessages: chatMessages.length,
    });

    // Delete all data
    await Promise.all([
      ...users.map(user => ctx.db.delete(user._id)),
      ...regus.map(regu => ctx.db.delete(regu._id)),
      ...muzakkis.map(muzakki => ctx.db.delete(muzakki._id)),
      ...donations.map(donation => ctx.db.delete(donation._id)),
      ...programs.map(program => ctx.db.delete(program._id)),
      ...templates.map(template => ctx.db.delete(template._id)),
      ...notifications.map(notification => ctx.db.delete(notification._id)),
      ...communications.map(communication => ctx.db.delete(communication._id)),
      ...activities.map(activity => ctx.db.delete(activity._id)),
      ...targets.map(target => ctx.db.delete(target._id)),
      ...otpLogs.map(log => ctx.db.delete(log._id)),
      ...chatMessages.map(chat => ctx.db.delete(chat._id)),
    ]);

    console.log('✅ Database cleared!');
    
    return {
      success: true,
      message: 'Database berhasil di-reset',
      deleted: users.length + regus.length + muzakkis.length + donations.length + programs.length + templates.length + notifications.length + communications.length + activities.length + targets.length + otpLogs.length + chatMessages.length
    };
  },
});

// Seed initial data (Admin only)
export const seedDatabase = mutation({
  handler: async (ctx) => {
    console.log('🌱 SEEDING DATABASE...');
    
    const generateJoinCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };
    
    // ============================================
    // 1. CREATE ADMIN USER
    // ============================================
    const adminId = await ctx.db.insert("users", {
      fullName: 'Admin ZISWAF',
      phone: '+6281234567890',
      email: 'admin@ziswaf.org',
      city: 'Jakarta',
      role: 'admin',
      regu_id: undefined,
      createdAt: Date.now(),
    });
    
    console.log('✅ Admin created:', adminId);
    
    // ============================================
    // 2. CREATE PEMBIMBING USERS
    // ============================================
    const pembimbing1Id = await ctx.db.insert("users", {
      fullName: 'Ustadz Ahmad',
      phone: '+6281234567891',
      email: 'ahmad@ziswaf.org',
      city: 'Jakarta',
      role: 'pembimbing',
      regu_id: undefined, // Will be set after creating regu
      createdAt: Date.now(),
    });
    
    const pembimbing2Id = await ctx.db.insert("users", {
      fullName: 'Ustadzah Fatimah',
      phone: '+6281234567892',
      email: 'fatimah@ziswaf.org',
      city: 'Bandung',
      role: 'pembimbing',
      regu_id: undefined,
      createdAt: Date.now(),
    });
    
    console.log('✅ Pembimbing 1 created:', pembimbing1Id);
    console.log('✅ Pembimbing 2 created:', pembimbing2Id);
    
    // ============================================
    // 3. CREATE REGUS
    // ============================================
    const regu1JoinCode = generateJoinCode();
    const regu1Id = await ctx.db.insert("regus", {
      name: 'Regu Barokah',
      pembimbingId: pembimbing1Id,
      targetAmount: 60000000,
      joinCode: regu1JoinCode,
      memberCount: 0,
      totalDonations: 0,
      createdAt: Date.now(),
    });
    
    const regu2JoinCode = generateJoinCode();
    const regu2Id = await ctx.db.insert("regus", {
      name: 'Regu Sakinah',
      pembimbingId: pembimbing2Id,
      targetAmount: 50000000,
      joinCode: regu2JoinCode,
      memberCount: 0,
      totalDonations: 0,
      createdAt: Date.now(),
    });
    
    console.log('✅ Regu 1 created:', regu1Id, 'Code:', regu1JoinCode);
    console.log('✅ Regu 2 created:', regu2Id, 'Code:', regu2JoinCode);
    
    // Update pembimbing with regu_id
    await ctx.db.patch(pembimbing1Id, {
      regu_id: regu1Id,
      updatedAt: Date.now(),
    });
    
    await ctx.db.patch(pembimbing2Id, {
      regu_id: regu2Id,
      updatedAt: Date.now(),
    });
    
    // ============================================
    // 4. CREATE RELAWAN USERS
    // ============================================
    const relawan1Id = await ctx.db.insert("users", {
      fullName: 'Budi Santoso',
      phone: '+6281234567893',
      email: 'budi@example.com',
      city: 'Jakarta',
      role: 'relawan',
      regu_id: regu1Id,
      createdAt: Date.now(),
    });
    
    const relawan2Id = await ctx.db.insert("users", {
      fullName: 'Siti Nurhaliza',
      phone: '+6281234567894',
      email: 'siti@example.com',
      city: 'Jakarta',
      role: 'relawan',
      regu_id: regu1Id,
      createdAt: Date.now(),
    });
    
    const relawan3Id = await ctx.db.insert("users", {
      fullName: 'Ahmad Fauzi',
      phone: '+6281234567895',
      email: 'ahmad@example.com',
      city: 'Bandung',
      role: 'relawan',
      regu_id: regu2Id,
      createdAt: Date.now(),
    });
    
    console.log('✅ Relawan 1 created:', relawan1Id);
    console.log('✅ Relawan 2 created:', relawan2Id);
    console.log('✅ Relawan 3 created:', relawan3Id);
    
    // ============================================
    // 5. CREATE SAMPLE MUZAKKI
    // ============================================
    const muzakki1Id = await ctx.db.insert("muzakkis", {
      name: 'Haji Muhammad',
      phone: '+628567890123',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      category: 'muzakki',
      status: 'donasi',
      notes: 'Donatur rutin',
      createdBy: relawan1Id,
      lastContact: Date.now(),
      createdAt: Date.now(),
    });
    
    const muzakki2Id = await ctx.db.insert("muzakkis", {
      name: 'Ibu Siti',
      phone: '+628567890124',
      address: 'Jl. Thamrin No. 456',
      city: 'Jakarta',
      category: 'muzakki',
      status: 'follow-up',
      notes: 'Potensi donatur besar',
      createdBy: relawan2Id,
      lastContact: Date.now(),
      createdAt: Date.now(),
    });
    
    console.log('✅ Muzakki 1 created:', muzakki1Id);
    console.log('✅ Muzakki 2 created:', muzakki2Id);
    
    // ============================================
    // 6. CREATE SAMPLE DONATIONS
    // ============================================
    const donation1Id = await ctx.db.insert("donations", {
      donorName: 'Haji Muhammad',
      donorId: muzakki1Id,
      relawanId: relawan1Id,
      relawanName: 'Budi Santoso',
      amount: 1000000,
      category: 'zakat',
      type: 'incoming',
      status: 'validated',
      paymentMethod: 'transfer',
      receiptNumber: 'ZK001',
      createdAt: Date.now(),
    });
    
    const donation2Id = await ctx.db.insert("donations", {
      donorName: 'Anonymous',
      relawanId: relawan2Id,
      relawanName: 'Siti Nurhaliza',
      amount: 500000,
      category: 'infaq',
      type: 'incoming',
      status: 'pending',
      notes: 'Menunggu bukti transfer',
      createdAt: Date.now(),
    });
    
    console.log('✅ Donation 1 created:', donation1Id);
    console.log('✅ Donation 2 created:', donation2Id);
    
    // ============================================
    // 7. CREATE SAMPLE PROGRAMS
    // ============================================
    const program1Id = await ctx.db.insert("programs", {
      title: 'Program Bantuan Korban Bencana',
      description: 'Bantuan untuk korban bencana alam di berbagai daerah',
      category: 'infaq',
      targetAmount: 50000000,
      collectedAmount: 15000000,
      status: 'active',
      isActive: true,
      createdAt: Date.now(),
    });
    
    const program2Id = await ctx.db.insert("programs", {
      title: 'Program Beasiswa Yatim',
      description: 'Beasiswa untuk anak yatim piatu',
      category: 'zakat',
      targetAmount: 30000000,
      collectedAmount: 8000000,
      status: 'active',
      isActive: true,
      createdAt: Date.now(),
    });
    
    console.log('✅ Program 1 created:', program1Id);
    console.log('✅ Program 2 created:', program2Id);
    
    // ============================================
    // 8. CREATE SAMPLE TEMPLATES
    // ============================================
    const template1Id = await ctx.db.insert("messageTemplates", {
      name: 'Template Terima Kasih',
      category: 'thanks',
      message: 'Assalamualaikum wr. wb. Terima kasih atas donasi Anda. Semoga Allah membalas kebaikan Anda.',
      variables: [],
      tags: ['terima kasih', 'donasi'],
      isActive: true,
      isShared: true,
      createdAt: Date.now(),
    });
    
    const template2Id = await ctx.db.insert("messageTemplates", {
      name: 'Template Follow Up',
      category: 'follow-up',
      message: 'Assalamualaikum wr. wb. Kami ingin follow up mengenai program donasi kami. Apakah Bapak/Ibu berminat?',
      variables: [],
      tags: ['follow up', 'program'],
      isActive: true,
      isShared: false,
      createdAt: Date.now(),
    });
    
    console.log('✅ Template 1 created:', template1Id);
    console.log('✅ Template 2 created:', template2Id);
    
    console.log('🌱 DATABASE SEEDING COMPLETED!');
    
    return {
      success: true,
      message: 'Database berhasil di-seed',
      seeded: {
        users: 6,
        regus: 2,
        muzakkis: 2,
        donations: 2,
        programs: 2,
        templates: 2,
      }
    };
  },
});
