'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers, ArrowUpRight, ArrowDownRight, RefreshCw, BookOpen, Download } from 'lucide-react';

import SendMoneyCard from '@/app/components/SendMoneyCard';

export interface UITransaction {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  status: string;
}

interface LedgerClientProps {
  initialTransactions: UITransaction[];
}

export default function LedgerClient({ initialTransactions }: LedgerClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [transactions, setTransactions] = useState<UITransaction[]>(initialTransactions);

  const handleTransferSuccess = (txId: string, email: string, amount: string, note: string) => {
    const newTx: UITransaction = {
      id: txId,
      type: 'TRANSFER',
      description: `Transfer to ${email} ${note ? `(${note})` : ''}`,
      date: new Date().toISOString().split('T')[0],
      amount: -parseFloat(amount), // Negative for transfer out
      status: 'COMPLETED',
    };
    
    setTransactions(prev => {
      const updated = [newTx, ...prev];
      window.dispatchEvent(new Event('velox_transactions_updated'));
      return updated;
    });
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['ID', 'Date', 'Type', 'Description', 'Amount', 'Status'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.date,
      tx.type,
      `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes in description
      tx.amount,
      tx.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `velox_ledger_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tx.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, typeFilter, transactions]);

  const formatCurrency = (value: number) => {
    const isNegative = value < 0;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(value));
    
    return isNegative ? "-" + formatted : "+" + formatted;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'FAILED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: string, amount: number) => {
    if (amount > 0) return <ArrowDownRight className="w-4 h-4 text-emerald-500" />;
    if (amount < 0) return <ArrowUpRight className="w-4 h-4 text-rose-500" />;
    return <RefreshCw className="w-4 h-4 text-blue-500" />;
  };

  return (
    <>
      {/* Header */}
      <div className="mb-10 border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-blue-500/10 rounded-sm border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] mt-1">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight leading-tight">Smart Ledger</h1>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-md">Real-time transaction history and automated reconciliation</p>
          </div>
        </div>
      </div>

      {/* Atomic Transfer Engine */}
      <div className="mb-12 flex justify-center w-full">
        <SendMoneyCard onTransferSuccess={handleTransferSuccess} />
      </div>
      
      <div className="bg-slate-900 border border-slate-700 rounded-sm overflow-hidden animate-in fade-in duration-500">
        
        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by ID or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-sm text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-sm px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="DEPOSIT">Deposits</option>
                <option value="BUY">Purchases</option>
                <option value="SELL">Sales</option>
                <option value="TRANSFER">Transfers</option>
                <option value="DIVIDEND">Dividends</option>
                <option value="EXCHANGE">Exchanges</option>
              </select>
            </div>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-sm text-sm text-slate-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>


        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto min-h-[400px] w-full">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-800/30">
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Details</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-semibold">No transactions found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-mono text-slate-500 text-xs uppercase tracking-wider group-hover:text-blue-400 transition-colors cursor-pointer">
                        {tx.id.substring(0, 13)}...
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                          {getTypeIcon(tx.type, tx.amount)}
                        </div>
                        <div>
                          <p className="text-slate-200 text-sm font-bold">{tx.description}</p>
                          <p className="text-slate-500 text-xs font-semibold tracking-wider mt-0.5">{tx.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-sm font-medium">{tx.date}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={"font-mono font-bold text-sm " + (tx.amount > 0 ? 'text-emerald-400' : 'text-slate-100')}>
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={"inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border " + getStatusColor(tx.status)}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-sm text-slate-500">
          <p>Showing <span className="font-bold text-slate-300">{filteredTransactions.length}</span> of <span className="font-bold text-slate-300">{transactions.length}</span> transactions</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-sm transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-sm transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>

      </div>
    </>
  );
}
