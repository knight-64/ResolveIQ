/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  ArrowRight,
  GitBranch,
  Layers,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Zap,
  Server,
  Code2,
  FileCheck,
  UserCheck,
  CreditCard,
  Building2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  TableProperties,
} from 'lucide-react';
import { Logo } from './Logo';

export function AboutSection() {
  const [activeDiagram, setActiveDiagram] = useState<'architecture' | 'decision_tree' | 'er_schema' | 'security_matrix'>('architecture');
  const [selectedArchNode, setSelectedArchNode] = useState<string>('guard');
  const [selectedTable, setSelectedTable] = useState<string>('refunds');

  const archNodes: Record<
    string,
    { title: string; subtitle: string; role: string; latency: string; tech: string; guarantee: string }
  > = {
    client: {
      title: 'Client & Frontline Layer',
      subtitle: 'Dispute Console & Live Support Assistant',
      role: 'Captures dispute claims, presents customer account dossier, and renders verified receipts.',
      latency: '< 50ms',
      tech: 'React 19, TypeScript, Tailwind CSS',
      guarantee: 'Zero unverified inputs; validates claim context client-side.',
    },
    ai_engine: {
      title: 'Cognitive Intent Engine',
      subtitle: 'Entity Extraction & Claim Normalization',
      role: 'Parses freeform customer messages, extracts transaction IDs (TXN-...), amounts, and claim rationale.',
      latency: '300ms - 800ms',
      tech: 'Google Gemini 2.5 Flash API',
      guarantee: 'Read-only reasoning; NEVER granted direct financial mutation permissions.',
    },
    guard: {
      title: 'Deterministic Policy Guard',
      subtitle: 'Mathematical Rule & Security Validation',
      role: 'Evaluates refund limits (₹5,000 threshold), IP proxy/Tor checks, duplicate claim detection, and return SLAs.',
      latency: '< 10ms',
      tech: 'Deterministic TypeScript Rule Engine',
      guarantee: '100% deterministic; zero LLM hallucinations in financial decisions.',
    },
    database: {
      title: 'PostgreSQL Relational Ledger',
      subtitle: 'ACID Transactions & Row-Level Security',
      role: 'Executes atomic updates across tickets, refunds, and audit_logs tables with foreign key integrity.',
      latency: '< 20ms',
      tech: 'PostgreSQL / Supabase (Read Committed Isolation)',
      guarantee: 'Strict ACID compliance; permanent immutable audit trail.',
    },
    gateway: {
      title: 'Banking & Payment Settlement',
      subtitle: 'Instant UPI & Card Reversal Gateway',
      role: 'Dispatches disbursement instructions to banking partner APIs for instant refund crediting.',
      latency: '200ms - 600ms',
      tech: 'UPI 2.0, NPCI Switch, Payment Gateway APIs',
      guarantee: 'Idempotent gateway authorization with unique transaction hashes.',
    },
  };

  const schemaTables: Record<
    string,
    {
      description: string;
      primaryKey: string;
      foreignKeys: string[];
      columns: { name: string; type: string; desc: string }[];
    }
  > = {
    customers: {
      description: 'Customer profile with lifetime spend, verified risk score, and active session telemetry.',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['user_id -> users.id'],
      columns: [
        { name: 'id', type: 'VARCHAR', desc: 'Customer identifier (e.g. CUST-1001)' },
        { name: 'user_id', type: 'VARCHAR', desc: 'Link to authentication user record' },
        { name: 'customer_status', type: 'VARCHAR', desc: 'VIP or REGULAR tier SLA status' },
        { name: 'risk_level', type: 'VARCHAR', desc: 'LOW, MEDIUM, or HIGH risk classification' },
        { name: 'total_spent', type: 'NUMERIC', desc: 'Cumulative verified purchases in INR' },
        { name: 'last_ip', type: 'VARCHAR', desc: 'IP address from latest authenticated session' },
      ],
    },
    transactions: {
      description: 'Ledger of all payment debits and capture attempts across payment gateways.',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['order_id -> orders.id'],
      columns: [
        { name: 'id', type: 'VARCHAR', desc: 'Transaction reference (e.g. TXN-78291)' },
        { name: 'order_id', type: 'VARCHAR', desc: 'Associated merchant order reference' },
        { name: 'amount', type: 'NUMERIC', desc: 'Charged value in INR' },
        { name: 'payment_method', type: 'VARCHAR', desc: 'UPI, Credit Card, or NetBanking' },
        { name: 'status', type: 'VARCHAR', desc: 'SUCCESS, FAILED, or PENDING' },
        { name: 'transaction_date', type: 'TIMESTAMP', desc: 'Timestamp of debit attempt' },
      ],
    },
    orders: {
      description: 'Commercial sales orders linked to items, customer accounts, and fulfillment tracking.',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['customer_id -> customers.id'],
      columns: [
        { name: 'id', type: 'VARCHAR', desc: 'Order reference (e.g. ORD-8812)' },
        { name: 'customer_id', type: 'VARCHAR', desc: 'Purchasing customer account' },
        { name: 'amount', type: 'NUMERIC', desc: 'Gross order value' },
        { name: 'status', type: 'VARCHAR', desc: 'DELIVERED, IN_TRANSIT, or CANCELLED' },
        { name: 'items_summary', type: 'VARCHAR', desc: 'Catalog item description' },
        { name: 'created_at', type: 'TIMESTAMP', desc: 'Checkout creation time' },
      ],
    },
    tickets: {
      description: 'Support cases and dispute claims tracked through resolution or human escalation.',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['customer_id -> customers.id'],
      columns: [
        { name: 'id', type: 'VARCHAR', desc: 'Case reference (e.g. TCK-9182)' },
        { name: 'customer_id', type: 'VARCHAR', desc: 'Complainant customer ID' },
        { name: 'title', type: 'VARCHAR', desc: 'Dispute headline' },
        { name: 'description', type: 'TEXT', desc: 'Raw customer claim text' },
        { name: 'status', type: 'VARCHAR', desc: 'OPEN, ESCALATED, or RESOLVED' },
        { name: 'priority', type: 'VARCHAR', desc: 'LOW, MEDIUM, HIGH, or URGENT' },
        { name: 'resolution_notes', type: 'TEXT', desc: 'Audit rationale recorded on resolution' },
      ],
    },
    refunds: {
      description: 'Financial disbursement ledger recording all approved reversals and gateway authorizations.',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['transaction_id -> transactions.id'],
      columns: [
        { name: 'id', type: 'VARCHAR', desc: 'Disbursement ID (e.g. RF-948102)' },
        { name: 'transaction_id', type: 'VARCHAR', desc: 'Original debit transaction' },
        { name: 'amount', type: 'NUMERIC', desc: 'Settled refund value' },
        { name: 'reason', type: 'VARCHAR', desc: 'Policy justification code' },
        { name: 'gateway_reference', type: 'VARCHAR', desc: 'Bank authorization confirmation' },
        { name: 'status', type: 'VARCHAR', desc: 'SETTLED or PENDING' },
      ],
    },
    audit_logs: {
      description: 'Immutable forensic ledger logging every autonomous decision, security flag, and supervisor sign-off.',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['ticket_id -> tickets.id'],
      columns: [
        { name: 'id', type: 'VARCHAR', desc: 'Audit record reference' },
        { name: 'action', type: 'VARCHAR', desc: 'AUTONOMOUS_REFUND_EXECUTED, ESCALATED_ANOMALY, etc.' },
        { name: 'ticket_id', type: 'VARCHAR', desc: 'Associated dispute ticket' },
        { name: 'actor', type: 'VARCHAR', desc: 'SYSTEM_BOT or SUPERVISOR_OFFICER' },
        { name: 'metadata', type: 'JSONB', desc: 'Detailed snapshot of claim parameters' },
        { name: 'created_at', type: 'TIMESTAMP', desc: 'Exact millisecond timestamp' },
      ],
    },
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Platform Hero Banner */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-2xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Logo size="lg" showWordmark={true} />
              <span className="text-xs font-mono font-semibold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded">
                Platform Architecture
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight">
              Autonomous Customer Support &amp; Dispute Resolution Engine
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
              ResolveIQ combines modern LLM entity comprehension with strict mathematical policy guards and ACID PostgreSQL database transactions to deliver instant, secure financial dispute settlements.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-2 gap-3 shrink-0 font-mono text-xs">
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
              <span className="text-[10px] text-neutral-500 block uppercase">Settlement SLA</span>
              <span className="font-bold text-emerald-700 text-sm">&lt; 2.0 Seconds</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
              <span className="text-[10px] text-neutral-500 block uppercase">Policy Precision</span>
              <span className="font-bold text-neutral-900 text-sm">100% Deterministic</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
              <span className="text-[10px] text-neutral-500 block uppercase">Disbursement Cap</span>
              <span className="font-bold text-neutral-900 text-sm">₹5,000 Auto-Limit</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
              <span className="text-[10px] text-neutral-500 block uppercase">Audit Protocol</span>
              <span className="font-bold text-neutral-900 text-sm">ACID Ledger</span>
            </div>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-neutral-900">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Instant Autonomous Reversals</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Traditional banking disputes take 3 to 7 business days. ResolveIQ verifies failed checkout debits and reverses funds to original payment accounts in real-time.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-neutral-900">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Zero-Hallucination Guardrails</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              AI models are restricted exclusively to intent and entity extraction. Financial disbursements are governed by non-bypassable programmatic rule checks.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-neutral-900">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>Automated Fraud &amp; Tor Triage</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Suspicious sessions (proxy IPs, Tor exit nodes, high-value claims) are automatically routed into the Tier-2 Human Escalation queue with full forensic context.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Diagram Tabs Switcher */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-700" />
            <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              System Architecture &amp; Schematics
            </span>
          </div>

          {/* Diagram Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveDiagram('architecture')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeDiagram === 'architecture'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              1. System Architecture
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('decision_tree')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeDiagram === 'decision_tree'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              2. Dispute Flowchart
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('er_schema')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeDiagram === 'er_schema'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              3. Relational ER Schema
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('security_matrix')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeDiagram === 'security_matrix'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              4. Security Matrix
            </button>
          </div>
        </div>

        {/* Diagram Surface 1: End-to-End System Architecture */}
        {activeDiagram === 'architecture' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Five-Tier Modular Architecture Diagram
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Click any layer in the schematic below to inspect its operational role, latency SLA, and security guarantees.
              </p>
            </div>

            {/* Visual Architecture Flow schematic */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {/* Layer 1: Client Frontline */}
              <div
                onClick={() => setSelectedArchNode('client')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedArchNode === 'client'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono opacity-60">LAYER 01</span>
                  <Terminal className="w-4 h-4 opacity-80" />
                </div>
                <h3 className="text-xs font-semibold">Client Frontline</h3>
                <p className="text-[11px] opacity-75 mt-1">Console &amp; Chat</p>
                <span className="text-[10px] font-mono mt-3 inline-block px-1.5 py-0.5 rounded bg-black/10">
                  Latency: &lt; 50ms
                </span>
              </div>

              {/* Layer 2: Cognitive Reasoning */}
              <div
                onClick={() => setSelectedArchNode('ai_engine')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedArchNode === 'ai_engine'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono opacity-60">LAYER 02</span>
                  <Cpu className="w-4 h-4 opacity-80" />
                </div>
                <h3 className="text-xs font-semibold">Cognitive Engine</h3>
                <p className="text-[11px] opacity-75 mt-1">Gemini Entity Parser</p>
                <span className="text-[10px] font-mono mt-3 inline-block px-1.5 py-0.5 rounded bg-black/10">
                  Latency: ~400ms
                </span>
              </div>

              {/* Layer 3: Deterministic Policy Guard */}
              <div
                onClick={() => setSelectedArchNode('guard')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedArchNode === 'guard'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono opacity-60">LAYER 03</span>
                  <ShieldCheck className="w-4 h-4 opacity-80" />
                </div>
                <h3 className="text-xs font-semibold">Policy Guard</h3>
                <p className="text-[11px] opacity-75 mt-1">Deterministic Rules</p>
                <span className="text-[10px] font-mono mt-3 inline-block px-1.5 py-0.5 rounded bg-black/10">
                  Latency: &lt; 10ms
                </span>
              </div>

              {/* Layer 4: PostgreSQL Ledger */}
              <div
                onClick={() => setSelectedArchNode('database')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedArchNode === 'database'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono opacity-60">LAYER 04</span>
                  <Database className="w-4 h-4 opacity-80" />
                </div>
                <h3 className="text-xs font-semibold">PostgreSQL Ledger</h3>
                <p className="text-[11px] opacity-75 mt-1">ACID Ledger &amp; Logs</p>
                <span className="text-[10px] font-mono mt-3 inline-block px-1.5 py-0.5 rounded bg-black/10">
                  Latency: &lt; 20ms
                </span>
              </div>

              {/* Layer 5: Settlement Gateway */}
              <div
                onClick={() => setSelectedArchNode('gateway')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedArchNode === 'gateway'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono opacity-60">LAYER 05</span>
                  <CreditCard className="w-4 h-4 opacity-80" />
                </div>
                <h3 className="text-xs font-semibold">Banking Gateway</h3>
                <p className="text-[11px] opacity-75 mt-1">UPI &amp; Card Reversal</p>
                <span className="text-[10px] font-mono mt-3 inline-block px-1.5 py-0.5 rounded bg-black/10">
                  Latency: ~300ms
                </span>
              </div>
            </div>

            {/* Selected Node Deep-Dive Inspection Card */}
            {selectedArchNode && (
              <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                      Layer Specification
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-0.5">
                      {archNodes[selectedArchNode].title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-600 bg-white px-2.5 py-1 rounded border border-neutral-200/80">
                    Target SLA: {archNodes[selectedArchNode].latency}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-neutral-500 block mb-1">Operational Role</span>
                    <p className="text-neutral-800 leading-relaxed">
                      {archNodes[selectedArchNode].role}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block mb-1">Underlying Technology</span>
                    <p className="font-mono text-neutral-800 text-[11px] bg-white p-2 rounded border border-neutral-200">
                      {archNodes[selectedArchNode].tech}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block mb-1">Security &amp; Correctness Guarantee</span>
                    <p className="text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200/80 font-medium">
                      ✓ {archNodes[selectedArchNode].guarantee}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diagram Surface 2: Dispute Flowchart & State Machine */}
        {activeDiagram === 'decision_tree' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Autonomous Dispute Resolution State Machine
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Traces the execution path from customer claim ingestion through deterministic policy branching and ledger commits.
              </p>
            </div>

            {/* Visual SVG Flowchart Schematic */}
            <div className="bg-neutral-950 text-white rounded-lg p-6 font-mono text-xs overflow-x-auto border border-neutral-800">
              <div className="min-w-[680px] space-y-5">
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-28 text-neutral-400 text-[11px]">01 INGESTION</div>
                  <div className="p-2.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-200 flex-1">
                    Customer submits claim text / clicks disputed transaction from ledger history
                  </div>
                </div>

                <div className="pl-32 text-neutral-500 text-xs">↓</div>

                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-28 text-neutral-400 text-[11px]">02 EXTRACTION</div>
                  <div className="p-2.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-200 flex-1">
                    Gemini Flash extracts: Transaction ID (TXN-...), Claim Amount (₹), and Reason Code
                  </div>
                </div>

                <div className="pl-32 text-neutral-500 text-xs">↓</div>

                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-28 text-neutral-400 text-[11px]">03 DB VERIFY</div>
                  <div className="p-2.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-200 flex-1">
                    Query PostgreSQL: Confirm transaction exists, match customer ID, verify debit status
                  </div>
                </div>

                <div className="pl-32 text-neutral-500 text-xs">↓</div>

                {/* Step 4: Decision Fork */}
                <div className="flex items-start gap-3">
                  <div className="w-28 text-amber-400 text-[11px] pt-2">04 POLICY GATE</div>
                  <div className="p-3 bg-neutral-900/90 border border-amber-500/50 rounded flex-1 space-y-2">
                    <div className="text-amber-300 font-semibold">
                      Deterministic Rule Engine Evaluation:
                    </div>
                    <div className="text-[11px] text-neutral-300 space-y-1 pl-2 border-l border-neutral-700">
                      <div>• Is transaction amount &le; ₹5,000 threshold?</div>
                      <div>• Is origin IP clean (not a Tor exit node / proxy)?</div>
                      <div>• Is customer account active and verified?</div>
                    </div>
                  </div>
                </div>

                {/* Branching Paths */}
                <div className="grid grid-cols-2 gap-4 pl-32 pt-2">
                  {/* Path A: PASS */}
                  <div className="p-3.5 rounded border border-emerald-500/60 bg-emerald-950/40 text-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PATH A: ALL RULES PASS</span>
                    </div>
                    <p className="text-[11px] text-emerald-100/80 leading-relaxed font-sans">
                      1. Create refund record in PostgreSQL ledger<br />
                      2. Commit ACID transaction (status: SETTLED)<br />
                      3. Dispatch UPI reimbursement instructions<br />
                      4. Generate forensic settlement receipt (<span className="font-mono text-emerald-300">&lt; 2.0s SLA</span>)
                    </p>
                  </div>

                  {/* Path B: ANOMALY */}
                  <div className="p-3.5 rounded border border-rose-500/60 bg-rose-950/40 text-rose-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>PATH B: SECURITY ANOMALY TRIGGERED</span>
                    </div>
                    <p className="text-[11px] text-rose-100/80 leading-relaxed font-sans">
                      1. Halt autonomous payout immediately<br />
                      2. Tag ticket with <span className="font-mono text-rose-300">status: ESCALATED</span><br />
                      3. Route to Tier-2 Supervisor Queue<br />
                      4. Require human officer 2FA &amp; audit sign-off
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram Surface 3: Relational ER Schema */}
        {activeDiagram === 'er_schema' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                PostgreSQL Relational Schema &amp; Table Relationships
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Explore the 6 core tables powering ResolveIQ's relational integrity and foreign key constraints.
              </p>
            </div>

            {/* Table Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {Object.keys(schemaTables).map((tbl) => (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => setSelectedTable(tbl)}
                  className={`px-3 py-1.5 rounded-md font-mono transition-colors ${
                    selectedTable === tbl
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>

            {/* Selected Table Detail Card */}
            {selectedTable && schemaTables[selectedTable] && (
              <div className="bg-neutral-50/80 rounded-lg border border-neutral-200 overflow-hidden">
                <div className="p-4 bg-white border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <TableProperties className="w-4 h-4 text-neutral-700" />
                      <span className="font-mono font-bold text-sm text-neutral-900">{selectedTable}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {schemaTables[selectedTable].description}
                    </p>
                  </div>

                  <div className="text-right text-xs font-mono">
                    <span className="text-neutral-400 block text-[10px]">PRIMARY KEY</span>
                    <span className="text-neutral-900 font-semibold">{schemaTables[selectedTable].primaryKey}</span>
                  </div>
                </div>

                {/* Columns Table */}
                <table className="w-full text-left text-xs divide-y divide-neutral-200/80">
                  <thead className="bg-neutral-100 text-neutral-600 font-mono text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Column Name</th>
                      <th className="py-2.5 px-4 font-semibold">Data Type</th>
                      <th className="py-2.5 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/60 bg-white font-mono">
                    {schemaTables[selectedTable].columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-2 px-4 font-semibold text-neutral-900">{col.name}</td>
                        <td className="py-2 px-4 text-neutral-600 text-[11px]">{col.type}</td>
                        <td className="py-2 px-4 text-neutral-700 font-sans text-xs">{col.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Diagram Surface 4: Security & Policy Matrix */}
        {activeDiagram === 'security_matrix' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Security &amp; Deterministic Policy Rules Matrix
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                How ResolveIQ eliminates financial risk while maintaining sub-2-second resolution velocity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Security Pillar 1 */}
              <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Threshold Caps (₹5,000 Auto-Disbursement Limit)</span>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  Automated settlement is capped at ₹5,000 per claim. Any claim exceeding ₹5,000 is automatically elevated to the supervisor review queue to prevent high-value exploitation.
                </p>
              </div>

              {/* Security Pillar 2 */}
              <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>Anonymity &amp; Tor Exit Node Detection</span>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  Client IP addresses are evaluated against known Tor exit node databases and datacenter proxies. Anomalous network locations block autonomous payout and flag a security alert.
                </p>
              </div>

              {/* Security Pillar 3 */}
              <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>PostgreSQL ACID Reversals &amp; Idempotency</span>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  Every disbursement creates a cryptographic gateway reference and inserts a row into the <code className="font-mono bg-neutral-100 px-1 rounded">refunds</code> table under strict transactional isolation, preventing double-refunds.
                </p>
              </div>

              {/* Security Pillar 4 */}
              <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  <span>Permanent Forensic Audit Trail</span>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  All system activities (autonomous resolutions, supervisor approvals, rejected claims) are recorded in the <code className="font-mono bg-neutral-100 px-1 rounded">audit_logs</code> table with metadata and millisecond timestamps.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tech Stack & Implementation Specifications */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
          Technology Stack &amp; Implementation Details
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
            <span className="text-[10px] text-neutral-400 block uppercase">FRONTEND</span>
            <span className="font-semibold text-neutral-900 mt-1 block">React 19 + TypeScript</span>
            <span className="text-[11px] text-neutral-500">Tailwind CSS + Lucide</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
            <span className="text-[10px] text-neutral-400 block uppercase">INTELLIGENCE</span>
            <span className="font-semibold text-neutral-900 mt-1 block">Google Gemini 2.5 Flash</span>
            <span className="text-[11px] text-neutral-500">@google/genai SDK</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
            <span className="text-[10px] text-neutral-400 block uppercase">DATABASE</span>
            <span className="font-semibold text-neutral-900 mt-1 block">PostgreSQL / Supabase</span>
            <span className="text-[11px] text-neutral-500">ACID Relational Ledger</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
            <span className="text-[10px] text-neutral-400 block uppercase">BACKEND / PROXY</span>
            <span className="font-semibold text-neutral-900 mt-1 block">Express + Vite SSR</span>
            <span className="text-[11px] text-neutral-500">Secure API Proxying</span>
          </div>
        </div>
      </div>
    </div>
  );
}
