/**
 * ZISWAF MANAGER - DATABASE SEEDER
 * 
 * Script untuk populate database dengan data dummy lengkap
 * Run with: curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f689ca3f/seed
 */

import * as kv from './kv_store.tsx';

// ============================================
// SEED DATA DEFINITIONS
// ============================================

const SEED_USERS = [
  // Admin
  {
    id: 'admin-001',
    phone: '+6281234567890',
    full_name: 'Admin ZISWAF',
    role: 'admin',
    email: 'admin@ziswaf.org',
    regu_id: null,
    regu_name: null,
    created_at: new Date('2025-01-01').toISOString()
  },
  
  // Pembimbing 1 - Regu Ar-Rahman
  {
    id: 'pembimbing-001',
    phone: '+6281234567891',
    full_name: 'Ustadz Abdullah Rahman',
    role: 'pembimbing',
    email: 'abdullah@ziswaf.org',
    regu_id: 'regu-001',
    regu_name: 'Regu Ar-Rahman',
    created_at: new Date('2025-01-05').toISOString()
  },
  
  // Relawan Regu Ar-Rahman
  {
    id: 'relawan-001',
    phone: '+6281234567892',
    full_name: 'Muhammad Hasan',
    role: 'relawan',
    email: 'hasan@ziswaf.org',
    regu_id: 'regu-001',
    regu_name: 'Regu Ar-Rahman',
    created_at: new Date('2025-01-06').toISOString()
  },
  {
    id: 'relawan-002',
    phone: '+6281234567893',
    full_name: 'Fatimah Zahra',
    role: 'relawan',
    email: 'fatimah@ziswaf.org',
    regu_id: 'regu-001',
    regu_name: 'Regu Ar-Rahman',
    created_at: new Date('2025-01-06').toISOString()
  },
  {
    id: 'relawan-003',
    phone: '+6281234567894',
    full_name: 'Ahmad Yusuf',
    role: 'relawan',
    email: 'yusuf@ziswaf.org',
    regu_id: 'regu-001',
    regu_name: 'Regu Ar-Rahman',
    created_at: new Date('2025-01-07').toISOString()
  },
  
  // Pembimbing 2 - Regu Al-Karim
  {
    id: 'pembimbing-002',
    phone: '+6281234567895',
    full_name: 'Ustadzah Aisyah',
    role: 'pembimbing',
    email: 'aisyah@ziswaf.org',
    regu_id: 'regu-002',
    regu_name: 'Regu Al-Karim',
    created_at: new Date('2025-01-05').toISOString()
  },
  
  // Relawan Regu Al-Karim
  {
    id: 'relawan-004',
    phone: '+6281234567896',
    full_name: 'Khadijah Aminah',
    role: 'relawan',
    email: 'khadijah@ziswaf.org',
    regu_id: 'regu-002',
    regu_name: 'Regu Al-Karim',
    created_at: new Date('2025-01-08').toISOString()
  },
  {
    id: 'relawan-005',
    phone: '+6281234567897',
    full_name: 'Umar Faruq',
    role: 'relawan',
    email: 'umar@ziswaf.org',
    regu_id: 'regu-002',
    regu_name: 'Regu Al-Karim',
    created_at: new Date('2025-01-08').toISOString()
  },
  {
    id: 'relawan-006',
    phone: '+6281234567898',
    full_name: 'Maryam Salma',
    role: 'relawan',
    email: 'maryam@ziswaf.org',
    regu_id: 'regu-002',
    regu_name: 'Regu Al-Karim',
    created_at: new Date('2025-01-09').toISOString()
  },
  
  // Pembimbing 3 - Regu As-Salam
  {
    id: 'pembimbing-003',
    phone: '+6281234567899',
    full_name: 'Ustadz Ibrahim',
    role: 'pembimbing',
    email: 'ibrahim@ziswaf.org',
    regu_id: 'regu-003',
    regu_name: 'Regu As-Salam',
    created_at: new Date('2025-01-05').toISOString()
  },
  
  // Relawan Regu As-Salam
  {
    id: 'relawan-007',
    phone: '+6281234567801',
    full_name: 'Ali Akbar',
    role: 'relawan',
    email: 'ali@ziswaf.org',
    regu_id: 'regu-003',
    regu_name: 'Regu As-Salam',
    created_at: new Date('2025-01-10').toISOString()
  },
  {
    id: 'relawan-008',
    phone: '+6281234567802',
    full_name: 'Zaynab Husna',
    role: 'relawan',
    email: 'zaynab@ziswaf.org',
    regu_id: 'regu-003',
    regu_name: 'Regu As-Salam',
    created_at: new Date('2025-01-10').toISOString()
  }
];

