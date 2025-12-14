import { formatCurrency } from '../../../lib/utils';
import type { ReceiptData } from './types';

export function buildReceiptText(receipt: ReceiptData): string {
  const paymentMethodLabel =
    receipt.paymentMethod === 'transfer'
      ? 'Transfer Bank'
      : receipt.paymentMethod === 'tunai'
        ? 'Tunai'
        : receipt.paymentMethod === 'qris'
          ? 'QRIS'
          : 'Lainnya';

  return `
RESI DONASI ${receipt.category.toUpperCase()}

No. Resi: ${receipt.number}
Tanggal: ${receipt.date}

Nama Donatur: ${receipt.donorName}
Nominal: ${formatCurrency(receipt.amount)}
Kategori: ${receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1)}
Metode Pembayaran: ${paymentMethodLabel}

Status: Menunggu Validasi Admin

Jazakumullah khairan katsiran
Semoga menjadi amal jariyah yang berkah

---
ZISWAF Manager
Platform Manajemen Relawan Zakat Digital
  `.trim();
}

export function buildReceiptShareText(receipt: ReceiptData): string {
  return `
RESI DONASI ${receipt.category.toUpperCase()}

No. Resi: ${receipt.number}
Tanggal: ${receipt.date}

Nama Donatur: ${receipt.donorName}
Nominal: ${formatCurrency(receipt.amount)}
Kategori: ${receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1)}

Status: Menunggu Validasi Admin ⏳

Jazakumullah khairan katsiran 🤲
Semoga menjadi amal jariyah yang berkah ✨
  `.trim();
}
