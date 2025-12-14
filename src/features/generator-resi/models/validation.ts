import type { GeneratorResiFormData } from './types';

export function validateGeneratorResiForm(params: {
  formData: GeneratorResiFormData;
  hasUser: boolean;
  hasBuktiFile: boolean;
}): string | null {
  const { formData, hasUser, hasBuktiFile } = params;

  if (!formData.donorName || !formData.amount) {
    return 'Nama donatur dan nominal harus diisi';
  }

  if (!hasUser) {
    return 'User tidak ditemukan';
  }

  if (formData.paymentMethod === 'transfer' && !hasBuktiFile) {
    return 'Bukti transfer harus diupload untuk pembayaran transfer';
  }

  return null;
}
