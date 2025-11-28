/**
 * Data aggregation utilities for dashboard and reports
 */

interface Donation {
    id: string;
    amount: number;
    category: string;
    created_at: string;
    muzakki_id?: string;
    relawan_id?: string;
    type?: 'incoming' | 'outgoing'; // Add type field
}

interface Muzakki {
    id: string;
    name: string;
    phone: string;
    city: string;
    created_at: string;
}

/**
 * Get donations grouped by month for the last 6 months
 */
export function getMonthlyDonations(donations: Donation[]) {
    const now = new Date();
    const months: Array<{ month: string; monthKey: string; zakat: number; infaq: number; sedekah: number; wakaf: number; total: number }> = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            month: date.toLocaleDateString('id-ID', { month: 'short' }),
            monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            zakat: 0,
            infaq: 0,
            sedekah: 0,
            wakaf: 0,
            total: 0
        });
    }

    // Aggregate donations by month and category (only incoming)
    donations.forEach(donation => {
        // Filter only incoming donations
        if (donation.type !== 'incoming') return;

        const donationDate = new Date(donation.created_at);
        const monthKey = `${donationDate.getFullYear()}-${String(donationDate.getMonth() + 1).padStart(2, '0')}`;

        const monthData = months.find(m => m.monthKey === monthKey);
        if (monthData) {
            const category = donation.category.toLowerCase();
            // Only update if category is one of the known categories
            if (category === 'zakat' || category === 'infaq' || category === 'sedekah' || category === 'wakaf') {
                monthData[category] += donation.amount;
            }
            monthData.total += donation.amount;
        }
    });

    return months;
}

/**
 * Get donations grouped by day for the last 7 days
 */
export function getWeeklyTrend(donations: Donation[]) {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const now = new Date();
    const weekData: Array<{ date: string; dateKey: string; amount: number }> = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayKey = date.toISOString().split('T')[0];

        weekData.push({
            date: days[date.getDay()],
            dateKey: dayKey,
            amount: 0
        });
    }

    // Aggregate donations by day (only incoming)
    donations.forEach(donation => {
        // Filter only incoming donations
        if (donation.type !== 'incoming') return;

        const donationDate = new Date(donation.created_at);
        const dayKey = donationDate.toISOString().split('T')[0];

        const dayData = weekData.find(d => d.dateKey === dayKey);
        if (dayData) {
            dayData.amount += donation.amount;
        }
    });

    // Return without converting to millions - keep original amounts
    return weekData.map(({ date, amount }) => ({ date, amount }));
}

/**
 * Get top muzakki by total donations
 */
export function getTopMuzakki(donations: Donation[], muzakkiList: Muzakki[], limit = 5) {
    // Group donations by muzakki
    const muzakkiDonations = new Map<string, { total: number; count: number; name: string }>();

    donations.forEach(donation => {
        if (!donation.muzakki_id) return;

        const existing = muzakkiDonations.get(donation.muzakki_id);
        const muzakki = muzakkiList.find(m => m.id === donation.muzakki_id);

        if (existing) {
            existing.total += donation.amount;
            existing.count += 1;
        } else if (muzakki) {
            muzakkiDonations.set(donation.muzakki_id, {
                total: donation.amount,
                count: 1,
                name: muzakki.name
            });
        }
    });

    // Convert to array and sort by total
    const topMuzakki = Array.from(muzakkiDonations.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);

    return topMuzakki;
}

/**
 * Get monthly trend for donations vs distributions
 */
export function getMonthlyTrend(donations: Donation[]) {
    const now = new Date();
    const months: Array<{ month: string; monthKey: string; donasi: number; penyaluran: number }> = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            month: date.toLocaleDateString('id-ID', { month: 'short' }),
            monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            donasi: 0,
            penyaluran: 0
        });
    }

    // Aggregate donations by month
    donations.forEach(donation => {
        const donationDate = new Date(donation.created_at);
        const monthKey = `${donationDate.getFullYear()}-${String(donationDate.getMonth() + 1).padStart(2, '0')}`;

        const monthData = months.find(m => m.monthKey === monthKey);
        if (monthData) {
            if (donation.type === 'incoming') {
                monthData.donasi += donation.amount;
            } else if (donation.type === 'outgoing') {
                monthData.penyaluran += donation.amount;
            }
        }
    });

    // Return original amounts without conversion
    return months.map(m => ({
        month: m.month,
        donasi: m.donasi,
        penyaluran: m.penyaluran
    }));
}

/**
 * Calculate percentage change from previous period
 */
export function calculatePercentageChange(current: number, previous: number): string {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
}

/**
 * Get previous period data for comparison
 */
export function getPreviousPeriodData(donations: Donation[], period: 'week' | 'month' | 'year') {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === 'week') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 14);
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 7);
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() - 1, 0);
    } else {
        startDate = new Date(now.getFullYear() - 2, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
    }

    const previousDonations = donations.filter(d => {
        const date = new Date(d.created_at);
        return date >= startDate && date <= endDate;
    });

    return previousDonations.reduce((sum, d) => sum + d.amount, 0);
}
