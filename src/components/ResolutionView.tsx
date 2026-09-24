/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Customer, Transaction, Order } from '../types';
import { resolveCustomerIssue, ResolutionStep, ResolutionOutcome } from '../resolutionEngine';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  CreditCard,
  ShoppingBag,
  Database,
  ExternalLink,
} from 'lucide-react';

interface ResolutionViewProps {
  customers: Customer[];
  selectedCustomerId: string;
  onSelectCustomer: (id: string) => void;
  transactions: Transaction[];
  orders: Order[];
  onViewDatabase: () => void;
  onRefresh: () => void;
}

export function ResolutionView({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  transactions,
  orders,
  onViewDatabase,
  onRefresh,
}: ResolutionViewProps) {
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const [issueInput, setIssueInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ResolutionStep[]>([]);
  const [outcome, setOutcome] = useState<ResolutionOutcome | null>(null);

  // Quick Scenario Presets
  const presets = [
    {
      title: '₹2,000 Failed Earbuds UPI Refund',
      customerId: 'CUST-1001',
      text: 'My ₹2,000 payment was debited from UPI for Noise-Cancelling Earbuds (ORD-8812) but checkout marked it as failed. Please refund my money.',
      type: 'refund',
    },
    {
      title: '₹99 Delivery Fee Surcharge Inquiry',
      customerId: 'CUST-1004',
      text: 'I was accidentally charged a ₹99 express delivery surcharge on my standard order. Can this fee be reversed?',
      type: 'surcharge',
    },
    {
      title: 'Suspicious ₹8,500 Night Transaction',
      customerId: 'CUST-1002',
      text: 'I noticed an unauthorized charge of ₹8,500 on my card from an unknown location at 3 AM. I did not make this order!',
      type: 'security',
    },
    {
      title: 'Order Status & Tracking',
      customerId: 'CUST-1004',
      text: 'Can you tell me the current courier delivery status of my order ORD-3820?',
      type: 'tracking',
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    onSelectCustomer(preset.customerId);
    setIssueInput(preset.text);
    setOutcome(null);
    setSteps([]);
  };

  const handleRunResolution = async () => {
    if (!issueInput.trim() || isProcessing || !selectedCustomer) return;

    setIsProcessing(true);
    setOutcome(null);
    setSteps([]);

    try {
      const res = await resolveCustomerIssue(selectedCustomer, issueInput, (updatedSteps) => {
        setSteps(updatedSteps);
      });
      setOutcome(res);
      onRefresh();
    } catch (err) {
      console.error('Error running resolution:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Selector & Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Step 1: Select Customer Profile
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Customer & Relational Context</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCustomer(c.id);
                  setOutcome(null);
                  setSteps([]);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  selectedCustomer.id === c.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{c.user?.name || c.id}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    c.customer_status === 'VIP'
                      ? 'bg-amber-400 text-amber-950'
                      : c.risk_level === 'MEDIUM'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {c.customer_status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Context Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block">Total Lifetime Spent</span>
            <span className="text-sm font-bold text-slate-900">₹{selectedCustomer.total_spent.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block">Account Risk Level</span>
            <span
              className={`text-sm font-bold ${
                selectedCustomer.risk_level === 'MEDIUM' ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {selectedCustomer.risk_level} RISK
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block">Orders in PostgreSQL</span>
            <span className="text-sm font-bold text-slate-900">{orders.length} Orders</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block">Last Network IP</span>
            <span className="text-xs font-mono font-medium text-slate-700 truncate block">
              {selectedCustomer.last_ip}
            </span>
          </div>
        </div>
      </div>

      {/* Main Issue Submission & Autonomous Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issue Input & Scenarios */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Step 2: Customer Inquiry
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Submit Issue for Resolution</h3>
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-semibold text-slate-500 block">Try Real-world Scenarios:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2.5 text-left text-xs bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 rounded-xl transition-all flex flex-col justify-between group"
                  >
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-900">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Area */}
            <div className="relative">
              <textarea
                value={issueInput}
                onChange={(e) => setIssueInput(e.target.value)}
                placeholder="Type customer complaint, refund request, order tracking query, or transaction ID..."
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none font-sans"
              />
            </div>

            {/* Action Button */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                Stores ledger records directly in PostgreSQL
              </span>

              <button
                type="button"
                onClick={handleRunResolution}
                disabled={!issueInput.trim() || isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Resolving Issue...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Autonomous Resolution</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Customer Recent Orders / Transactions Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-500" /> Recent PostgreSQL Ledger Records
            </h4>
            <div className="space-y-2">
              {transactions.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {t.id} — ₹{t.amount.toLocaleString()} ({t.payment_method})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {t.order_id || 'Direct'} • {t.location || 'Online'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Timeline & Verified Outcome */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step-by-step Autonomous Execution */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs min-h-[220px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" /> Autonomous Multi-Agent Reasoning
              </h3>
              <span className="text-xs text-slate-400">
                {steps.length > 0 ? `${steps.length} Steps Completed` : 'Waiting for issue'}
              </span>
            </div>

            {steps.length === 0 && !isProcessing && (
              <div className="py-12 text-center text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Click "Run Autonomous Resolution" or pick a scenario above.</p>
                <p className="text-xs text-slate-400 mt-1">
                  The system will inspect PostgreSQL, run fraud rules, and execute resolution in &lt; 2s.
                </p>
              </div>
            )}

            {steps.length > 0 && (
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="p-3 rounded-xl border text-xs bg-slate-50 border-slate-200/70 transition-all flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      {step.status === 'running' && (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      )}
                      {step.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {step.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {step.status === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{step.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outcome Card */}
          {outcome && (
            <div
              className={`rounded-2xl border p-6 shadow-sm ${
                outcome.status === 'RESOLVED_AUTONOMOUSLY'
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    outcome.status === 'RESOLVED_AUTONOMOUSLY'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {outcome.status === 'RESOLVED_AUTONOMOUSLY' ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        outcome.status === 'RESOLVED_AUTONOMOUSLY' ? 'text-emerald-800' : 'text-amber-800'
                      }`}
                    >
                      {outcome.status === 'RESOLVED_AUTONOMOUSLY'
                        ? 'Autonomous Resolution Verified'
                        : 'Action Flagged For Human Verification'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Ticket #{outcome.ticket.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">{outcome.resolutionTitle}</h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{outcome.resolutionDetail}</p>

                  {outcome.refund && (
                    <div className="mt-3 p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                      <div>
                        <span className="font-bold">Refund Record ID:</span> {outcome.refund.id}
                        <span className="block text-[11px] text-emerald-700">
                          Gateway Reference: {outcome.refund.gateway_reference}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-800">
                        ₹{outcome.refund.amount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Cryptographic audit proof */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[280px]">
                      {outcome.auditProof}
                    </span>
                    <button
                      onClick={onViewDatabase}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
                    >
                      Inspect in PostgreSQL <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
