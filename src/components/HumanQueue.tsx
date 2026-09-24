/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseDb } from '../supabase';
import { Ticket, Customer } from '../types';
import { UserCheck, ShieldAlert, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface HumanQueueProps {
  onRefresh: () => void;
}

export function HumanQueue({ onRefresh }: HumanQueueProps) {
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
      resolutionNotes || 'Manually approved by Senior Fraud Officer after customer security verification.'
    );

    setActionDone(true);
    setTimeout(() => setActionDone(false), 2000);
    onRefresh();
  };

  const getCustomer = (id: string): Customer | undefined => {
    return customers.find((c) => c.id === id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Human Escalation & Security Queue</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cases flagged by Autonomous Security Agents requiring manual supervisor sign-off.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold rounded-full text-xs">
          {escalatedTickets.length} Escalated Cases
        </span>
      </div>

      {escalatedTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Queue is Clear!</h3>
          <p className="text-xs text-slate-500 mt-1">
            All customer issues have either been resolved autonomously or verified. Try triggering a suspicious case from
            the Live Resolution tab!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Escalations */}
          <div className="lg:col-span-5 space-y-3">
            {escalatedTickets.map((t) => {
              const cust = getCustomer(t.customer_id);
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-800">{t.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      {t.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{t.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{t.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Customer: {cust?.user?.name || t.customer_id}</span>
                    <span>{new Date(t.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Review & Decision Pane */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono text-slate-400">Escalation Review Dossier</span>
                    <h3 className="text-base font-bold text-slate-900">{selectedTicket.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg text-xs">
                    {selectedTicket.status}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
                  <div className="font-semibold text-slate-700">Customer Statement:</div>
                  <p className="text-slate-900 italic">"{selectedTicket.description}"</p>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2 text-rose-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-600" /> Security Anomaly Flag
                  </div>
                  <p className="text-rose-800 leading-relaxed">
                    Triggered by Autonomous Guard. Customer device IP originated from an unauthorized network address or
                    exceeded the instant automated refund safety threshold. Requires human identity verification before
                    disbursing funds.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supervisor Decision & Resolution Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter notes (e.g. Identity verified via phone OTP; customer confirmed authorized transaction)..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {actionDone && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Ticket marked RESOLVED and synchronized to PostgreSQL database!</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleResolveEscalation('RESOLVED')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve & Mark Resolved in PostgreSQL
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                Select an escalation on the left to review details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
