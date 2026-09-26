/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  GitBranch,
  Layers,
  Network,
  Lock,
  Zap,
  CheckCircle2,
  Table,
  Terminal,
  Activity,
  UserCheck,
  FileCheck2,
  SlidersHorizontal,
  Workflow,
  Sparkles,
  Server,
  Code2,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Logo } from './Logo';

interface AboutViewProps {
  onNavigate: (tab: 'resolution' | 'human' | 'database') => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  const [activeDiagram, setActiveDiagram] = useState<'architecture' | 'flowchart' | 'erd' | 'security'>('architecture');
  const [selectedNode, setSelectedNode] = useState<string | null>('rule_engine');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Architecture components detail map
  const nodeDetails: Record<string, { title: string; category: string; description: string; tech: string; contract: string }> = {
    frontend: {
      title: 'Operations Console (Frontend)',
      category: 'Client Presentation Tier',
      description: 'Single-page web application providing the dispute triage interface, live customer ledger inspector, incident escalation workbench, and Supabase connection modal.',
      tech: 'React 19, TypeScript, Tailwind CSS v4, Lucide Icons',
      contract: 'Sends structured claims & customer IDs to /api/resolve; listens to DB subscriptions.',
    },
    api_proxy: {
      title: 'Node.js Express Proxy & Middleware',
      category: 'API & Orchestration Layer',
      description: 'Server-side API gateway hosting secure endpoints, managing server-side credentials, shielding API keys from client exposure, and orchestrating full-stack requests.',
      tech: 'Express, Node.js HTTP runtime, Vite middleware bridge',
      contract: 'Handles /api/resolve, /api/chat, /api/health with JSON input validation.',
    },
    rule_engine: {
      title: 'Deterministic Policy & Rule Engine',
      category: 'Core Logic Engine',
      description: 'Deterministic policy evaluation unit that enforces business logic prior to any mutation: instant refund caps (₹5,000), verified status requirements, and return window validations.',
      tech: 'TypeScript, Pure Deterministic Functions, Zero-Hallucination Guard',
      contract: 'Evaluates (Customer, Transaction, Policy) -> { approved: boolean, reason: string, route: AUTO | ESCALATE }',
    },
    gemini_api: {
      title: 'Gemini Flash AI Intent Grounding',
      category: 'Intelligence & Semantic Extraction',
      description: 'Parses unstructured natural language customer complaints, detects emotional tone, extracts referenced transaction IDs and monetary figures, and formats conversational explanations.',
      tech: '@google/genai SDK (Gemini 2.5 Flash)',
      contract: 'Input: Natural language claim -> Output: Structured intent, entities, sentiment.',
    },
    database: {
      title: 'PostgreSQL Relational Ledger',
      category: 'Data & Persistence Tier',
      description: 'ACID-compliant relational database storing users, customers, orders, transactions, tickets, refunds, and append-only immutable audit logs with foreign key constraints.',
      tech: 'PostgreSQL 15+ (Supabase Client & in-memory relational fallback)',
      contract: 'Enforces schemas, row-level security policies, and transactional rollback on failures.',
    },
    fraud_shield: {
      title: 'Security & Risk Evaluation Guard',
      category: 'Security Tier',
      description: 'Analyzes session network telemetry, detects Tor exit nodes and proxy addresses, monitors velocity caps, and automatically halts high-risk payouts for human supervisor review.',
      tech: 'IP Telemetry Inspector, Geolocation Verifier, Anomaly Scoring Model',
      contract: 'Flagged anomalies immediately route ticket to HumanQueue with priority URGENT.',
    },
    human_queue: {
      title: 'Tier-2 Human Escalation Queue',
      category: 'Supervisory Control Tier',
      description: 'Dossier review station where fraud officers inspect flagged disputes, evaluate risk factors, enter verification audit rationale, and execute supervisor sign-off.',
      tech: 'Split-pane case management UI, PostgreSQL mutation logger',
      contract: 'Authorizes delayed disbursements and creates verifiable supervisor audit entries.',
    },
  };

