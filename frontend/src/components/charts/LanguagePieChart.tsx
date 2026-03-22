'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LanguageCount } from '@/utils/types';
import { CHART_COLORS } from '@/constants';
import { Card } from '@/components/ui/Card';

interface LanguageChartProps {
  data: LanguageCount[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-sm">
      <p className="text-text-primary font-medium">{payload[0].name}</p>
      <p className="text-text-secondary">{payload[0].value} repos</p>
    </div>
  );
};

export const LanguagePieChart = ({ data }: LanguageChartProps) => (
  <Card className="h-full">
    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Language Distribution</h3>
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="lang"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);
