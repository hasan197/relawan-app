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
    <Card className="bg-gradient-to-br from-accent-100 to-accent-200 border-none shadow-lg -mt-8 p-5">
      <div className="text-center mb-5">
        <p className="text-accent-700 text-sm mb-1">Total Donasi Relawan</p>
        <h2 className="text-gray-900 mb-2 text-2xl">{formatCurrency(total)}</h2>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          <span>+{formatCurrency(increase)}</span>
          <ArrowUp className="h-3.5 w-3.5" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={onSalurkan}
          className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className="p-2 bg-green-100 rounded-full">
            <Send className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-gray-700">Salurkan</span>
        </button>
        
        <button 
          onClick={onTambahDonatur}
          className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className="p-2 bg-blue-100 rounded-full">
            <UserPlus className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-gray-700">Tambah</span>
        </button>
        
        <button 
          onClick={onLaporan}
          className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className="p-2 bg-purple-100 rounded-full">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-gray-700">Laporan</span>
        </button>
      </div>
    </Card>
  );
}