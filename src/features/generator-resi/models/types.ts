export type DonationCategory = 'zakat' | 'infaq' | 'sedekah' | 'wakaf';

export type PaymentMethod = 'tunai' | 'transfer' | 'qris' | 'other';

export interface GeneratorResiFormData {
  donorName: string;
  muzakkiId: string;
  amount: string;
  category: DonationCategory;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface ReceiptData {
  number: string;
  date: string;
  donorName: string;
  amount: number;
  category: DonationCategory;
  paymentMethod: PaymentMethod;
}
