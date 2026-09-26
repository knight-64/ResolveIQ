/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Customer } from '../types';
import { Search, ShieldAlert, ShieldCheck, CreditCard, ShoppingBag, ArrowRight, User } from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  onSelectCustomerForCase: (customerId: string) => void;
}

export function CustomersView({
  customers,
  onSelectCustomerForCase,
}: CustomersViewProps) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Customer Directory</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Verified user accounts, transaction histories, risk evaluation scores, and active sessions.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8.5 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 w-full sm:w-64 shadow-2xs font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-neutral-200/90 p-5 shadow-2xs space-y-4 hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-wider">
                  {c.user?.name
                    ? c.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    : 'CU'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">{c.user?.name}</h2>
                  <span className="text-xs font-mono text-neutral-500">{c.id}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  c.customer_status === 'VIP'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {c.customer_status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span className="text-neutral-400">Email:</span>
                <span className="font-medium text-neutral-800">{c.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Lifetime Spend:</span>
                <span className="font-mono font-bold text-neutral-900">
                  ₹{c.total_spent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Risk Profile:</span>
                <span
                  className={`font-semibold ${
                    c.risk_level === 'LOW' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {c.risk_level} Risk
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">IP Location:</span>
                <span className="font-mono text-[11px] text-neutral-600 truncate max-w-[170px]">
                  {c.last_ip}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectCustomerForCase(c.id)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 rounded-lg text-xs font-semibold transition-colors mt-2"
            >
              <span>Investigate / New Dispute</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
