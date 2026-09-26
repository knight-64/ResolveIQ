/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { Customer } from '../types';
import { supabaseDb } from '../supabase';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onCaseCreated: (customerId: string, issue: string) => void;
}

export function CreateCaseModal({
  isOpen,
  onClose,
  customers,
  onCaseCreated,
}: CreateCaseModalProps) {
  if (!isOpen) return null;

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 'CUST-1001');
  const [subject, setSubject] = useState('Payment Gateway Failure & UPI Debit Issue');
  const [priority, setPriority] = useState<'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [description, setDescription] = useState(
    'Customer debited ₹2,000 via UPI on ORD-8812, but checkout status marked as failed. Requesting automated reimbursement.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !subject.trim()) return;

    await supabaseDb.createTicket({
      customer_id: selectedCustomerId,
      title: subject,
      description,
      priority,
      status: 'OPEN',
      intent: 'CUSTOMER_DISPUTE',
      assigned_agent: 'ResolveIQ Engine',
      confidence_score: 95,
      estimated_resolution_time: 'Instant (< 2s)',
    });

    onCaseCreated(selectedCustomerId, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Create New Support Case</h2>
            <p className="text-xs text-neutral-500">File a dispute or inquiry directly into the resolution engine</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Customer Account</label>
            <div className="relative">
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.user?.name} ({c.id}) — {c.customer_status} Tier
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900"
              >
                <option value="URGENT">Urgent (Red Alert)</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-800 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Customer Claim Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-800 focus:outline-hidden focus:border-neutral-900 resize-none font-sans"
              placeholder="Describe dispute details, transaction references, or error messages..."
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#111827] hover:bg-[#1f2937] text-white rounded-lg font-semibold transition-colors shadow-2xs"
            >
              Open in Dispute Workbench
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
