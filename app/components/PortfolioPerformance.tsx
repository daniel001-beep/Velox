'use client';

import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { UITransaction } from './LedgerClient';

type TimeRange = '1M' | '3M' | 'YTD' | '1Y';

interface PortfolioPerformanceProps {
  transactions?: UITransaction[];
  totalBalance?: number;
}

export default function PortfolioPerformance({ transactions = [], totalBalance = 0 }: PortfolioPerformanceProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('YTD');

  // Generate dynamic data based on transactions
  const generateDynamicData = (range: TimeRange) => {
    // Sort transactions by date (assuming they are in order already, but let's be safe)
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Start from an initial balance and build up
    let runningBalance = Math.max(0, totalBalance - transactions.reduce((acc, tx) => acc + tx.amount, 0));
    
    // Number of points to show
    const pointCount = range === '1M' ? 4 : range === '3M' ? 6 : range === 'YTD' ? 8 : 12;
    const data: any[] = [];

    // Simple distribution of transaction impact over the points
    const txPerPoint = Math.max(1, Math.floor(transactions.length / pointCount));

    for (let i = 0; i < pointCount; i++) {
      const label = range === '1M' ? `W${i+1}` : range === '3M' ? `M${i+1}` : `Point ${i+1}`;
      
      // Add impact of transactions for this period
      const startIdx = i * txPerPoint;
      const endIdx = (i + 1) * txPerPoint;
      const periodTx = sortedTx.slice(startIdx, endIdx);
      
      const periodChange = periodTx.reduce((acc, tx) => acc + tx.amount, 0);
      runningBalance += periodChange;

      data.push({
        name: label,
        value: runningBalance
      });
    }

    // Ensure the last point matches the current balance
    if (data.length > 0) {
      data[data.length - 1].value = totalBalance;
    }

    return data;
  };

  const currentData = generateDynamicData(timeRange);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-sm shadow-xl">
          <p className="text-slate-400 text-xs mb-1 font-semibold">{label}</p>
          <p className="text-slate-100 font-bold font-mono">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Performance</h2>
        </div>
        <div className="flex bg-slate-800 rounded-sm p-1 border border-slate-700">
          {['1M', '3M', 'YTD', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as TimeRange)}
              className={"px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors " + (timeRange === range ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200')}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={currentData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val >= 1000000 ? "$" + (val / 1000000).toFixed(1) + "M" : "$" + (val / 1000).toFixed(0) + "K"}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
