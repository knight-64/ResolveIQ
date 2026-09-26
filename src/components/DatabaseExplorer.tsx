/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabaseDb, SUPABASE_SQL_SCHEMA } from '../supabase';
import { Database, Table, Search, RefreshCw, Copy, Check, ExternalLink, Terminal, Code2, ArrowUpRight, X } from 'lucide-react';

export function DatabaseExplorer() {
  const [activeTable, setActiveTable] = useState<
    'tickets' | 'customers' | 'transactions' | 'orders' | 'refunds' | 'audit_logs' | 'schema'
  >('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const config = supabaseDb.getConfig();
  const customers = supabaseDb.getCustomers();
  const orders = supabaseDb.getAllOrders();
  const transactions = supabaseDb.getAllTransactions();
  const tickets = supabaseDb.getTickets();
  const refunds = supabaseDb.getRefunds();
  const auditLogs = supabaseDb.getAuditLogs();

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tables = [
    { id: 'tickets', label: 'tickets', count: tickets.length },
    { id: 'customers', label: 'customers', count: customers.length },
    { id: 'transactions', label: 'transactions', count: transactions.length },
    { id: 'orders', label: 'orders', count: orders.length },
    { id: 'refunds', label: 'refunds', count: refunds.length },
    { id: 'audit_logs', label: 'audit_logs', count: auditLogs.length },
    { id: 'schema', label: 'SQL Schema (DDL)', count: null },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Console Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-neutral-900">PostgreSQL Relational Ledger</h1>
            <span className="text-[11px] font-mono font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
              schema: public
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  config.isConnected ? 'bg-emerald-600' : 'bg-neutral-400'
                }`}
              />
              <span>{config.statusMessage}</span>
            </span>
            <span>·</span>
            <span>ACID Isolation: Read Committed</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => supabaseDb.resetDatabase()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-md transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Reset Demo Records</span>
          </button>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-md transition-colors"
          >
            <span>Supabase Console</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </a>
        </div>
      </div>

      {/* Main Table Explorer Surface */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Navigation & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 py-2.5 border-b border-neutral-200/80 gap-3 bg-neutral-50/50">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            {tables.map((tbl) => (
              <button
                key={tbl.id}
                type="button"
                onClick={() => {
                  setActiveTable(tbl.id as any);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeTable === tbl.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {tbl.id === 'schema' ? (
                  <Code2 className="w-3.5 h-3.5" />
                ) : (
                  <Table className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span className="font-mono">{tbl.label}</span>
                {tbl.count !== null && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      activeTable === tbl.id
                        ? 'bg-neutral-800 text-neutral-200'
                        : 'bg-neutral-200/70 text-neutral-600'
                    }`}
                  >
                    {tbl.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTable !== 'schema' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter table rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 w-full sm:w-60 font-mono shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table Content Surface */}
        <div className="overflow-x-auto">
          {activeTable === 'schema' ? (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                    PostgreSQL Relational Schema (DDL)
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Execute this script directly in your Supabase SQL Editor to provision tables, constraints, and RLS policies.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy DDL'}</span>
                </button>
              </div>

              <pre className="p-4 bg-neutral-950 text-neutral-100 font-mono text-xs rounded-md overflow-x-auto border border-neutral-800 leading-relaxed">
                <code>{SUPABASE_SQL_SCHEMA}</code>
              </pre>
            </div>
          ) : activeTable === 'tickets' ? (
            <table className="w-full text-left text-xs divide-y divide-neutral-200/80">
              <thead className="bg-neutral-50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">id</th>
                  <th className="py-2.5 px-4 font-medium">customer_id</th>
                  <th className="py-2.5 px-4 font-medium">title</th>
                  <th className="py-2.5 px-4 font-medium">status</th>
                  <th className="py-2.5 px-4 font-medium">priority</th>
                  <th className="py-2.5 px-4 font-medium text-right">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tickets
                  .filter(
                    (t) =>
                      !searchQuery ||
                      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-neutral-900">{t.id}</td>
                      <td className="py-2.5 px-4 font-mono text-neutral-600">{t.customer_id}</td>
                      <td className="py-2.5 px-4 text-neutral-900 font-medium max-w-sm truncate">{t.title}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                            t.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : t.status === 'ESCALATED'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                            t.priority === 'URGENT'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-neutral-500 text-[11px] tabular-nums">
                        {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : activeTable === 'customers' ? (
            <table className="w-full text-left text-xs divide-y divide-neutral-200/80">
              <thead className="bg-neutral-50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">id</th>
                  <th className="py-2.5 px-4 font-medium">user_id</th>
                  <th className="py-2.5 px-4 font-medium">status</th>
                  <th className="py-2.5 px-4 font-medium">risk_level</th>
                  <th className="py-2.5 px-4 font-medium text-right">total_spent</th>
                  <th className="py-2.5 px-4 font-medium">last_ip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers
                  .filter(
                    (c) =>
                      !searchQuery ||
                      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-neutral-900">{c.id}</td>
                      <td className="py-2.5 px-4 text-neutral-700">
                        {c.user?.name} <span className="text-neutral-400 font-mono text-[11px]">({c.user_id})</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 font-medium">
                          {c.customer_status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                            c.risk_level === 'MEDIUM' || c.risk_level === 'HIGH'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {c.risk_level}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-neutral-900 tabular-nums">
                        ₹{c.total_spent.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-neutral-600 text-[11px]">{c.last_ip}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : activeTable === 'transactions' ? (
            <table className="w-full text-left text-xs divide-y divide-neutral-200/80">
              <thead className="bg-neutral-50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">id</th>
                  <th className="py-2.5 px-4 font-medium">order_id</th>
                  <th className="py-2.5 px-4 font-medium text-right">amount</th>
                  <th className="py-2.5 px-4 font-medium">method</th>
                  <th className="py-2.5 px-4 font-medium">status</th>
                  <th className="py-2.5 px-4 font-medium text-right">transaction_date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transactions
                  .filter(
                    (t) =>
                      !searchQuery ||
                      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.order_id?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-neutral-900">{t.id}</td>
                      <td className="py-2.5 px-4 font-mono text-neutral-600">{t.order_id || '—'}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-neutral-900 tabular-nums">
                        ₹{t.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-neutral-600 font-mono text-[11px]">{t.payment_method}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                            t.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-neutral-500 text-[11px] tabular-nums">
                        {new Date(t.transaction_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : activeTable === 'orders' ? (
            <table className="w-full text-left text-xs divide-y divide-neutral-200/80">
              <thead className="bg-neutral-50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">id</th>
                  <th className="py-2.5 px-4 font-medium">customer_id</th>
                  <th className="py-2.5 px-4 font-medium text-right">amount</th>
                  <th className="py-2.5 px-4 font-medium">status</th>
                  <th className="py-2.5 px-4 font-medium">items_summary</th>
                  <th className="py-2.5 px-4 font-medium text-right">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders
                  .filter(
                    (o) =>
                      !searchQuery ||
                      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-neutral-900">{o.id}</td>
                      <td className="py-2.5 px-4 font-mono text-neutral-600">{o.customer_id}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-neutral-900 tabular-nums">
                        ₹{o.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-neutral-700 font-mono text-[11px] max-w-xs truncate">{o.items_summary || '—'}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-neutral-500 text-[11px] tabular-nums">
                        {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : activeTable === 'refunds' ? (
            <table className="w-full text-left text-xs divide-y divide-neutral-200/80">
              <thead className="bg-neutral-50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">id</th>
                  <th className="py-2.5 px-4 font-medium">transaction_id</th>
                  <th className="py-2.5 px-4 font-medium text-right">amount</th>
                  <th className="py-2.5 px-4 font-medium">reason</th>
                  <th className="py-2.5 px-4 font-medium">gateway_reference</th>
                  <th className="py-2.5 px-4 font-medium">status</th>
                  <th className="py-2.5 px-4 font-medium text-right">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {refunds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-400">
                      No refunds have been processed yet. Settle a claim from the Dispute Workbench to record ledger disbursements.
                    </td>
                  </tr>
                ) : (
                  refunds
                    .filter(
                      (r) =>
                        !searchQuery ||
                        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.reason.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-mono font-medium text-neutral-900">{r.id}</td>
                        <td className="py-2.5 px-4 font-mono text-neutral-600">{r.transaction_id}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                          ₹{r.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-700 max-w-xs truncate">{r.reason}</td>
                        <td className="py-2.5 px-4 font-mono text-neutral-500 text-[11px]">{r.gateway_reference}</td>
                        <td className="py-2.5 px-4">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-neutral-500 text-[11px] tabular-nums">
                          {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs divide-y divide-neutral-200/80">
              <thead className="bg-neutral-50 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">id</th>
                  <th className="py-2.5 px-4 font-medium">action</th>
                  <th className="py-2.5 px-4 font-medium">ticket_id</th>
                  <th className="py-2.5 px-4 font-medium">actor</th>
                  <th className="py-2.5 px-4 font-medium">metadata</th>
                  <th className="py-2.5 px-4 font-medium text-right">timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-neutral-900">{log.id}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-neutral-900 text-[11px]">{log.action}</td>
                    <td className="py-2.5 px-4 font-mono text-neutral-600 text-[11px]">{log.ticket_id}</td>
                    <td className="py-2.5 px-4 text-neutral-700 text-[11px]">{log.actor}</td>
                    <td className="py-2.5 px-4 font-mono text-neutral-500 text-[10px] max-w-xs truncate">
                      {JSON.stringify(log.metadata)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-neutral-500 text-[11px] tabular-nums">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