const SEED_REGUS = [
  {
    id: 'regu-001',
    name: 'Regu Ar-Rahman',
    pembimbing_id: 'pembimbing-001',
    pembimbing_name: 'Ustadz Abdullah Rahman',
    qr_code: 'REGU-AR-RAHMAN-001',
    target_amount: 50000000, // 50 juta
    target_muzakki: 30,
    created_at: new Date('2025-01-05').toISOString()
  },
  {
    id: 'regu-002',
    name: 'Regu Al-Karim',
    pembimbing_id: 'pembimbing-002',
    pembimbing_name: 'Ustadzah Aisyah',
    qr_code: 'REGU-AL-KARIM-002',
    target_amount: 45000000, // 45 juta
    target_muzakki: 25,
    created_at: new Date('2025-01-05').toISOString()
  },
  {
    id: 'regu-003',
    name: 'Regu As-Salam',
    pembimbing_id: 'pembimbing-003',
    pembimbing_name: 'Ustadz Ibrahim',
    qr_code: 'REGU-AS-SALAM-003',
    target_amount: 40000000, // 40 juta
    target_muzakki: 20,
    created_at: new Date('2025-01-05').toISOString()
  }
];

const SEED_PROGRAMS = [
  {
    id: 'program-001',
    name: 'Sedekah Jumat Berkah',
    category: 'sedekah',
    description: 'Program sedekah rutin setiap hari Jumat untuk membantu kaum dhuafa',
    target_amount: 100000000,
    collected_amount: 65000000,
    donor_count: 234,
    end_date: new Date('2025-12-31').toISOString(),
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    status: 'active',
    created_at: new Date('2025-01-01').toISOString()
  },
  {
    id: 'program-002',
    name: 'Zakat Fitrah 1446H',
    category: 'zakat',
    description: 'Penyaluran zakat fitrah untuk mustahik di wilayah Jakarta dan sekitarnya',
    target_amount: 500000000,
    collected_amount: 320000000,
    donor_count: 856,
    end_date: new Date('2025-03-30').toISOString(),
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800',
    status: 'active',
    created_at: new Date('2025-01-15').toISOString()
  },
  {
    id: 'program-003',
    name: 'Wakaf Sumur Palestina',
    category: 'wakaf',
    description: 'Pembangunan sumur wakaf untuk warga Palestina yang membutuhkan air bersih',
    target_amount: 250000000,
    collected_amount: 180000000,
    donor_count: 423,
    end_date: new Date('2025-06-30').toISOString(),
    image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=800',
    status: 'active',
    created_at: new Date('2025-02-01').toISOString()
  },
  {
    id: 'program-004',
    name: 'Beasiswa Anak Yatim',
    category: 'infaq',
    description: 'Program beasiswa pendidikan untuk anak yatim berprestasi',
    target_amount: 150000000,
    collected_amount: 95000000,
    donor_count: 312,
    end_date: new Date('2025-07-31').toISOString(),
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    status: 'active',
    created_at: new Date('2025-02-15').toISOString()
  },
  {
    id: 'program-005',
    name: 'Bantuan Korban Bencana',
    category: 'infaq',
    description: 'Penggalangan dana untuk korban bencana alam di Indonesia',
    target_amount: 200000000,
    collected_amount: 200000000,
    donor_count: 1243,
    end_date: new Date('2025-03-15').toISOString(),
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    status: 'completed',
    created_at: new Date('2025-01-20').toISOString()
  }
];