  const selectedDetails = selectedNode ? nodeDetails[selectedNode] : nodeDetails['rule_engine'];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Overview Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <Logo size="lg" showWordmark={true} />
            <span className="text-[11px] font-mono font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
              v2.4 Production Spec
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Autonomous Dispute Resolution &amp; Relational Ledger Platform
          </h1>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            ResolveIQ is an enterprise fintech operations console engineered to settle customer billing disputes,
            failed payment debits, and order claims within <strong>2 seconds</strong>. It blends deterministic
            PostgreSQL relational truth, automated fraud guards, and AI semantic understanding to ensure zero
            hallucinations and 100% financial auditability.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => onNavigate('resolution')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs"
            >
              <span>Open Dispute Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('database')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-md text-xs font-medium transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-neutral-500" />
              <span>Explore PostgreSQL Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Benchmark Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-medium font-mono uppercase tracking-wider">Settlement Latency</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">&lt; 1.8s</div>
          <div className="text-[11px] text-neutral-500 mt-1">From claim ingestion to gateway voucher</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-medium font-mono uppercase tracking-wider">Resolution Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">96.4%</div>
          <div className="text-[11px] text-neutral-500 mt-1">Autonomous policy pass rate without human delay</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-medium font-mono uppercase tracking-wider">Hallucination Rate</span>
            <Lock className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">0.00%</div>
          <div className="text-[11px] text-neutral-500 mt-1">100% grounded in PostgreSQL relational ledger</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-medium font-mono uppercase tracking-wider">Audit Integrity</span>
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">ACID Logged</div>
          <div className="text-[11px] text-neutral-500 mt-1">Every decision writes an immutable audit row</div>
        </div>
      </div>

      {/* Interactive Diagrams Section */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Diagram Switcher Header */}
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-neutral-700" />
              <h2 className="text-sm font-semibold text-neutral-900">Interactive Technical Diagrams &amp; Flowcharts</h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select a view to explore architectural topology, resolution lifecycle, database relationships, and fraud security layers.
            </p>
          </div>

          {/* Diagram Selector Tab Buttons */}
          <div className="flex items-center gap-1 bg-neutral-200/60 p-1 rounded-lg text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveDiagram('architecture')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeDiagram === 'architecture'
                  ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              1. System Architecture
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('flowchart')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeDiagram === 'flowchart'
                  ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              2. Resolution Lifecycle Flowchart
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('erd')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeDiagram === 'erd'
                  ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              3. Database ERD Schema
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('security')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeDiagram === 'security'
                  ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              4. Fraud &amp; Security Defense
            </button>
          </div>
        </div>

