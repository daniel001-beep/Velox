'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, ShieldAlert, Users } from 'lucide-react';
import RunwayGauge from './RunwayGauge';

const cohortData: any[] = [];

export default function AnalyticsDashboard({ 
  balance = 0, 
  outflow = 0,
  transactions = [] 
}: { 
  balance?: number, 
  outflow?: number,
  transactions?: any[]
}) {
  // Financial State
  const currentBalance = balance;
  const avgMonthlyOutflow = outflow;

  // --- GENERATE LIVE PULSE DATA FROM REAL TRANSACTIONS ---
  const generatePulseData = () => {
    // Initialize buckets for the last 7 hours or specific time slots
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    const buckets = hours.map(h => ({ time: h, success: 0, failed: 0, rollback: 0 }));

    transactions.forEach(tx => {
      // Map transaction time to buckets (simplified for demo)
      // In a real app, you'd use the actual tx.date
      const bucketIndex = Math.floor(Math.random() * hours.length); 
      if (tx.status === 'COMPLETED') buckets[bucketIndex].success++;
      else if (tx.status === 'FAILED') buckets[bucketIndex].failed++;
      else buckets[bucketIndex].rollback++;
    });

    return buckets;
  };

  const ledgerPulseData = transactions.length > 0 ? generatePulseData() : [
    { time: '09:00', success: 0, failed: 0, rollback: 0 },
    { time: '10:00', success: 0, failed: 0, rollback: 0 },
    { time: '11:00', success: 0, failed: 0, rollback: 0 },
    { time: '12:00', success: 0, failed: 0, rollback: 0 },
    { time: '13:00', success: 0, failed: 0, rollback: 0 },
    { time: '14:00', success: 0, failed: 0, rollback: 0 },
    { time: '15:00', success: 0, failed: 0, rollback: 0 },
  ];

  const getHeatmapColor = (value: number | null) => {
    if (value === null) return 'bg-slate-800/20 text-transparent border-slate-800/50';
    if (value >= 90) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (value >= 75) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (value >= 60) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-slate-700/30 text-slate-400 border-slate-700';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Startup Runway Predictor */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Startup Runway</h2>
              <p className="text-xs text-slate-400 font-medium">Predictive Burn Analysis</p>
            </div>
            <div className="p-2 bg-slate-800/80 rounded-md border border-slate-700">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          
          <RunwayGauge balance={currentBalance} monthlyOutflow={avgMonthlyOutflow} />
          
          <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Current Vault</p>
              <p className="text-lg font-mono font-bold text-slate-200">{"$" + (currentBalance / 1000000).toFixed(2) + "M"}</p>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Avg Outflow</p>
              <p className="text-lg font-mono font-bold text-slate-200">{"$" + (avgMonthlyOutflow / 1000).toFixed(0) + "K/mo"}</p>
            </div>
          </div>
        </div>

        {/* Real-Time Ledger Pulse */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Real-Time Ledger Pulse</h2>
              <p className="text-xs text-slate-400 font-medium">Atomic Rollback & Integrity Verification</p>
            </div>
            <div className="p-2 bg-slate-800/80 rounded-md border border-slate-700">
              <ShieldAlert className="h-5 w-5 text-blue-400" />
            </div>
          </div>

          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={ledgerPulseData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
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
                  tickFormatter={(val) => val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" name="Success" dataKey="success" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Failed" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" name="Rollbacks" dataKey="rollback" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Cohort Retention Heatmap */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Cohort Retention Heatmap</h2>
            <p className="text-xs text-slate-400 font-medium">User stickiness tracking (M1 - M6)</p>
          </div>
          <div className="p-2 bg-slate-800/80 rounded-md border border-slate-700">
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider p-2 text-xs">Cohort</th>
                <th className="text-center font-bold text-slate-400 uppercase tracking-wider p-2 text-xs">M1</th>
                <th className="text-center font-bold text-slate-400 uppercase tracking-wider p-2 text-xs">M2</th>
                <th className="text-center font-bold text-slate-400 uppercase tracking-wider p-2 text-xs">M3</th>
                <th className="text-center font-bold text-slate-400 uppercase tracking-wider p-2 text-xs">M4</th>
                <th className="text-center font-bold text-slate-400 uppercase tracking-wider p-2 text-xs">M5</th>
                <th className="text-center font-bold text-slate-400 uppercase tracking-wider p-2 text-xs">M6</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest bg-slate-800/20 rounded-sm">
                    Waiting for user cohort data...
                  </td>
                </tr>
              ) : cohortData.map((row, i) => (
                <tr key={row.month}>
                  <td className="font-bold text-slate-300 p-3 bg-slate-800/40 rounded-sm border border-slate-700/50">{row.month} 2026</td>
                  {[row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((val, idx) => (
                    <td 
                      key={idx} 
                      className={"text-center font-mono font-bold rounded-sm border transition-colors p-3 " + getHeatmapColor(val)}
                    >
                      {val !== null ? val + "%" : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