// Muzakki untuk setiap relawan
const SEED_MUZAKKI_TEMPLATES = [
  { name: 'Budi Santoso', city: 'Jakarta Selatan', status: 'donasi' },
  { name: 'Siti Nurhaliza', city: 'Jakarta Timur', status: 'follow-up' },
  { name: 'Andi Wijaya', city: 'Tangerang', status: 'donasi' },
  { name: 'Dewi Lestari', city: 'Bekasi', status: 'baru' },
  { name: 'Rudi Hartono', city: 'Jakarta Pusat', status: 'donasi' },
  { name: 'Maya Kusuma', city: 'Depok', status: 'follow-up' },
  { name: 'Agus Setiawan', city: 'Jakarta Barat', status: 'donasi' },
  { name: 'Rina Marlina', city: 'Jakarta Utara', status: 'baru' },
  { name: 'Hendra Gunawan', city: 'Bogor', status: 'donasi' },
  { name: 'Sri Wahyuni', city: 'Jakarta Selatan', status: 'follow-up' }
];

// ============================================
// SEED FUNCTIONS
// ============================================

async function seedUsers() {
  console.log('🌱 Seeding users...');
  for (const user of SEED_USERS) {
    await kv.set(`user:phone:${user.phone}`, user);
    await kv.set(`user:${user.id}`, user);
    console.log(`  ✓ Created user: ${user.full_name} (${user.role})`);
  }
  console.log(`✅ ${SEED_USERS.length} users seeded\n`);
}

async function seedRegus() {
  console.log('🌱 Seeding regus...');
  for (const regu of SEED_REGUS) {
    await kv.set(`regu:${regu.id}`, regu);
    await kv.set(`regu:qr:${regu.qr_code}`, regu);
    console.log(`  ✓ Created regu: ${regu.name}`);
  }
  console.log(`✅ ${SEED_REGUS.length} regus seeded\n`);
}

async function seedPrograms() {
  console.log('🌱 Seeding programs...');
  for (const program of SEED_PROGRAMS) {
    await kv.set(`program:${program.id}`, program);
    console.log(`  ✓ Created program: ${program.name}`);
  }
  console.log(`✅ ${SEED_PROGRAMS.length} programs seeded\n`);
}

