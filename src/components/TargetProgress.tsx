import { Target } from '../types';
import { formatCurrency } from '../lib/utils';
import { Card } from './ui/card';
import { TrendingUp, Users } from 'lucide-react';
import { Progress } from './ui/progress';

interface TargetProgressProps {
  target: Target;
}

export function TargetProgress({ target }: TargetProgressProps) {
  const donationProgress = (target.currentAmount / target.targetAmount) * 100;
  const muzakkiProgress = (target.currentMuzakki / target.targetMuzakki) * 100;

  return (
    <Card className="p-4 shadow-sm border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Target Bulan Ini</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {target.period}
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Donation Target */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              <span className="text-gray-700">Target Donasi</span>
            </div>
            <span className="text-gray-900">
              {Math.round(donationProgress)}%
            </span>
          </div>
          <Progress value={donationProgress} className="h-2 mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {formatCurrency(target.currentAmount)}
            </span>
            <span className="text-gray-500">
              dari {formatCurrency(target.targetAmount)}
            </span>
          </div>
        </div>

        {/* Muzakki Target */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">Target Muzakki</span>
            </div>
            <span className="text-gray-900">
              {Math.round(muzakkiProgress)}%
            </span>
          </div>
          <Progress value={muzakkiProgress} className="h-2 mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {target.currentMuzakki} muzakki
            </span>
            <span className="text-gray-500">
              dari {target.targetMuzakki}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-primary-50 rounded-lg">
        <p className="text-primary-700 text-center">
          🎯 Kamu sudah membantu {target.currentMuzakki} muzakki minggu ini!
        </p>
      </div>
    </Card>
  );
}