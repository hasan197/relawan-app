export type UserRole = 'relawan' | 'pembimbing' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  reguId?: string;
  reguName?: string;
}

export interface Muzakki {
  id: string;
  name: string;
  phone: string;
  city?: string;
  status: 'baru' | 'follow-up' | 'donasi';
  notes?: string;
  lastContact?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface Donation {
  id: string;
  amount: number;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
  donorName: string;
  donorId?: string;
  relawanId: string;
  eventName?: string;
  createdAt: Date;
  type: 'incoming' | 'outgoing';
}

export interface Regu {
  id: string;
  name: string;
  pembimbingId: string;
  pembimbingName: string;
  memberCount: number;
  totalDonations: number;
}

export interface Activity {
  id: string;
  type: 'donation' | 'follow-up' | 'distribution';
  title: string;
  amount?: number;
  time: Date;
  relawanId: string;
}

export interface Target {
  id: string;
  relawanId: string;
  targetAmount: number;
  currentAmount: number;
  targetMuzakki: number;
  currentMuzakki: number;
  period: string;
}

export interface LeaderboardEntry {
  rank: number;
  relawanId: string;
  relawanName: string;
  avatar?: string;
  totalDonations: number;
  muzakkiCount: number;
  reguName?: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf' | 'umum';
  content: string;
  tags: string[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
  donationLink: string;
  isActive: boolean;
}