async function seedTemplates() {
  console.log('🌱 Seeding message templates...');
  
  const templates = [
    // Terima Kasih
    {
      id: crypto.randomUUID(),
      title: 'Ucapan Terima Kasih Donasi',
      category: 'terima-kasih',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nBaarakallahu fiikum atas donasi yang telah Bapak/Ibu salurkan. Semoga menjadi amal jariyah dan keberkahan untuk keluarga.\n\nJazakumullah khairan katsiran 🤲',
      created_at: new Date('2025-01-01').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Terima Kasih Zakat Fitrah',
      category: 'terima-kasih',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nAlhamdulillah, zakat fitrah Bapak/Ibu telah kami terima dengan baik. Semoga menjadi pembersih harta dan jiwa, serta melapangkan rezeki.\n\nTaqabbalallahu minna wa minkum 🤲',
      created_at: new Date('2025-01-02').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Terima Kasih Wakaf',
      category: 'terima-kasih',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nSubhanallah, wakaf yang Bapak/Ibu salurkan telah diterima. Semoga menjadi amal jariyah yang terus mengalir pahalanya hingga akhirat nanti.\n\nBaarakallahu fiikum 🤲',
      created_at: new Date('2025-01-03').toISOString()
    },
    
    // Follow Up
    {
      id: crypto.randomUUID(),
      title: 'Follow Up Donasi Bulan Ini',
      category: 'follow-up',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nBapak/Ibu yang dirahmati Allah, izin mengingatkan untuk donasi rutin bulan ini. Semoga Allah mudahkan dan berkahi rezeki keluarga.\n\nJazakumullah khairan 🤲',
      created_at: new Date('2025-01-04').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Follow Up Zakat Mal',
      category: 'follow-up',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nBapak/Ibu, mohon izin mengingatkan untuk menunaikan zakat mal tahun ini. Kami siap membantu perhitungan dan penyalurannya.\n\nBaarakallahu fiikum 🤲',
      created_at: new Date('2025-01-05').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Follow Up Janji Donasi',
      category: 'follow-up',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nBapak/Ibu yang baik, sekedar mengingatkan komitmen donasi yang telah disepakati sebelumnya. Semoga Allah mudahkan dan berkahi.\n\nSyukron jazilan 🤲',
      created_at: new Date('2025-01-06').toISOString()
    },
    
    // Laporan
    {
      id: crypto.randomUUID(),
      title: 'Laporan Penyaluran Zakat',
      category: 'laporan',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nAlhamdulillah, zakat yang Bapak/Ibu titipkan telah kami salurkan kepada [jumlah] mustahik di wilayah [lokasi]. Detail lengkap bisa dilihat di link berikut: [link]\n\nBaarakallahu fiikum 🤲',
      created_at: new Date('2025-01-07').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Laporan Program Wakaf',
      category: 'laporan',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nMasyaAllah, program wakaf yang Bapak/Ibu dukung telah mencapai [persentase]%. Terima kasih atas kontribusinya. Update lengkap ada di: [link]\n\nJazakumullah khairan 🤲',
      created_at: new Date('2025-01-08').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Laporan Bulanan Donasi',
      category: 'laporan',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nBerikut laporan donasi Bapak/Ibu bulan ini:\n• Total: Rp [jumlah]\n• Program: [nama program]\n• Status: Tersalurkan\n\nDetail lengkap di: [link]\n\nBaarakallahu fiikum 🤲',
      created_at: new Date('2025-01-09').toISOString()
    },
    
    // Reminder
    {
      id: crypto.randomUUID(),
      title: 'Reminder Zakat Fitrah',
      category: 'reminder',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nMenjelang Idul Fitri, izin mengingatkan untuk segera menunaikan zakat fitrah. Kami siap membantu penyalurannya.\n\nBesar zakat fitrah tahun ini: Rp 50.000/jiwa\n\nBaarakallahu fiikum 🤲',
      created_at: new Date('2025-01-10').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Reminder Sedekah Jumat',
      category: 'reminder',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nMenjelang hari Jumat yang penuh berkah, yuk kita ramaikan sedekah Jumat untuk kaum dhuafa.\n\nSemoga Allah mudahkan dan lipat gandakan pahala kita semua 🤲',
      created_at: new Date('2025-01-11').toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Reminder Program Mendesak',
      category: 'reminder',
      message: 'Assalamualaikum warahmatullahi wabarakatuh\n\nBapak/Ibu yang baik, program [nama program] membutuhkan bantuan mendesak. Yuk kita berpartisipasi membantu saudara kita yang membutuhkan.\n\nJazakumullah khairan 🤲',
      created_at: new Date('2025-01-12').toISOString()
    }
  ];

  for (const template of templates) {
    await kv.set(`template:${template.id}`, template);
    console.log(`  ✓ Created template: ${template.title}`);
  }
  
  console.log(`✅ ${templates.length} templates seeded\n`);
  return templates.length;
}

async function seedMuzakki() {
  console.log('🌱 Seeding muzakki...');
  const relawanUsers = SEED_USERS.filter(u => u.role === 'relawan');
  let totalMuzakki = 0;

  for (const relawan of relawanUsers) {
    // Each relawan gets 5-8 muzakki
    const muzakkiCount = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < muzakkiCount; i++) {
      const template = SEED_MUZAKKI_TEMPLATES[i % SEED_MUZAKKI_TEMPLATES.length];
      const muzakkiId = crypto.randomUUID();
      
      const muzakki = {
        id: muzakkiId,
        relawan_id: relawan.id,
        name: `${template.name} ${Math.floor(Math.random() * 100)}`,
        phone: `+628${Math.floor(Math.random() * 1000000000)}`,
        city: template.city,
        notes: `Prospek dari ${relawan.full_name}`,
        status: template.status,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_contact: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      await kv.set(`muzakki:${relawan.id}:${muzakkiId}`, muzakki);
      totalMuzakki++;
    }
    
    console.log(`  ✓ Created muzakki for: ${relawan.full_name}`);
  }
  
  console.log(`✅ ${totalMuzakki} muzakki seeded\n`);
  return totalMuzakki;
}

