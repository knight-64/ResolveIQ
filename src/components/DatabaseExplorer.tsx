/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabaseDb, SUPABASE_SQL_SCHEMA } from '../supabase';
import { Database, Table, Search, RefreshCw, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

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
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">PostgreSQL / Supabase Relational Explorer</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Status: <span className="font-semibold text-slate-700">{config.statusMessage}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => supabaseDb.resetDatabase()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Database
          </button>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            Supabase.com <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Table Selector Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between px-6 pt-4 pb-2 border-b border-slate-100 gap-3">
          <div className="flex flex-wrap gap-2">
            {tables.map((tbl) => (
              <button
                key={tbl.id}
                onClick={() => setActiveTable(tbl.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTable === tbl.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tbl.id === 'schema' ? <Terminal className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
                <span className="font-mono">{tbl.label}</span>
                {tbl.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 rounded-full ${
                      activeTable === tbl.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
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
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search rows in table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-48 font-mono"
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-x-auto">
          {activeTable === 'schema' ? (
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">PostgreSQL Schema (Supabase DDL)</h3>
                  <p className="text-xs text-slate-500">
                    Use this script to create the relational schema with foreign key constraints in Supabase SQL editor.
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-[500px]">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          ) : activeTable === 'tickets' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">id (text)</th>
                  <th className="p-3">customer_id</th>
                  <th className="p-3">title</th>
                  <th className="p-3">priority</th>
                  <th className="p-3">status</th>
                  <th className="p-3">assigned_agent</th>
                  <th className="p-3">created_at (timestamptz)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets
                  .filter(
                    (t) =>
                      !searchQuery ||
                      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 font-mono">
                      <td className="p-3 font-bold text-slate-900">{t.id}</td>
                      <td className="p-3 text-slate-600">{t.customer_id}</td>
                      <td className="p-3 text-slate-800 font-sans max-w-xs truncate">{t.title}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.priority === 'URGENT' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'ESCALATED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-sans">{t.assigned_agent}</td>
                      <td className="p-3 text-slate-400">{new Date(t.created_at).toLocaleTimeString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : activeTable === 'transactions' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">id (text)</th>
                  <th className="p-3">customer_id</th>
                  <th className="p-3">order_id</th>
                  <th className="p-3">amount (numeric)</th>
                  <th className="p-3">payment_method</th>
                  <th className="p-3">status</th>
                  <th className="p-3">location & ip</th>
                  <th className="p-3">gateway_ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {transactions
                  .filter(
                    (tx) =>
                      !searchQuery ||
                      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      tx.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">{tx.id}</td>
                      <td className="p-3 text-slate-600">{tx.customer_id}</td>
                      <td className="p-3 text-slate-500">{tx.order_id || '—'}</td>
                      <td className="p-3 font-bold text-slate-900">₹{tx.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-700">{tx.payment_method}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{tx.location || tx.ip_address}</td>
                      <td className="p-3 text-slate-400">{tx.gateway_ref}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : activeTable === 'customers' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">id (text)</th>
                  <th className="p-3">name</th>
                  <th className="p-3">email</th>
                  <th className="p-3">phone</th>
                  <th className="p-3">customer_status</th>
                  <th className="p-3">risk_level</th>
                  <th className="p-3">total_spent (numeric)</th>
                  <th className="p-3">last_ip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{c.id}</td>
                    <td className="p-3 text-slate-800 font-sans font-medium">{c.user?.name}</td>
                    <td className="p-3 text-slate-600">{c.user?.email}</td>
                    <td className="p-3 text-slate-600">{c.user?.phone}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {c.customer_status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.risk_level === 'MEDIUM' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.risk_level}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">₹{c.total_spent.toLocaleString()}</td>
                    <td className="p-3 text-slate-500">{c.last_ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTable === 'refunds' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">id</th>
                  <th className="p-3">transaction_id</th>
                  <th className="p-3">amount</th>
                  <th className="p-3">status</th>
                  <th className="p-3">reason</th>
                  <th className="p-3">gateway_reference</th>
                  <th className="p-3">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {refunds.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-emerald-700">{r.id}</td>
                    <td className="p-3 text-slate-600">{r.transaction_id}</td>
                    <td className="p-3 font-bold text-slate-900">₹{r.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-sans max-w-xs truncate">{r.reason}</td>
                    <td className="p-3 text-slate-500">{r.gateway_reference}</td>
                    <td className="p-3 text-slate-400">{new Date(r.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTable === 'audit_logs' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">id</th>
                  <th className="p-3">ticket_id</th>
                  <th className="p-3">actor</th>
                  <th className="p-3">action</th>
                  <th className="p-3">metadata (jsonb)</th>
                  <th className="p-3">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800">{log.id}</td>
                    <td className="p-3 text-indigo-700">{log.ticket_id}</td>
                    <td className="p-3 text-slate-700 font-sans">{log.actor}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 max-w-sm truncate">{JSON.stringify(log.metadata)}</td>
                    <td className="p-3 text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">id</th>
                  <th className="p-3">customer_id</th>
                  <th className="p-3">amount</th>
                  <th className="p-3">status</th>
                  <th className="p-3">items_summary</th>
                  <th className="p-3">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{o.id}</td>
                    <td className="p-3 text-slate-600">{o.customer_id}</td>
                    <td className="p-3 font-bold text-slate-900">₹{o.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'FAILED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-sans max-w-xs truncate">{o.items_summary}</td>
                    <td className="p-3 text-slate-400">{new Date(o.created_at).toLocaleTimeString()}</td>
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
