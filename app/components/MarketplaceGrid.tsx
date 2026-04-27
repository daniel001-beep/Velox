import React from 'react';
import Link from 'next/link';
import { CheckCircle, Zap, Shield, TrendingUp, Key, Cpu, Lock, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  compliance: ('soc2' | 'pci')[];
  pricingModel: string;
  icon: React.ElementType;
  accentColor: string;
}

const products: Product[] = [
  {
    id: 'fraud-detection',
    title: 'AI Fraud Detection',
    description: 'Real-time monitoring. Detect anomalies in milliseconds with machine learning precision.',
    category: 'Security',
    features: [
      'Real-time anomaly detection',
      'Sub-millisecond latency',
      'Customizable thresholds',
      'Audit logging',
    ],
    compliance: ['soc2', 'pci'],
    pricingModel: 'Usage-based • $0.05-0.50/1M transactions',
    icon: Zap,
    accentColor: '#3b82f6',
  },
  {
    id: 'multicurrency',
    title: 'Multi-Currency Engine',
    description: 'Automatic reconciliation API with live FX rates. Handle 50+ currencies with sub-10ms latency.',
    category: 'Integration',
    features: [
      'Live FX rate updates',
      'Automatic reconciliation',
      '50+ currency support',
      'Sub-10ms latency guarantee',
    ],
    compliance: ['pci'],
    pricingModel: 'Subscription • $499-2,990/month',
    icon: TrendingUp,
    accentColor: '#06b6d4',
  },
  {
    id: 'transaction-processor',
    title: 'Transaction Processor',
    description: 'Secure HTTP protocol. Orchestrate complex transactions with zero-trust architecture.',
    category: 'Protocol',
    features: [
      'Protocol compliance',
      'Autonomous execution',
      'Stablecoin settlement',
      'Zero-trust architecture',
    ],
    compliance: ['soc2', 'pci'],
    pricingModel: 'License • $1,950/month',
    icon: Cpu,
    accentColor: '#f59e0b',
  },
  {
    id: 'insurtech',
    title: 'Embedded Insurtech API',
    description: 'Dynamic policy purchasing with real-time quote generation. Programmatic insurance integration.',
    category: 'Insurance',
    features: [
      'Real-time quote generation',
      'Dynamic policy purchasing',
      'Automated claims processing',
      'Risk assessment engine',
    ],
    compliance: ['soc2'],
    pricingModel: 'Credits • $0.10-0.75 per policy',
    icon: Shield,
    accentColor: '#ef4444',
  },
  {
    id: 'digital-id',
    title: 'Digital ID Verification',
    description: 'Biometric KYC/AML verification. Enterprise-grade compliance with real-time decisioning.',
    category: 'Compliance',
    features: [
      'Biometric verification',
      'KYC/AML screening',
      'Real-time decisioning',
      'GDPR-compliant storage',
    ],
    compliance: ['soc2', 'pci'],
    pricingModel: 'Usage-based • $0.75-2.50 per verification',
    icon: Lock,
    accentColor: '#8b5cf6',
  },
  {
    id: 'cash-flow',
    title: 'Cash Flow Forecaster',
    description: 'Predictive liquidity algorithms using supervised learning. Real-time dashboards included.',
    category: 'Analytics',
    features: [
      'Predictive modeling',
      'Liquidity forecasts',
      'Real-time dashboards',
      '90-day projections',
    ],
    compliance: ['pci'],
    pricingModel: 'Pro Plan • $2,490/month',
    icon: TrendingUp,
    accentColor: '#22c55e',
  },
  {
    id: 'spend-optimizer',
    title: 'SaaS Spend Optimizer',
    description: 'AI-powered subscription rate negotiator. Achieve 30%+ savings on enterprise SaaS.',
    category: 'Optimization',
    features: [
      'AI-powered negotiation',
      'Spend analytics',
      '30%+ savings average',
      'Audit trail logging',
    ],
    compliance: [],
    pricingModel: 'Revenue share • 20% of savings',
    icon: AlertCircle,
    accentColor: '#f59e0b',
  },
  {
    id: 'wallet-rails',
    title: 'Programmable Wallet Rails',
    description: 'Key governance API for wallet infrastructure. Secure fund movement with audit logging.',
    category: 'Infrastructure',
    features: [
      'Key governance',
      'Fund movement APIs',
      'Audit trail logging',
      'Multi-sig support',
    ],
    compliance: ['soc2', 'pci'],
    pricingModel: 'License • $3,990/month',
    icon: Key,
    accentColor: '#06b6d4',
  },
];

interface MarketplaceGridProps {
  onSelectProduct?: (productId: string) => void;
}

export default function MarketplaceGrid({ onSelectProduct }: MarketplaceGridProps) {
  return (
    <div className="w-full">
      {/* Product Grid - 2-3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const Icon = product.icon;
          
          return (
            <div
              key={product.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Icon & Title */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {product.category}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${product.accentColor}20` }}>
                  <Icon className="w-5 h-5" style={{ color: product.accentColor }} />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Features List */}
              <div className="space-y-2 mb-4">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Compliance Badges */}
              {product.compliance.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.compliance.map((badge) => (
                    <span
                      key={badge}
                      className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-900/20 border border-blue-700 text-blue-400"
                    >
                      {badge.toUpperCase()} Type II
                    </span>
                  ))}
                </div>
              )}

              {/* Pricing Model & Button */}
              <div className="pt-4 border-t border-slate-700 mt-auto">
                <p className="text-xs text-slate-500 mb-4">
                  {product.pricingModel}
                </p>

                <button
                  onClick={() => onSelectProduct?.(product.id)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                  aria-label={`Select ${product.title}`}
                >
                  Select Service
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-700 mt-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-green-400 font-bold text-lg mb-2">SOC 2 Type II</h4>
            <p className="text-sm text-slate-400">
              Enterprise-grade security and compliance certifications across all services
            </p>
          </div>
          <div>
            <h4 className="text-blue-400 font-bold text-lg mb-2">Sub-50ms Latency</h4>
            <p className="text-sm text-slate-400">
              Optimized for high-frequency trading and real-time reconciliation
            </p>
          </div>
          <div>
            <h4 className="text-cyan-400 font-bold text-lg mb-2">Usage-Based Pricing</h4>
            <p className="text-sm text-slate-400">
              Scale-as-you-grow model with transparent billing and no hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