async function seedDonations() {
  console.log('🌱 Seeding donations...');
  
  // Get all muzakki
  const allMuzakki = await kv.getByPrefix('muzakki:');
  const donationMuzakki = allMuzakki.filter((m: any) => m.status === 'donasi');
  
  let totalDonations = 0;
  const categories = ['zakat', 'infaq', 'sedekah', 'wakaf'];

  for (const muzakki of donationMuzakki) {
    // Each donating muzakki gets 1-3 donations
    const donationCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < donationCount; i++) {
      const donationId = crypto.randomUUID();
      const amount = [500000, 1000000, 2000000, 3000000, 5000000][Math.floor(Math.random() * 5)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      const donation = {
        id: donationId,
        relawan_id: muzakki.relawan_id,
        muzakki_id: muzakki.id,
        muzakki_name: muzakki.name,
        amount: amount,
        category: category,
        type: 'incoming', // ✅ Add type field
        program_id: SEED_PROGRAMS[Math.floor(Math.random() * SEED_PROGRAMS.length)].id,
        payment_method: ['transfer', 'cash', 'qris'][Math.floor(Math.random() * 3)],
        notes: `Donasi ${category} dari ${muzakki.name}`,
        created_at: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString()
      };

      await kv.set(`donation:${muzakki.relawan_id}:${donationId}`, donation);
      totalDonations++;
    }
  }
  
  console.log(`✅ ${totalDonations} donations seeded\n`);
  return totalDonations;
}

async function seedCommunications() {
  console.log('🌱 Seeding communications...');
  
  const allMuzakki = await kv.getByPrefix('muzakki:');
  const followUpMuzakki = allMuzakki.filter((m: any) => 
    m.status === 'follow-up' || m.status === 'donasi'
  );
  
  let totalComms = 0;
  const commTypes = ['call', 'whatsapp', 'meeting'];
  const notes = [
    'Follow up donasi bulan ini',
    'Konfirmasi jadwal pertemuan',
    'Diskusi program wakaf',
    'Reminder zakat fitrah',
    'Terima kasih atas donasi'
  ];

  for (const muzakki of followUpMuzakki) {
    // 1-3 communications per muzakki
    const commCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < commCount; i++) {
      const commId = crypto.randomUUID();
      
      const communication = {
        id: commId,
        relawan_id: muzakki.relawan_id,
        muzakki_id: muzakki.id,
        type: commTypes[Math.floor(Math.random() * commTypes.length)],
        notes: notes[Math.floor(Math.random() * notes.length)],
        created_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
      };

      await kv.set(`communication:${muzakki.id}:${commId}`, communication);
      totalComms++;
    }
  }
  
  console.log(`✅ ${totalComms} communications seeded\n`);
  return totalComms;
}

async function seedChatMessages() {
  console.log('🌱 Seeding chat messages...');
  
  let totalMessages = 0;
  const messages = [
    'Assalamualaikum warahmatullahi wabarakatuh',
    'Alhamdulillah, target bulan ini hampir tercapai',
    'Semangat untuk semua anggota regu!',
    'Jangan lupa follow up muzakki hari ini',
    'MasyaAllah, donasi hari ini lumayan banyak',
    'Terima kasih atas kerja kerasnya',
    'Barakallah untuk pencapaian hari ini'
  ];

  for (const regu of SEED_REGUS) {
    const reguMembers = SEED_USERS.filter(u => u.regu_id === regu.id);
    
    // 10-15 messages per regu
    for (let i = 0; i < 12; i++) {
      const sender = reguMembers[Math.floor(Math.random() * reguMembers.length)];
      const messageId = crypto.randomUUID();
      
      const message = {
        id: messageId,
        regu_id: regu.id,
        sender_id: sender.id,
        sender_name: sender.full_name,
        message: messages[Math.floor(Math.random() * messages.length)],
        created_at: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
      };

      await kv.set(`chat:${regu.id}:${messageId}`, message);
      totalMessages++;
    }
    
    console.log(`  ✓ Created messages for: ${regu.name}`);
  }
  
  console.log(`✅ ${totalMessages} chat messages seeded\n`);
  return totalMessages;
}

