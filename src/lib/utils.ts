import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  } else if (diffInDays === 1) {
    return 'kemarin';
  } else if (diffInDays < 7) {
    return `${diffInDays} hari lalu`;
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateReceiptNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ZKT${year}${month}${day}${random}`;
}

/**
 * Copy text to clipboard with fallback for when Clipboard API is blocked
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback method using textarea
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      textArea.remove();
      return false;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}