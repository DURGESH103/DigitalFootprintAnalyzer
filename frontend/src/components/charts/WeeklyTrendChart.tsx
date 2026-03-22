'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeeklyTrend } from '@/utils/types';
import { Card } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface WeeklyTrendChartProps { data: WeeklyTrend[]; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-text-muted mb-1">{label}</p>
      <p className="text-brand font-semibold">{payload[0].value} commits</p>
    </div>
  );
};

export const WeeklyTrendChart = ({ data }: WeeklyTrendChartProps) => (
  <Card>
    <div className="flex items-center gap-2 mb-4">
      <TrendingUp className="h-4 w-4 text-accent-green" />
      <h3 className="text-sm font-semibold text-text-primary">Weekly Commit Trend</h3>
      <span className="ml-auto text-xs text-text-muted">Last 12 weeks</span>
    </div>
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#58a6ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
        <XAxis dataKey="week" tick={{ fill: '#484f58', fontSize: 10 }} tickLine={false} axisLine={false}
          tickFormatter={v => v.slice(5)} />
        <YAxis tick={{ fill: '#484f58', fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="count" stroke="#58a6ff" strokeWidth={2}
          fill="url(#trendGrad)" dot={false} activeDot={{ r: 4, fill: '#58a6ff' }} />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);
