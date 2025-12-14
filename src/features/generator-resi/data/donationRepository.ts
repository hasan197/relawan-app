import { apiCall } from '../../../lib/supabase';
import type { DonationCategory, PaymentMethod } from '../models/types';

export async function createDonation(input: {
  relawanId: string;
  relawanName: string;
  donorName: string;
  muzakkiId: string | null;
  amount: number;
  category: DonationCategory;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  notes: string;
}) {
  const donationData = {
    relawan_id: input.relawanId,
    relawan_name: input.relawanName,
    donor_name: input.donorName,
    muzakki_id: input.muzakkiId,
    amount: input.amount,
    category: input.category,
    type: 'incoming' as const,
    payment_method: input.paymentMethod,
    receipt_number: input.receiptNumber,
    notes: input.notes,
    bukti_transfer_url: null
  };

  return apiCall('/donations', {
    method: 'POST',
    body: JSON.stringify(donationData)
  });
}

export async function uploadBuktiTransfer(input: {
  donationId: string;
  file: File;
}): Promise<{ url?: string } & Record<string, any>> {
  const formData = new FormData();
  formData.append('file', input.file);
  formData.append('donation_id', input.donationId);

  return apiCall('/donations/upload-bukti', {
    method: 'POST',
    body: formData
  });
}
