import { ArrowUp, Send, UserPlus, FileText } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Card } from './ui/card';

interface TotalDonationCardProps {
  total: number;
  increase: number;
  onSalurkan?: () => void;
  onTambahDonatur?: () => void;
  onLaporan?: () => void;
}

export function TotalDonationCard({ 
  total, 
  increase,
  onSalurkan,
  onTambahDonatur,
  onLaporan
}: TotalDonationCardProps) {
  return (
    <Card className="bg-gradient-to-br from-accent-100 to-accent-200 border-none shadow-card -mt-6 mx-3 p-4">
      <div className="text-center mb-4">
        <p className="text-accent-700 text-sm mb-1">Total Donasi Relawan</p>
        <h2 className="text-gray-900 text-xl font-semibold mb-1">{formatCurrency(total).replace('Rp', '')}</h2>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
          <span>+{formatCurrency(increase).replace('Rp', '')}</span>
          <ArrowUp className="h-3 w-3" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={onSalurkan}
          className="flex flex-col items-center gap-1 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
        >
          <div className="p-1.5 bg-green-50 rounded-full">
            <Send className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-gray-700 text-xs">Salurkan</span>
        </button>
        
        <button 
          onClick={onTambahDonatur}
          className="flex flex-col items-center gap-1 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
        >
          <div className="p-1.5 bg-blue-50 rounded-full">
            <UserPlus className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-gray-700 text-xs">Tambah</span>
        </button>
        
        <button 
          onClick={onLaporan}
          className="flex flex-col items-center gap-1 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
        >
          <div className="p-1.5 bg-purple-50 rounded-full">
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
          <span className="text-gray-700 text-xs">Laporan</span>
        </button>
      </div>
    </Card>
  );
}