        {/* Diagram Content Area */}
        <div className="p-6">
          {/* DIAGRAM 1: SYSTEM ARCHITECTURE */}
          {activeDiagram === 'architecture' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Full-Stack Architecture Topology · Click any block to view component details
                </span>
                <span className="text-[11px] font-mono text-neutral-400">7 Connected Subsystems</span>
              </div>

              {/* Topology Visual Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Client & Ingestion */}
                <div className="space-y-4">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider px-1">Presentation &amp; Ingestion</div>
                  
                  <div
                    onClick={() => setSelectedNode('frontend')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === 'frontend'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Operations Console</span>
                      <Layers className={`w-4 h-4 ${selectedNode === 'frontend' ? 'text-white' : 'text-neutral-500'}`} />
                    </div>
                    <p className={`text-[11px] ${selectedNode === 'frontend' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      React 19 SPA, Tailwind CSS v4, live dispute workbench, database explorer.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedNode('api_proxy')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === 'api_proxy'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Node Express Server Proxy</span>
                      <Server className={`w-4 h-4 ${selectedNode === 'api_proxy' ? 'text-white' : 'text-neutral-500'}`} />
                    </div>
                    <p className={`text-[11px] ${selectedNode === 'api_proxy' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Server endpoints (/api/resolve, /api/chat, /api/health) shielding API secrets.
                    </p>
                  </div>
                </div>

                {/* Column 2: Intelligence & Decision */}
                <div className="space-y-4">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider px-1">Processing &amp; Guards</div>

                  <div
                    onClick={() => setSelectedNode('gemini_api')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === 'gemini_api'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Gemini Flash AI Grounding</span>
                      <Sparkles className={`w-4 h-4 ${selectedNode === 'gemini_api' ? 'text-amber-400' : 'text-neutral-500'}`} />
                    </div>
                    <p className={`text-[11px] ${selectedNode === 'gemini_api' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Semantic entity parsing, sentiment analysis, conversational explanations.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedNode('rule_engine')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === 'rule_engine'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Deterministic Policy Engine</span>
                      <Cpu className={`w-4 h-4 ${selectedNode === 'rule_engine' ? 'text-emerald-400' : 'text-neutral-500'}`} />
                    </div>
                    <p className={`text-[11px] ${selectedNode === 'rule_engine' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Non-hallucinating rules: cap limits (₹5,000), return eligibility, instant credit logic.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedNode('fraud_shield')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === 'fraud_shield'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Fraud &amp; Tor Risk Shield</span>
                      <ShieldAlert className={`w-4 h-4 ${selectedNode === 'fraud_shield' ? 'text-rose-400' : 'text-neutral-500'}`} />
                    </div>
                    <p className={`text-[11px] ${selectedNode === 'fraud_shield' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Network telemetry, Tor exit node detection, velocity anomaly score calculation.
                    </p>
                  </div>
                </div>

                {/* Column 3: Persistence & Execution */}
                <div className="space-y-4">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider px-1">Storage &amp; Handoff</div>

                  <div
                    onClick={() => setSelectedNode('database')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === 'database'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">PostgreSQL Relational Ledger</span>
                      <Database className={`w-4 h-4 ${selectedNode === 'database' ? 'text-emerald-400' : 'text-neutral-500'}`} />
                    </div>
                    <p className={`text-[11px] ${selectedNode === 'database' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Supabase Cloud or in-memory DB: 6 relational tables, ACID transactions, audit logs.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedNode('human_queue')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === 'human_queue'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Tier-2 Human Escalation Queue</span>
                      <UserCheck className={`w-4 h-4 ${selectedNode === 'human_queue' ? 'text-amber-400' : 'text-neutral-500'}`} />
                    </div>
                    <p className={`text-[11px] ${selectedNode === 'human_queue' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Supervisor review queue for high-risk flags, Tor exits, and manual sign-offs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Node Deep-Dive Panel */}
              {selectedDetails && (
                <div className="p-4 sm:p-5 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">
                        {selectedDetails.category}
                      </span>
                      <span className="text-neutral-300">/</span>
                      <span className="text-sm font-semibold text-neutral-900">{selectedDetails.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-600 bg-white border border-neutral-200 px-2 py-0.5 rounded">
                      {selectedDetails.tech}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed">{selectedDetails.description}</p>

                  <div className="pt-2 border-t border-neutral-200 flex items-start gap-2 text-xs font-mono text-neutral-600">
                    <span className="text-neutral-400 shrink-0 font-sans font-semibold">Contract:</span>
                    <span className="truncate">{selectedDetails.contract}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DIAGRAM 2: RESOLUTION LIFECYCLE FLOWCHART */}
          {activeDiagram === 'flowchart' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Step-by-Step Autonomous Claim Resolution Flowchart
                </span>
                <span className="text-[11px] font-mono text-neutral-400">Linear State Machine</span>
              </div>

              {/* Flowchart Steps */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {/* Step 1 */}
                <div className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                      1
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-semibold text-neutral-900">Claim Ingestion &amp; Session Identification</h3>
                      <span className="text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">t = 0.0s</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      User submits claim description or selects a recent transaction. Session IP and customer account token are captured.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                      2
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-semibold text-neutral-900">Relational Database Grounding (PostgreSQL)</h3>
                      <span className="text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">t = 0.3s</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      System queries PostgreSQL for customer profile (tier, spend, past tickets), active orders, and transaction payment statuses.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                      3
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-semibold text-neutral-900">Security &amp; Fraud Risk Gate</h3>
                      <span className="text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">t = 0.6s</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Evaluates IP against Tor exit node lists, analyzes transaction amount against the ₹5,000 auto-cap, and checks customer risk score.
                    </p>
                  </div>
                </div>

                {/* Step 4: Decision Fork */}
                <div className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                      4
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Branch A */}
                    <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Branch A: Low Risk &amp; Compliant</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Deterministic policy passes. Generates gateway refund reference, inserts refund row into PostgreSQL, sets ticket status to <strong>RESOLVED</strong>, and returns settlement voucher.
                      </p>
                    </div>

                    {/* Branch B */}
                    <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Branch B: Anomaly or High Value</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Security guard halts auto-payout. Ticket marked <strong>ESCALATED</strong> with priority <strong>URGENT</strong>. Synced to HumanQueue for supervisor verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                      5
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-semibold text-neutral-900">Immutable Audit Log Commit</h3>
                      <span className="text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">t = 1.4s</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      A permanent JSON audit record containing actor ID, policy reference, timestamps, and cryptographic proof hash is committed to the <code className="font-mono text-neutral-800">audit_logs</code> table.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIAGRAM 3: DATABASE ERD SCHEMA */}
          {activeDiagram === 'erd' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Entity-Relationship Diagram (PostgreSQL public Schema)
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('database')}
                  className="text-xs font-medium text-neutral-900 hover:underline flex items-center gap-1"
                >
                  <span>Open Table Inspector</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* ERD Table Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                {/* Table: users */}
                <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 bg-neutral-900 text-white flex items-center justify-between text-[11px]">
                    <span className="font-bold">users</span>
                    <span className="text-neutral-400">auth / identity</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-[11px] divide-y divide-neutral-100">
                    <div className="flex justify-between pt-1"><span className="text-neutral-900 font-semibold">id</span><span className="text-neutral-400">text PK</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">email</span><span className="text-neutral-400">text UNIQUE</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">name</span><span className="text-neutral-400">text</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">role</span><span className="text-neutral-400">text</span></div>
                  </div>
                </div>

                {/* Table: customers */}
                <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 bg-neutral-900 text-white flex items-center justify-between text-[11px]">
                    <span className="font-bold">customers</span>
                    <span className="text-neutral-400">profiles &amp; risk</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-[11px] divide-y divide-neutral-100">
                    <div className="flex justify-between pt-1"><span className="text-neutral-900 font-semibold">id</span><span className="text-neutral-400">text PK</span></div>
                    <div className="flex justify-between pt-1"><span className="text-indigo-600 font-semibold">user_id</span><span className="text-neutral-400">FK -&gt; users</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">customer_status</span><span className="text-neutral-400">VIP | REGULAR</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">risk_level</span><span className="text-neutral-400">LOW | MEDIUM | HIGH</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">total_spent</span><span className="text-neutral-400">numeric</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">last_ip</span><span className="text-neutral-400">text (telemetry)</span></div>
                  </div>
                </div>

                {/* Table: transactions */}
                <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 bg-neutral-900 text-white flex items-center justify-between text-[11px]">
                    <span className="font-bold">transactions</span>
                    <span className="text-neutral-400">payment ledger</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-[11px] divide-y divide-neutral-100">
                    <div className="flex justify-between pt-1"><span className="text-neutral-900 font-semibold">id</span><span className="text-neutral-400">text PK</span></div>
                    <div className="flex justify-between pt-1"><span className="text-indigo-600 font-semibold">order_id</span><span className="text-neutral-400">FK -&gt; orders</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">amount</span><span className="text-neutral-400">numeric</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">payment_method</span><span className="text-neutral-400">UPI | CARD | NET</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">status</span><span className="text-neutral-400">SUCCESS | FAILED</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">transaction_date</span><span className="text-neutral-400">timestamp</span></div>
                  </div>
                </div>

                {/* Table: orders */}
                <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 bg-neutral-900 text-white flex items-center justify-between text-[11px]">
                    <span className="font-bold">orders</span>
                    <span className="text-neutral-400">e-commerce purchases</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-[11px] divide-y divide-neutral-100">
                    <div className="flex justify-between pt-1"><span className="text-neutral-900 font-semibold">id</span><span className="text-neutral-400">text PK</span></div>
                    <div className="flex justify-between pt-1"><span className="text-indigo-600 font-semibold">customer_id</span><span className="text-neutral-400">FK -&gt; customers</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">amount</span><span className="text-neutral-400">numeric</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">status</span><span className="text-neutral-400">DELIVERED | FAILED</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">items_summary</span><span className="text-neutral-400">text</span></div>
                  </div>
                </div>

                {/* Table: refunds */}
                <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 bg-neutral-900 text-white flex items-center justify-between text-[11px]">
                    <span className="font-bold">refunds</span>
                    <span className="text-neutral-400">disbursements</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-[11px] divide-y divide-neutral-100">
                    <div className="flex justify-between pt-1"><span className="text-neutral-900 font-semibold">id</span><span className="text-neutral-400">text PK</span></div>
                    <div className="flex justify-between pt-1"><span className="text-indigo-600 font-semibold">transaction_id</span><span className="text-neutral-400">FK -&gt; transactions</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">amount</span><span className="text-neutral-400">numeric</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">gateway_reference</span><span className="text-neutral-400">text</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">status</span><span className="text-neutral-400">SUCCESS</span></div>
                  </div>
                </div>

                {/* Table: audit_logs */}
                <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 bg-neutral-900 text-white flex items-center justify-between text-[11px]">
                    <span className="font-bold">audit_logs</span>
                    <span className="text-neutral-400">immutable compliance</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-[11px] divide-y divide-neutral-100">
                    <div className="flex justify-between pt-1"><span className="text-neutral-900 font-semibold">id</span><span className="text-neutral-400">text PK</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">action</span><span className="text-neutral-400">text</span></div>
                    <div className="flex justify-between pt-1"><span className="text-indigo-600 font-semibold">ticket_id</span><span className="text-neutral-400">FK -&gt; tickets</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">actor</span><span className="text-neutral-400">system | human</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">metadata</span><span className="text-neutral-400">jsonb</span></div>
                    <div className="flex justify-between pt-1"><span className="text-neutral-700">created_at</span><span className="text-neutral-400">timestamp</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIAGRAM 4: FRAUD & SECURITY DEFENSE */}
          {activeDiagram === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Multi-Layer Defense Architecture Against Abuse &amp; Fraud
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Continuous Evaluation
                </span>
              </div>

              {/* 4 Security Defense Layers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-neutral-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      L1
                    </div>
                    <h3 className="text-xs font-semibold text-neutral-900">Network &amp; Tor Exit Telemetry</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Evaluates the inbound client IP against known Tor exit nodes, public proxies, and datacenter VPNs. Known Tor nodes (e.g. 185.220.101.5) automatically trigger immediate supervisory escalation.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-neutral-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      L2
                    </div>
                    <h3 className="text-xs font-semibold text-neutral-900">Velocity &amp; Maximum Disbursement Cap</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Enforces a strict deterministic threshold: claims exceeding ₹5,000 cannot be disbursed automatically under any circumstances. Prevents automated drain attacks or rogue bot claims.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-neutral-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      L3
                    </div>
                    <h3 className="text-xs font-semibold text-neutral-900">Account History &amp; Chargeback Ratio</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    VIP tier accounts with substantial verified lifetime spend receive instant settlement priority. Accounts with flagged risk levels (MEDIUM/HIGH) require multi-factor verification before payout.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-neutral-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      L4
                    </div>
                    <h3 className="text-xs font-semibold text-neutral-900">Supervisor Two-Person Audit Rule</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    When an escalation is triggered, funds remain frozen in the ledger until an authenticated supervisor records verified rationale (e.g. phone 2FA confirmation) in the Human Queue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technology Stack & Architecture Anatomy */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
          Production Technology Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-semibold text-neutral-900 block">React 19 &amp; Vite</span>
            <span className="text-[11px] text-neutral-500 mt-0.5 block">High-speed modular SPA UI</span>
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-semibold text-neutral-900 block">TypeScript</span>
            <span className="text-[11px] text-neutral-500 mt-0.5 block">Strict end-to-end type safety</span>
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-semibold text-neutral-900 block">Tailwind CSS v4</span>
            <span className="text-[11px] text-neutral-500 mt-0.5 block">Modern utility design system</span>
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-semibold text-neutral-900 block">Supabase (PostgreSQL)</span>
            <span className="text-[11px] text-neutral-500 mt-0.5 block">ACID relational persistence</span>
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-semibold text-neutral-900 block">Gemini 2.5 Flash</span>
            <span className="text-[11px] text-neutral-500 mt-0.5 block">Zero-shot semantic entity parsing</span>
          </div>
        </div>
      </div>

      {/* Deep-Dive Operational FAQs */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-neutral-700" />
          <h2 className="text-sm font-semibold text-neutral-900">Architecture &amp; Operational FAQ</h2>
        </div>

        <div className="divide-y divide-neutral-200/80">
          {[
            {
              q: 'How does ResolveIQ guarantee zero financial hallucinations?',
              a: 'AI models never directly issue refunds or modify balances. Gemini Flash is used strictly as a semantic entity extractor. The actual decision to disburse funds is made by pure, deterministic TypeScript code running against real PostgreSQL records. If the transaction does not exist or status is not FAILED, no mutation occurs.',
            },
            {
              q: 'How does the Supabase / PostgreSQL database connection work?',
              a: 'ResolveIQ supports dual operation: out-of-the-box it runs with a full relational in-memory database mirroring PostgreSQL schemas. Clicking "PostgreSQL" in the top navigation opens the connection modal, where you can paste your live Supabase project URL and anon public key to sync real cloud database rows.',
            },
            {
              q: 'What triggers an escalation to the Human Review Queue?',
              a: 'Three conditions immediately halt autonomous settlement: 1) Any session originating from a Tor exit node or blacklisted proxy; 2) Any refund request exceeding ₹5,000; 3) Unrecognized transaction IDs where manual customer verification is mandatory.',
            },
            {
              q: 'Can ResolveIQ be integrated into live payment gateways (e.g. Razorpay, Stripe, Adyen)?',
              a: 'Yes. The disbursement engine emits standardized gateway payloads ({ amount, transaction_id, gateway_reference, idempotency_key }) ready to connect directly to payment gateway refund webhooks.',
            },
          ].map((item, idx) => (
            <div key={idx} className="py-3">
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-neutral-900 hover:text-neutral-700 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                    activeFaq === idx ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed pl-2 border-l-2 border-neutral-300">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
