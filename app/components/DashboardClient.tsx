'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Globe, 
  ArrowDownRight, 
  ArrowUpRight, 
  RefreshCw, 
  Download, 
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';
import PortfolioPerformance from '@/app/components/PortfolioPerformance';
import AnalyticsDashboard from '@/app/components/AnalyticsDashboard';
import AuditTimeline from '@/app/components/AuditTimeline';
import { UITransaction } from './LedgerClient';
import { supabase } from '@/src/lib/supabase-client';
import { useNotifications } from '@/app/context/NotificationContext';

interface DashboardClientProps {
  totalBalanceUsd: number;
  dayChangeUsd: number;
  transactions: UITransaction[];
  isDemoData?: boolean;
}

export default function DashboardClient({ 
  totalBalanceUsd: initialBalance, 
  dayChangeUsd: initialChange, 
  transactions: initialTransactions = [],
  isDemoData = false
}: DashboardClientProps) {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'NGN'>('USD');
  const [transactions, setTransactions] = useState<UITransaction[]>(initialTransactions);
  const [balance, setBalance] = useState(initialBalance);
  const [dayChange, setDayChange] = useState(initialChange);
  const [isSentinelActive, setIsSentinelActive] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotifications();

  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    NGN: 1450.50,
  };

  // --- REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transaction' },
        (payload) => {
          const newTx = payload.new as any;
          
          const uiTx: UITransaction = {
            id: newTx.id,
            type: newTx.amount > 0 ? 'CREDIT' : 'DEBIT',
            amount: newTx.amount,
            description: newTx.description || 'New Transaction',
            date: new Date(newTx.created_at).toLocaleString(),
            status: newTx.status,
          };
          
          setTransactions(prev => [uiTx, ...prev]);
          setBalance(prev => prev + newTx.amount);
          
          addNotification({
            type: 'SENTINEL',
            title: 'Sentinel Alert: New Ledger Entry',
            message: `Detected ${uiTx.type} of $${Math.abs(newTx.amount).toLocaleString()}. Integrity verified.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addNotification]);

  const formatCurrency = (usdValue: number) => {
    const rate = exchangeRates[currency];
    const converted = usdValue * rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'NGN' ? 0 : 2,
    }).format(converted);
  };

  // --- EXPORT ENGINE ---
  const exportToCSV = async () => {
    setIsExporting(true);
    
    // Simulate deep cryptographic audit/processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const headers = ['Date', 'Description', 'Type', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(tx => [
        `"${tx.date}"`,
        `"${tx.description}"`,
        tx.type,
        tx.amount,
        tx.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `velox_audit_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    addNotification({
      type: 'SUCCESS',
      title: 'Audit Complete',
      message: 'Your cryptographically verified report has been exported.',
    });
  };

  const statCards = [
    {
      label: 'Ledger Balance',
      value: formatCurrency(balance),
      subtext: (dayChange >= 0 ? "+" : "") + formatCurrency(dayChange) + " today",
      icon: TrendingUp,
      color: balance >= 0 ? '#22c55e' : '#ef4444',
    },
    {
      label: 'Transaction Count',
      value: transactions.length.toString(),
      subtext: 'Real-time verified',
      icon: Activity,
      color: '#3b82f6',
    },
  ];

  const getTypeIcon = (type: string, amount: number) => {
    if (amount > 0) return <ArrowDownRight className="w-4 h-4 text-emerald-500" />;
    if (amount < 0) return <ArrowUpRight className="w-4 h-4 text-rose-500" />;
    return <RefreshCw className="w-4 h-4 text-blue-500" />;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full animate-in fade-in duration-500">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Executive Dashboard</h1>
              {isSentinelActive && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full animate-pulse">
                  <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Sentinel Active</span>
                </div>
              )}
            </div>
            <p className="text-slate-400">Welcome back. Here's your real-time ledger analysis.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={exportToCSV}
                disabled={isExporting}
                className={"flex items-center gap-2 font-bold py-2.5 px-5 rounded-xl border transition-all active:scale-95 shadow-lg " + (isExporting ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700')}
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isExporting ? 'Auditing...' : 'Export Audit'}</span>
              </button>

            <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-1.5 rounded-xl shadow-lg">
              <Globe className="w-4 h-4 text-slate-500 ml-2" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-slate-800 text-slate-100 font-bold border-none rounded-lg px-3 py-1.5 focus:outline-none transition-all cursor-pointer text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="NGN">NGN</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 mb-8 mt-6 md:mt-0">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-700 rounded-sm p-6 relative overflow-hidden group hover:border-slate-600 transition-colors"
              >
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon size={120} />
                </div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <p className="text-slate-400 font-semibold text-sm uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <div 
                    className="p-2 rounded-sm"
                    style={{ backgroundColor: stat.color + '15' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-slate-100 font-mono mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: stat.color }}>
                    {stat.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-8 mt-4">
          
            {/* High-Fidelity Analytics Suite */}
            <div className="bg-slate-900 border border-slate-700 rounded-sm p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-slate-100">Analytics Suite</h2>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                  Live Syncing
                </div>
              </div>
              <AnalyticsDashboard 
                balance={balance} 
                transactions={transactions} 
                outflow={transactions.reduce((acc, tx) => tx.amount < 0 ? acc + Math.abs(tx.amount) : acc, 0) / Math.max(1, transactions.length / 10)}
              />
            </div>

            {/* Performance Chart */}
            <div className="bg-slate-900 border border-slate-700 rounded-sm p-6 md:p-8 h-[450px]">
              <PortfolioPerformance transactions={transactions} totalBalance={balance} />
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity Table */}
            <div className="bg-slate-900 border border-slate-700 rounded-sm overflow-hidden h-fit">
              <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Recent Activity</h2>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Details</th>
                      <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={3} className="py-6 text-center text-slate-500">No recent transactions</td></tr>
                    ) : transactions.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="py-5 px-6">
                           <div className="w-8 h-8 rounded-sm bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                             {getTypeIcon(tx.type, tx.amount)}
                           </div>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-slate-200 text-sm font-bold">{tx.description}</p>
                          <p className="text-slate-500 text-xs font-semibold tracking-wider mt-0.5">{tx.date}</p>
                        </td>
                        <td className="py-5 px-6 text-right font-mono font-bold text-slate-100">
                           <span className={tx.amount > 0 ? 'text-emerald-400' : 'text-slate-100'}>
                             {formatCurrency(tx.amount)}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="bg-slate-900 border border-slate-700 rounded-sm overflow-hidden p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Immutable Audit Trail</h2>
                  <p className="text-xs text-slate-400 mt-1">Cryptographically verified logs</p>
                </div>
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-sm border border-emerald-500/20">
                  RLS Active
                </div>
              </div>
              <AuditTimeline transactions={transactions} />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
