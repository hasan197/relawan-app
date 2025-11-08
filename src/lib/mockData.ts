import type { User, Muzakki, Donation, Activity, Target, LeaderboardEntry, MessageTemplate, Program, Regu } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Hasan',
  phone: '+62812345678',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hasan',
  role: 'relawan',
  reguId: 'regu-1',
  reguName: 'Regu Al-Ikhlas'
};

export const mockMuzakki: Muzakki[] = [
  {
    id: '1',
    name: 'Ahmad Syarif',
    phone: '+62812345001',
    city: 'Jakarta',
    status: 'donasi',
    notes: 'Rutin donasi setiap bulan',
    lastContact: new Date('2025-11-07'),
    createdBy: '1',
    createdAt: new Date('2025-10-01')
  },
  {
    id: '2',
    name: 'Fatimah Azzahra',
    phone: '+62812345002',
    city: 'Bandung',
    status: 'follow-up',
    notes: 'Tertarik untuk wakaf',
    lastContact: new Date('2025-11-05'),
    createdBy: '1',
    createdAt: new Date('2025-10-15')
  },
  {
    id: '3',
    name: 'Muhammad Rizki',
    phone: '+62812345003',
    city: 'Surabaya',
    status: 'baru',
    notes: 'Kontak dari acara sosialisasi',
    createdBy: '1',
    createdAt: new Date('2025-11-06')
  },
  {
    id: '4',
    name: 'Siti Nurhaliza',
    phone: '+62812345004',
    city: 'Jakarta',
    status: 'follow-up',
    notes: 'Butuh info lebih detail tentang zakat profesi',
    lastContact: new Date('2025-11-06'),
    createdBy: '1',
    createdAt: new Date('2025-10-20')
  }
];

export const mockDonations: Donation[] = [
  {
    id: '1',
    amount: 250000,
    category: 'infaq',
    donorName: 'Kegiatan Jumat Berkah',
    relawanId: '1',
    eventName: 'Jumat Berkah',
    createdAt: new Date('2025-11-08T10:00:00'),
    type: 'incoming'
  },
  {
    id: '2',
    amount: 100000,
    category: 'sedekah',
    donorName: 'Ahmad Syarif',
    donorId: '1',
    relawanId: '1',
    createdAt: new Date('2025-11-08T05:00:00'),
    type: 'incoming'
  },
  {
    id: '3',
    amount: 400000,
    category: 'zakat',
    donorName: 'Panti Asuhan Al-Amin',
    relawanId: '1',
    createdAt: new Date('2025-11-07T14:00:00'),
    type: 'outgoing'
  },
  {
    id: '4',
    amount: 500000,
    category: 'zakat',
    donorName: 'Bapak Wijaya',
    relawanId: '1',
    createdAt: new Date('2025-11-06T09:00:00'),
    type: 'incoming'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'donation',
    title: 'Kegiatan Jumat Berkah',
    amount: 250000,
    time: new Date('2025-11-08T10:00:00'),
    relawanId: '1'
  },
  {
    id: '2',
    type: 'donation',
    title: 'Donasi dari Ahmad',
    amount: 100000,
    time: new Date('2025-11-08T05:00:00'),
    relawanId: '1'
  },
  {
    id: '3',
    type: 'distribution',
    title: 'Penyaluran ke Panti Asuhan',
    amount: 400000,
    time: new Date('2025-11-07T14:00:00'),
    relawanId: '1'
  },
  {
    id: '4',
    type: 'follow-up',
    title: 'Follow-up Fatimah Azzahra',
    time: new Date('2025-11-05T16:00:00'),
    relawanId: '1'
  }
];

export const mockTarget: Target = {
  id: '1',
  relawanId: '1',
  targetAmount: 15000000,
  currentAmount: 12450000,
  targetMuzakki: 20,
  currentMuzakki: 12,
  period: 'November 2025'
};

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    relawanId: '2',
    relawanName: 'Aminah Zahra',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aminah',
    totalDonations: 18500000,
    muzakkiCount: 18,
    reguName: 'Regu Al-Ikhlas'
  },
  {
    rank: 2,
    relawanId: '1',
    relawanName: 'Hasan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hasan',
    totalDonations: 12450000,
    muzakkiCount: 12,
    reguName: 'Regu Al-Ikhlas'
  },
  {
    rank: 3,
    relawanId: '3',
    relawanName: 'Yusuf Rahman',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf',
    totalDonations: 11200000,
    muzakkiCount: 15,
    reguName: 'Regu Al-Ikhlas'
  },
  {
    rank: 4,
    relawanId: '4',
    relawanName: 'Khadijah',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khadijah',
    totalDonations: 9800000,
    muzakkiCount: 10,
    reguName: 'Regu Al-Ikhlas'
  }
];

