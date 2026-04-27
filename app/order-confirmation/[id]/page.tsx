'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Download } from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';

interface OrderDetails {
  id: number;
  total: string;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrderConfirmation() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In a real app, fetch from GET /api/orders/:id
        setOrder({
          id: parseInt(orderId),
          total: '0',
          status: 'completed',
          createdAt: new Date().toISOString(),
          items: [],
        });
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="pt-4 max-w-2xl mx-auto">
        {/* Success Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-900/20 border border-green-700 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Order Confirmed!</h1>
          <p className="text-slate-400 text-lg">Thank you for your purchase. Your order has been placed successfully.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <div className="mb-8 pb-8 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Order Number</span>
              <span className="text-2xl font-bold text-slate-100">#{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Order Date</span>
              <span className="text-slate-100">
                {order && new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400 text-sm mb-2">Status</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-700 text-green-400 rounded-full text-sm font-semibold">
                ✓ Completed
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Amount</p>
              <p className="text-3xl font-bold text-green-400">${order?.total || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Transaction Security</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <p className="text-slate-400">Atomic transaction with referential integrity</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <p className="text-slate-400">Row Level Security (RLS) applied to order data</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <p className="text-slate-400">End-to-end encryption on payment information</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <p className="text-slate-400">Full audit trail and transaction recovery available</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-blue-100 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-blue-200 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Check your email for order confirmation and shipping details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">2.</span>
              <span>Track your order from your account dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Your order will be shipped within 2-3 business days</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/fintech/dashboard"
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            Back to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            href="/fintech/marketplace"
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Download Invoice */}
        <button className="w-full mt-4 px-6 py-3 border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-600 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download Invoice
        </button>
      </div>
    </DashboardLayout>
  );
}
