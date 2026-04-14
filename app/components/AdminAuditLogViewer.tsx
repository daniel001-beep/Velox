"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Velox Admin Audit Log Viewer
 * 
 * Hidden admin view for displaying:
 * - All audit events
 * - Transaction history with details
 * - Address change history
 * - User activity patterns
 * 
 * Access restricted to admin users via OAuth
 * Never leaks sensitive data via RLS bypass
 */

interface AuditLog {
  id: string;
  userId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  changeHash: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

interface TransactionDetails {
  transactionId: string;
  userId: string;
  amount: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  debitCount: number;
  creditCount: number;
}

export default function AdminAuditLogViewer() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"audit" | "transactions" | "analysis">("audit");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEventType, setFilterEventType] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAuditLogs();
      fetchTransactionData();
    }
  }, [isAdmin, filterEventType]);

  async function checkAdminAccess() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      // Check if user is admin in database
      const { data } = await supabase
        .from("user")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (data?.is_admin) {
        setIsAdmin(true);
      } else {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to verify admin access");
      setLoading(false);
    }
  }

  async function fetchAuditLogs() {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("audit_log")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);

      if (err) throw err;

      let filtered = data || [];

      if (filterEventType !== "all") {
        filtered = filtered.filter((log) => log.event_type === filterEventType);
      }

      if (searchQuery) {
        filtered = filtered.filter(
          (log) =>
            log.user_id.includes(searchQuery) ||
            log.entity_id.includes(searchQuery) ||
            log.ip_address.includes(searchQuery)
        );
      }

      setAuditLogs(filtered as AuditLog[]);
    } catch (err) {
      setError(`Failed to fetch audit logs: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactionData() {
    try {
      // This would call a secure API endpoint that verifies admin status
      // Cannot call RLS-protected function directly from client
      const response = await fetch("/api/admin/transactions", {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error("Transaction fetch error:", err);
      // Silently fail - not critical for initial load
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-lock text-5xl text-red-500 mb-4 block"></i>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="fas fa-shield-alt text-blue-500"></i>
            Admin Audit Log Viewer
          </h1>
          <p className="text-gray-400">
            View compliance logs, transaction history, and user activity
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "audit"
                ? "text-blue-400 border-b-2 border-blue-500 -mb-px"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <i className="fas fa-list mr-2"></i>
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "transactions"
                ? "text-blue-400 border-b-2 border-blue-500 -mb-px"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <i className="fas fa-money-bill mr-2"></i>
            Transactions
          </button>
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "analysis"
                ? "text-blue-400 border-b-2 border-blue-500 -mb-px"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <i className="fas fa-chart-bar mr-2"></i>
            Analysis
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4 block"></i>
            <p className="text-gray-400">Loading audit data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-200">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        ) : (
          <>
            {/* Audit Logs Tab */}
            {activeTab === "audit" && (
              <div>
                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search by User ID, Entity ID, or IP address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={filterEventType}
                    onChange={(e) => setFilterEventType(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Events</option>
                    <option value="cart_modified">Cart Modified</option>
                    <option value="address_changed">Address Changed</option>
                    <option value="checkout_attempted">Checkout Attempted</option>
                    <option value="transaction_initiated">
                      Transaction Initiated
                    </option>
                  </select>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/10 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Entity
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Verification
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition">
                          <td className="px-6 py-3 text-gray-300">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                            {log.user_id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold">
                              {log.event_type}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-400">
                            {log.entity_type} #{log.entity_id}
                          </td>
                          <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                            {log.ip_address}
                          </td>
                          <td className="px-6 py-3">
                            <details className="cursor-pointer">
                              <summary className="text-xs font-mono text-gray-500 hover:text-gray-300">
                                {log.change_hash.substring(0, 16)}...
                              </summary>
                              <div className="mt-2 p-2 bg-black/50 rounded text-xs text-gray-400">
                                <p className="font-mono">
                                  SHA256: {log.change_hash}
                                </p>
                              </div>
                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-gray-500 text-sm mt-4">
                  Showing {auditLogs.length} audit logs (most recent first)
                </p>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/10 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Transaction ID
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Entries
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-white">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {transactions.map((tx) => (
                        <tr key={tx.transactionId} className="hover:bg-white/5">
                          <td className="px-6 py-3 text-gray-300 font-mono text-xs">
                            {tx.transactionId}
                          </td>
                          <td className="px-6 py-3 text-white font-semibold">
                            ${parseFloat(tx.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                tx.status === "completed"
                                  ? "bg-green-500/20 text-green-300"
                                  : tx.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-400">
                            {tx.debitCount} debit, {tx.creditCount} credit
                          </td>
                          <td className="px-6 py-3 text-gray-400 text-xs">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === "analysis" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {auditLogs.length}
                  </div>
                  <p className="text-gray-400">Total Audit Events</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {transactions.filter((t) => t.status === "completed").length}
                  </div>
                  <p className="text-gray-400">Completed Transactions</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {transactions.filter((t) => t.status === "pending").length}
                  </div>
                  <p className="text-gray-400">Pending Transactions</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    $
                    {transactions
                      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                      .toFixed(2)}
                  </div>
                  <p className="text-gray-400">Total Transaction Volume</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