export const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    title: 'Ajakan Zakat Profesi',
    category: 'zakat',
    content: 'Assalamualaikum Bapak/Ibu {{nama}},\n\nSemoga selalu dalam lindungan Allah SWT. Kami dari {{lembaga}} ingin mengingatkan tentang kewajiban zakat profesi. Mari tunaikan zakat Anda melalui kami dan salurkan kepada yang berhak.\n\nInfo lebih lanjut: {{link}}\n\nJazakumullah khairan.',
    tags: ['zakat', 'profesi', 'pengingat']
  },
  {
    id: '2',
    title: 'Ucapan Terima Kasih',
    category: 'umum',
    content: 'Barakallahu fiikum Bapak/Ibu {{nama}},\n\nTerima kasih atas donasi Anda sebesar Rp {{nominal}}. Semoga menjadi amal jariyah dan membawa keberkahan.\n\nResi: {{resi}}\nTanggal: {{tanggal}}\n\nWassalamualaikum.',
    tags: ['terima kasih', 'resi']
  },
  {
    id: '3',
    title: 'Program Infaq Ramadhan',
    category: 'infaq',
    content: 'Assalamualaikum Bapak/Ibu {{nama}},\n\nMenyambut bulan Ramadhan, kami mengajak Anda untuk berinfaq membantu saudara kita yang membutuhkan.\n\nTarget: {{target}}\nTerkumpul: {{terkumpul}}\n\nInfo: {{link}}\n\nJazakallah.',
    tags: ['infaq', 'ramadhan', 'program']
  },
  {
    id: '4',
    title: 'Ajakan Wakaf',
    category: 'wakaf',
    content: 'Assalamualaikum Bapak/Ibu {{nama}},\n\nMari berinvestasi untuk akhirat dengan berwakaf. Wakaf Anda akan terus mengalir pahalanya.\n\nProgram Wakaf: {{program}}\nNominal minimum: {{minimum}}\n\nInfo: {{link}}',
    tags: ['wakaf', 'investasi akhirat']
  }
];

export const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'Zakat Fitrah 1446 H',
    description: 'Program pengumpulan dan penyaluran zakat fitrah untuk membantu fakir miskin di bulan Ramadhan',
    category: 'zakat',
    targetAmount: 50000000,
    currentAmount: 32500000,
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
    donationLink: 'https://donasi.example.com/zakat-fitrah',
    isActive: true
  },
  {
    id: '2',
    title: 'Infaq Pembangunan Masjid',
    description: 'Bergabunglah dalam membangun rumah Allah untuk umat',
    category: 'infaq',
    targetAmount: 100000000,
    currentAmount: 45000000,
    imageUrl: 'https://images.unsplash.com/photo-1564769610726-4b3b8b8b8b8b?w=800',
    donationLink: 'https://donasi.example.com/infaq-masjid',
    isActive: true
  },
  {
    id: '3',
    title: 'Sedekah Pangan',
    description: 'Berbagi kebahagiaan dengan menyalurkan paket sembako untuk keluarga dhuafa',
    category: 'sedekah',
    targetAmount: 25000000,
    currentAmount: 18500000,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    donationLink: 'https://donasi.example.com/sedekah-pangan',
    isActive: true
  },
  {
    id: '4',
    title: 'Wakaf Produktif',
    description: 'Wakaf untuk pembangunan toko/kios yang hasilnya disalurkan untuk pendidikan anak yatim',
    category: 'wakaf',
    targetAmount: 200000000,
    currentAmount: 87000000,
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    donationLink: 'https://donasi.example.com/wakaf-produktif',
    isActive: true
  }
];

export const mockRegus: Regu[] = [
  {
    id: 'regu-1',
    name: 'Regu Al-Ikhlas',
    pembimbingId: 'p1',
    pembimbingName: 'Ustadz Abdullah',
    memberCount: 8,
    totalDonations: 52000000
  },
  {
    id: 'regu-2',
    name: 'Regu Al-Amanah',
    pembimbingId: 'p2',
    pembimbingName: 'Ustadzah Maryam',
    memberCount: 6,
    totalDonations: 48500000
  },
  {
    id: 'regu-3',
    name: 'Regu Al-Barakah',
    pembimbingId: 'p1',
    pembimbingName: 'Ustadz Abdullah',
    memberCount: 7,
    totalDonations: 41200000
  }
];
