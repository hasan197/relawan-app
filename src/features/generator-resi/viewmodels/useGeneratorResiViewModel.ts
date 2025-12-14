import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { copyToClipboard, generateReceiptNumber } from '../../../lib/utils';
import type { GeneratorResiFormData, ReceiptData } from '../models/types';
import { validateGeneratorResiForm } from '../models/validation';
import { buildReceiptShareText, buildReceiptText } from '../models/receiptText';
import { createDonation, uploadBuktiTransfer } from '../data/donationRepository';

export function useGeneratorResiViewModel(deps: {
  user: { id: string; name: string } | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<GeneratorResiFormData>({
    donorName: '',
    muzakkiId: '',
    amount: '',
    category: 'zakat',
    paymentMethod: 'transfer',
    notes: ''
  });

  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [buktiPreview, setBuktiPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const amountNumber = useMemo(() => {
    const n = parseFloat(formData.amount);
    return Number.isFinite(n) ? n : 0;
  }, [formData.amount]);

  const removeBukti = () => {
    setBuktiFile(null);
    setBuktiPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectBuktiFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    setBuktiFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBuktiPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    const error = validateGeneratorResiForm({
      formData,
      hasUser: !!deps.user,
      hasBuktiFile: !!buktiFile
    });

    if (error) {
      toast.error(error);
      return;
    }

    if (!deps.user) {
      return;
    }

    try {
      setSubmitting(true);

      const receiptNumber = generateReceiptNumber();

      const response = await createDonation({
        relawanId: deps.user.id,
        relawanName: deps.user.name,
        donorName: formData.donorName,
        muzakkiId: formData.muzakkiId || null,
        amount: amountNumber,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        receiptNumber,
        notes: formData.notes
      });

      if (!response.success) {
        throw new Error(response.error || 'Gagal menyimpan donasi');
      }

      const donationId = response.data.id;

      if (buktiFile) {
        toast.info('Mengupload bukti transfer...');
        await uploadBuktiTransfer({ donationId, file: buktiFile });
      }

      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      setReceipt({
        number: receiptNumber,
        date: today,
        donorName: formData.donorName,
        amount: amountNumber,
        category: formData.category,
        paymentMethod: formData.paymentMethod
      });

      toast.success('Donasi berhasil dilaporkan!', {
        description: 'Menunggu validasi dari admin'
      });

      setFormData({
        donorName: '',
        muzakkiId: '',
        amount: '',
        category: 'zakat',
        paymentMethod: 'transfer',
        notes: ''
      });

      removeBukti();
    } catch (e: any) {
      toast.error(e?.message || 'Gagal menyimpan donasi');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReceipt = async () => {
    if (!receipt) return;
    const success = await copyToClipboard(buildReceiptText(receipt));
    if (success) {
      toast.success('Resi berhasil disalin!');
    } else {
      toast.error('Gagal menyalin resi');
    }
  };

  const shareReceipt = async () => {
    if (!receipt) return;

    const text = buildReceiptShareText(receipt);

    if (navigator.share) {
      navigator
        .share({
          title: 'Resi Donasi ZISWAF',
          text
        })
        .catch(() => {
          // ignore
        });
      return;
    }

    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Resi berhasil disalin!');
    } else {
      toast.error('Gagal menyalin resi');
    }
  };

  const closeReceipt = () => {
    setReceipt(null);
  };

  return {
    formData,
    setFormData,
    receipt,
    submitting,
    buktiPreview,
    hasBuktiFile: !!buktiFile,
    fileInputRef,
    selectBuktiFile,
    removeBukti,
    submit,
    copyReceipt,
    shareReceipt,
    closeReceipt
  };
}
