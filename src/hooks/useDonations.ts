import { useState, useEffect } from 'react';
import { apiCall } from '../lib/supabase';
import { useFileUpload } from './useFileUpload';

interface Donation {
  id: string;
  relawan_id: string;
  relawan_name: string;
  donor_id: string | null;
  donor_name: string;
  amount: number;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
  type: 'incoming' | 'outgoing';
  receipt_number: string | null;
  notes: string | null;
  bukti_transfer_url: string | null;
  payment_method: string | null;
  status: 'pending' | 'validated' | 'rejected';
  validated_by: string | null;
  validated_by_name: string | null;
  validated_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export function useDonations(relawanId: string | null) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { uploadFile, uploading: fileUploading, progress } = useFileUpload();
  const deleteFile = async (donationId: string) => {
    try {
      await apiCall(`/donations/${donationId}/bukti`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      console.error('❌ Delete bukti transfer error:', err);
      throw err;
    }
  };

  const fetchDonations = async () => {
    if (!relawanId) {
      setDonations([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching donations for relawan:', relawanId);
      setLoading(true);
      const response = await apiCall(`/donations?relawan_id=${relawanId}`);
      console.log('✅ Donations fetched:', response.data?.length || 0, 'items');
      setDonations(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('❌ Fetch donations error:', err);
      setError(err.message || 'Gagal mengambil data donasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [relawanId]);

  const addDonation = async (data: {
    donor_id?: string;
    donor_name: string;
    amount: number;
    category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
    type?: 'incoming' | 'outgoing';
    receipt_number?: string;
    notes?: string;
    bukti_transfer_url?: string | null;
    payment_method?: string;
    relawan_name: string;
  }) => {
    if (!relawanId) throw new Error('Relawan ID tidak ditemukan');

    try {
      const response = await apiCall('/donations', {
        method: 'POST',
        body: JSON.stringify({
          relawan_id: relawanId,
          donor_id: data.donor_id,
          donor_name: data.donor_name,
          amount: data.amount,
          category: data.category,
          type: data.type || 'incoming',
          receipt_number: data.receipt_number,
          notes: data.notes,
          bukti_transfer_url: data.bukti_transfer_url,
          payment_method: data.payment_method,
          relawan_name: data.relawan_name,
        })
      });

      console.log('✅ Donation added:', response.data);
      await fetchDonations(); // Refresh list
      return response.data;
    } catch (err: any) {
      console.error('❌ Add donation error:', err);
      throw err;
    }
  };

  const addDonationWithFile = async (
    data: Omit<Parameters<typeof addDonation>[0], 'bukti_transfer_url'>,
    file?: File
  ) => {
    if (!relawanId) throw new Error('Relawan ID tidak ditemukan');

    try {
      // First create the donation
      const donation = await addDonation({
        ...data,
        bukti_transfer_url: null, // Will be updated after file upload
      });

      console.log('📝 Donation created:', donation);
      console.log('📝 Donation ID:', donation?.id);
      console.log('📝 Donation type:', typeof donation);

      // If there's a file, upload it
      if (file) {
        if (!donation?.id) {
          throw new Error('Donation created but no ID returned');
        }
        
        console.log('📁 Uploading file for donation:', donation.id);
        const uploadResult = await uploadFile(file, donation.id);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'File upload failed');
        }
      }

      return donation;
    } catch (err: any) {
      console.error('❌ Add donation with file error:', err);
      throw err;
    }
  };

  const removeBuktiTransfer = async (donationId: string) => {
    try {
      await deleteFile(donationId);
      await fetchDonations(); // Refresh list
    } catch (err: any) {
      console.error('❌ Remove bukti transfer error:', err);
      throw err;
    }
  };

  const getTotalDonations = () => {
    return donations
      .filter(d => d.type === 'incoming')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getTotalDistributed = () => {
    return donations
      .filter(d => d.type === 'outgoing')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getDonationsByCategory = () => {
    const byCategory: Record<string, number> = {
      zakat: 0,
      infaq: 0,
      sedekah: 0,
      wakaf: 0
    };

    donations
      .filter(d => d.type === 'incoming')
      .forEach(d => {
        byCategory[d.category] = (byCategory[d.category] || 0) + d.amount;
      });

    return byCategory;
  };

  return {
    donations,
    loading,
    error,
    addDonation,
    addDonationWithFile,
    removeBuktiTransfer,
    getTotalDonations,
    getTotalDistributed,
    getDonationsByCategory,
    fileUploading,
    uploadProgress: progress,
    refetch: fetchDonations
  };
}

// Hook for donations by muzakki
export function useMuzakkiDonations(muzakkiId: string | null) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    if (!muzakkiId) {
      console.log('⏭️ Skipping fetchDonations: No muzakki ID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching donations for muzakki:', muzakkiId);
      setLoading(true);
      const response = await apiCall(`/donations?muzakki_id=${muzakkiId}`);
      console.log('✅ Muzakki donations fetched:', response.data?.length || 0, 'items');
      setDonations(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data donasi';
      setError(errorMessage);
      console.error('❌ Error fetching donations:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [muzakkiId]);

  return {
    donations,
    loading,
    error,
    refetch: fetchDonations
  };
}