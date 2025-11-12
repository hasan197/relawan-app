import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, Users } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { motion } from "motion/react";

interface TargetProgressCardProps {
  totalDonations: number;
  monthlyTarget: number;
  totalMuzakki: number;
  muzakkiTarget: number;
}

export function TargetProgressCard({
  totalDonations,
  monthlyTarget,
  totalMuzakki,
  muzakkiTarget,
}: TargetProgressCardProps) {
  const donationProgress =
    (totalDonations / monthlyTarget) * 100;
  const muzakkiProgress = (totalMuzakki / muzakkiTarget) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-4 shadow-md border-gray-100">
        {/* Header */}
        <h3 className="text-gray-900 mb-6">Target Bulan Ini</h3>

        {/* Target Donasi */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-green-50 rounded">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-gray-700 text-sm">
                Target Donasi
              </p>
            </div>
            <p className="text-gray-900 text-sm">
              {Math.round(donationProgress)}%
            </p>
          </div>

          <Progress
            value={donationProgress}
            className="h-2 mb-2"
          />

          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-600">
              {formatCurrency(totalDonations)}
            </p>
            <p className="text-gray-500">
              dari {formatCurrency(monthlyTarget)}
            </p>
          </div>
        </div>

        {/* Target Muzakki */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-50 rounded">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-gray-700 text-sm">
                Target Muzakki
              </p>
            </div>
            <p className="text-gray-900 text-sm">
              {Math.round(muzakkiProgress)}%
            </p>
          </div>

          <Progress
            value={muzakkiProgress}
            className="h-2 mb-2"
          />

          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-600">
              {totalMuzakki} muzakki
            </p>
            <p className="text-gray-500">
              dari {muzakkiTarget}
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-green-700 text-sm">
            🎯 Kamu sudah membantu {totalMuzakki} muzakki minggu
            ini!
          </p>
        </div>
      </Card>
    </motion.div>
  );
}