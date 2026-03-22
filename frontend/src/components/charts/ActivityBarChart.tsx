'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ActivityPattern } from '@/utils/types';
import { Card } from '@/components/ui/Card';

interface ActivityChartProps {
  data: ActivityPattern;
}

export const ActivityBarChart = ({ data }: ActivityChartProps) => {
  const chartData = [
    { name: '☀️ Day', value: data.day, fill: '#e3b341' },
    { name: '🌙 Night', value: data.night, fill: '#bc8cff' },
  ];

  return (
    <Card className="h-full">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">Activity Pattern</h3>
      <p className="text-xs text-text-muted mb-4">When you code most</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={48}>
          <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
          <Tooltip
            formatter={(v: number) => [`${v}%`, 'Activity']}
            contentStyle={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#e6edf3' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
