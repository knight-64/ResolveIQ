/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseDb } from '../supabase';
import { Ticket, Customer } from '../types';
import {
  ShieldAlert,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Shield,
  CheckCircle2,
  FileText,
  CornerDownRight,
  ArrowRight,
  UserCheck,
  Check,
  XCircle,
} from 'lucide-react';

import { useToast } from './Toast';

interface HumanQueueProps {
  onRefresh: () => void;
}

export function HumanQueue({ onRefresh }: HumanQueueProps) {
  const { showToast } = useToast();
  const tickets = supabaseDb.getTickets();
  const customers = supabaseDb.getCustomers();
  const escalatedTickets = tickets.filter((t) => t.status === 'ESCALATED' || t.priority === 'URGENT');

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(escalatedTickets[0] || null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionDone, setActionDone] = useState(false);

  useEffect(() => {
    if (!selectedTicket && escalatedTickets.length > 0) {
      setSelectedTicket(escalatedTickets[0]);
    } else if (selectedTicket) {
      const current = escalatedTickets.find((t) => t.id === selectedTicket.id);
      if (!current) {
        setSelectedTicket(escalatedTickets[0] || null);
      }
    }
  }, [tickets]);

  const handleResolveEscalation = async (status: 'RESOLVED') => {
    if (!selectedTicket) return;

    await supabaseDb.updateTicketStatus(
      selectedTicket.id,
      status,
      resolutionNotes || 'Manually approved by Fraud Review Officer after identity verification.'
    );

    setActionDone(true);
    setTimeout(() => setActionDone(false), 2000);
    onRefresh();

    showToast({
      type: 'success',
      title: 'Supervisor Approval Committed',
      description: `Incident ${selectedTicket.id} marked as RESOLVED in PostgreSQL ledger.`,
    });
  };

  const getCustomer = (id: string): Customer | undefined => {
    return customers.find((c) => c.id === id);
  };

  const selectedCustomer = selectedTicket ? getCustomer(selectedTicket.customer_id) : undefined;

  const quickNotes = [
    'Verified cardholder identity via 2FA confirmation.',
    'Confirmed merchant transaction mismatch in banking ledger.',
    'Approved as one-time VIP loyalty accommodation.',
  ];

  return (
    <div className="space-y-6">
      {/* Top Console Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-neutral-900">Security &amp; Fraud Review Queue</h1>
            <span className="text-[11px] font-mono font-medium text-amber-800 bg-amber-50 border border-amber-300/80 px-2 py-0.5 rounded">
              Tier-2 Human Escalations
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Disputes flagged for anomalous IP footprints, high refund thresholds, or security exceptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Active Incidents:</span>
          <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300/80 tabular-nums">
            {escalatedTickets.length} pending
          </span>
        </div>
      </div>

      {escalatedTickets.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center shadow-2xs">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h2 className="text-sm font-semibold text-neutral-900">Escalations Queue is Clean</h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            All customer disputes have either been settled autonomously by the rule engine or signed off by supervisors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Flagged Cases List */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-[11px] font-medium text-neutral-500 px-1">
              FLAGGED CASES ({escalatedTickets.length})
            </div>

            {escalatedTickets.map((t) => {
              const cust = getCustomer(t.customer_id);
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-neutral-50/90 border-neutral-900 shadow-2xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-neutral-900">{t.id}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        t.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-neutral-900 mt-2">{t.title}</h3>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-medium text-neutral-700 truncate max-w-[170px]">
                      {cust?.user?.name || t.customer_id}
                    </span>
                    <span className="font-mono text-[10px]">
                      {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Case Review Dossier */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="bg-white rounded-lg border border-neutral-200 shadow-2xs p-5 sm:p-6 space-y-5">
                {/* Dossier Header */}
                <div className="flex items-start justify-between pb-3.5 border-b border-neutral-200/80">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                      <span>Case Review</span>
                      <span>/</span>
                      <span className="font-semibold text-neutral-900">{selectedTicket.id}</span>
                    </div>
                    <h2 className="text-sm font-semibold text-neutral-900 mt-1">{selectedTicket.title}</h2>
                  </div>

                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Account & Security Summary */}
                {selectedCustomer && (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-50/80 rounded-md border border-neutral-200 text-xs">
                    <div>
                      <span className="text-neutral-500 text-[11px] block">Customer</span>
                      <span className="font-semibold text-neutral-900 mt-0.5 block">{selectedCustomer.user?.name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[11px] block">Risk Evaluation</span>
                      <span className="font-semibold text-rose-700 mt-0.5 block">{selectedCustomer.risk_level} Risk</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[11px] block">Origin IP Address</span>
                      <span className="font-mono text-neutral-800 text-[11px] mt-0.5 block">{selectedCustomer.last_ip}</span>
                    </div>
                  </div>
                )}

                {/* Customer Claim Quote */}
                <div className="p-3.5 bg-neutral-50/60 rounded-md border border-neutral-200 text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Customer Statement:
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-sans italic">
                    "{selectedTicket.description}"
                  </p>
                </div>

                {/* Security Anomaly Detail Card */}
                <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-md text-xs text-rose-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-900">
                    <Shield className="w-3.5 h-3.5 text-rose-600" />
                    <span>Security Rule Triggered · IP Geolocation Mismatch</span>
                  </div>
                  <p className="text-rose-800/90 text-[11px] leading-relaxed">
                    Customer session originated from a known proxy/Tor exit address and requested a high-value disbursement.
                    Automated payout was halted by the security guard. Human officer confirmation is required.
                  </p>
                </div>

                {/* Supervisor Notes & Decision Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="supervisor-notes" className="block text-xs font-semibold text-neutral-800">
                      Supervisor Decision &amp; Audit Rationale:
                    </label>
                    <span className="text-[11px] text-neutral-400">Written to PostgreSQL audit ledger</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {quickNotes.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setResolutionNotes(q)}
                        className="text-[11px] text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 px-2 py-0.5 rounded transition-colors"
                      >
                        + {q.slice(0, 30)}...
                      </button>
                    ))}
                  </div>

                  <textarea
                    id="supervisor-notes"
                    rows={3}
                    placeholder="Enter verification notes (e.g. Identity verified with 2FA confirmation via phone; user authorized transaction)..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full p-3 bg-neutral-50/50 border border-neutral-300 rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Confirmation Feedback */}
                {actionDone && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Resolution logged and synced to PostgreSQL database.</span>
                  </div>
                )}

                {/* Supervisor Action Button */}
                <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleResolveEscalation('RESOLVED')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium transition-colors shadow-2xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approve Resolution &amp; Update Ledger</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-8 text-center text-neutral-400 text-xs">
                Select an escalation record from the list to review the security dossier.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