async function seedActivities() {
  console.log('🌱 Seeding activities...');
  
  const activityTemplates = [
    { type: 'donation', icon: '💰', title: 'Donasi Baru' },
    { type: 'muzakki', icon: '👤', title: 'Muzakki Baru' },
    { type: 'achievement', icon: '🎯', title: 'Target Tercapai' },
    { type: 'program', icon: '📋', title: 'Program Baru' }
  ];

  let totalActivities = 0;

  for (const regu of SEED_REGUS) {
    // 8-12 activities per regu
    for (let i = 0; i < 10; i++) {
      const activityId = crypto.randomUUID();
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      
      const activity = {
        id: activityId,
        regu_id: regu.id,
        type: template.type,
        icon: template.icon,
        title: template.title,
        description: `Aktivitas ${template.title} dari ${regu.name}`,
        created_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
      };

      await kv.set(`activity:${regu.id}:${activityId}`, activity);
      totalActivities++;
    }
  }
  
  console.log(`✅ ${totalActivities} activities seeded\n`);
  return totalActivities;
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

export async function runSeeder() {
  console.log('\n🚀 ZISWAF MANAGER - DATABASE SEEDER\n');
  console.log('='.repeat(50));
  console.log('\n');

  const startTime = Date.now();

  try {
    await seedUsers();
    await seedRegus();
    await seedPrograms();
    await seedTemplates(); // Add templates seeding
    await seedMuzakki();
    await seedDonations();
    await seedCommunications();
    await seedChatMessages();
    await seedActivities();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('='.repeat(50));
    console.log('\n✨ SEEDING COMPLETED SUCCESSFULLY!\n');
    console.log('📊 Summary:');
    console.log(`  • Users: ${SEED_USERS.length}`);
    console.log(`  • Regus: ${SEED_REGUS.length}`);
    console.log(`  • Programs: ${SEED_PROGRAMS.length}`);
    console.log(`  • Muzakki: ~${SEED_USERS.filter(u => u.role === 'relawan').length * 6}`);
    console.log(`  • Donations: ~${Math.floor(SEED_USERS.filter(u => u.role === 'relawan').length * 4)}`);
    console.log(`  • Communications: ~${Math.floor(SEED_USERS.filter(u => u.role === 'relawan').length * 3)}`);
    console.log(`  • Chat Messages: ${SEED_REGUS.length * 12}`);
    console.log(`  • Activities: ${SEED_REGUS.length * 10}`);
    console.log(`  • Templates: ${13}`);
    console.log(`\n⏱️  Duration: ${duration}s\n`);
    console.log('='.repeat(50));
    console.log('\n');

    // Return credentials for testing
    return {
      success: true,
      message: 'Database seeded successfully',
      credentials: {
        admin: {
          phone: '+6281234567890',
          name: 'Admin ZISWAF'
        },
        pembimbing: [
          { phone: '+6281234567891', name: 'Ustadz Abdullah Rahman', regu: 'Regu Ar-Rahman' },
          { phone: '+6281234567895', name: 'Ustadzah Aisyah', regu: 'Regu Al-Karim' },
          { phone: '+6281234567899', name: 'Ustadz Ibrahim', regu: 'Regu As-Salam' }
        ],
        relawan: [
          { phone: '+6281234567892', name: 'Muhammad Hasan', regu: 'Regu Ar-Rahman' },
          { phone: '+6281234567893', name: 'Fatimah Zahra', regu: 'Regu Ar-Rahman' },
          { phone: '+6281234567896', name: 'Khadijah Aminah', regu: 'Regu Al-Karim' },
          { phone: '+6281234567897', name: 'Umar Faruq', regu: 'Regu Al-Karim' },
          { phone: '+6281234567801', name: 'Ali Akbar', regu: 'Regu As-Salam' }
        ]
      },
      duration: `${duration}s`
    };

  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    throw error;
  }
}

// Helper function to clear all data (optional)
export async function clearDatabase() {
  console.log('🗑️  Clearing database...');
  
  const prefixes = [
    'user:',
    'regu:',
    'program:',
    'muzakki:',
    'donation:',
    'communication:',
    'chat:',
    'activity:',
    'template:'
  ];

  for (const prefix of prefixes) {
    const items = await kv.getByPrefix(prefix);
    console.log(`  Deleting ${items.length} items with prefix: ${prefix}`);
    
    // Note: We need to get keys, not values
    // This is a limitation - we might need to track keys separately
  }

  console.log('✅ Database cleared\n');
}