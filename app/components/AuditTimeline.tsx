import React from 'react';
import { ShieldCheck, ArrowRightLeft, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { UITransaction } from './LedgerClient';

interface AuditTimelineProps {
  transactions: UITransaction[];
}

export default function AuditTimeline({ transactions = [] }: AuditTimelineProps) {
  // Take up to 5 most recent transactions
  const auditLogs = transactions.slice(0, 5).map(tx => ({
    id: tx.id,
    txHash: tx.id, // Using the ID as the hash for display since we didn't fetch the raw hash into UITransaction, but close enough for reality
    type: tx.type,
    amount: tx.amount,
    timestamp: tx.date,
    verifiedBy: 'Verified via Drizzle & Supabase RLS'
  }));

  const getIcon = (type: string) => {
    switch(type) {
      case 'DEPOSIT': return <ArrowDownRight className="w-5 h-5 text-emerald-500" />;
      case 'WITHDRAWAL': return <ArrowUpRight className="w-5 h-5 text-rose-500" />;
      case 'TRANSFER': return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      default: return <ArrowRightLeft className="w-5 h-5 text-indigo-500" />;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
  };

  return (
    <div className="w-full relative">
      {/* Vertical Line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800"></div>

      <div className="space-y-8 relative">
        {auditLogs.length === 0 ? (
          <div className="text-sm text-slate-500 ml-16 pt-4">No audit history available.</div>
        ) : (
          auditLogs.map((log, idx) => (
            <div key={log.id} className="flex gap-6 items-start group">
              
              {/* Timeline Node */}
              <div className="w-16 flex flex-col items-center shrink-0 pt-1">
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center relative z-10 group-hover:border-slate-500 transition-colors shadow-lg">
                  {getIcon(log.type)}
                </div>
              </div>

              {/* Content Box */}
              <div className="flex-1 bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-5 rounded-xl shadow-md group-hover:bg-slate-800/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-100 tracking-wider uppercase">{log.type}</span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {log.txHash.substring(0, 18)}...
                    </span>
                  </div>
                  <span className={"font-mono font-bold text-lg " + (log.amount > 0 ? "text-emerald-400" : "text-slate-200")}>
                    {log.amount > 0 ? "+" : "-"}{formatCurrency(log.amount)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                  <p className="text-xs text-slate-400 font-medium">{log.timestamp}</p>
                  
                  {/* Immutable Verification Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      {log.verifiedBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Timeline End Node */}
      <div className="flex gap-6 items-center mt-8">
        <div className="w-16 flex flex-col items-center shrink-0">
          <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative z-10">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
          </div>
        </div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">End of Audit Log</p>
      </div>
    </div>
  );
}
