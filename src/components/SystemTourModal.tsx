/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Compass,
  Bot,
  Brain,
  ShieldAlert,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  GitBranch,
  Play,
  RotateCcw,
  Terminal,
  Activity,
  Layers,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Logo } from './Logo';

interface SystemTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'cases' | 'customers' | 'reports' | 'knowledge' | 'settings') => void;
}

export function SystemTourModal({ isOpen, onClose, onNavigateTab }: SystemTourModalProps) {
  const { isMidnight } = useTheme();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeSimulationScenario, setActiveSimulationScenario] = useState<'legit' | 'high_value' | 'fraud'>('legit');
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'mission',
      title: '01 · Platform Mission & Core Problem',
      tag: 'Executive Overview',
      subtitle: 'Transforming 72-Hour E-Commerce Disputes into Sub-2-Second Deterministic Settlements',
    },
    {
      id: 'agents',
      title: '02 · Multi-Agent AI Pipeline',
      tag: 'Autonomous Architecture',
      subtitle: 'Five specialized synchronous agents orchestrating verification with zero financial hallucination',
    },
    {
      id: 'dual_outcomes',
      title: '03 · Dual Outcome Routing',
      tag: 'Safety Circuit Breakers',
      subtitle: 'Instant autonomous payout vs mathematical supervisor escalation',
    },
    {
      id: 'sandbox',
      title: '04 · Live Agent Simulation Sandbox',
      tag: 'Interactive Verification',
      subtitle: 'Test how the multi-agent mesh handles legitimate claims, SLA timeouts, and Tor fraud attacks',
    },
    {
      id: 'acid_ledger',
      title: '05 · ACID Ledger & Relational Security',
      tag: 'PostgreSQL Architecture',
      subtitle: 'Immutable audit logs, Row-Level Security, and payment gateway idempotency',
    },
    {
      id: 'navigation',
      title: '06 · Quick Navigation & Live Workspaces',
      tag: 'Console Workflows',
      subtitle: 'Direct links to explore the production workbench, human escalation queue, and database',
    },
  ];

  // Simulation runner
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    setSimLogs(['[00:00:00.012] Ingestion Agent: Received customer ticket context. Sanitizing input...']);

    setTimeout(() => {
      setSimStep(2);
      setSimLogs((prev) => [
        ...prev,
        '[00:00:00.036] Orchestrator: State machine initialized. Transaction isolation lock acquired.',
      ]);
    }, 600);

    setTimeout(() => {
      setSimStep(3);
      if (activeSimulationScenario === 'legit') {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.340] Cognitive Intent Agent (Gemini 2.5): Extracted TXN-881290, claim: "Item Damaged In Transit", requested: ₹1,850.',
        ]);
      } else if (activeSimulationScenario === 'high_value') {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.320] Cognitive Intent Agent (Gemini 2.5): Extracted TXN-994101, claim: "Laptop Screen Cracked", requested: ₹38,999.',
        ]);
      } else {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.290] Cognitive Intent Agent (Gemini 2.5): Extracted TXN-100244, claim: "Unauthorized Duplicate Charge", requested: ₹4,200.',
        ]);
      }
    }, 1200);

    setTimeout(() => {
      setSimStep(4);
      if (activeSimulationScenario === 'legit') {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.380] Risk & Security Guard: IP clean (Geo: Mumbai), device trust: 98%, velocity: 0 recent disputes.',
          '[00:00:00.410] Policy Guard: Amount ₹1,850 <= ₹5,000 auto-cap. SLA within 7 days. PASSED.',
        ]);
      } else if (activeSimulationScenario === 'high_value') {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.370] Risk & Security Guard: IP clean, VIP Customer Account.',
          '[00:00:00.400] Policy Guard: Amount ₹38,999 EXCEEDS ₹5,000 threshold. HARD CEILING TRIGGERED.',
        ]);
      } else {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.360] Risk & Security Guard: ALERT - Request originated from Tor Exit Node (185.220.101.5). High risk score (88/100).',
          '[00:00:00.390] Policy Guard: FRAUD FLAG RAISED. Immediate financial lockout.',
        ]);
      }
    }, 1900);

    setTimeout(() => {
      setSimStep(5);
      setIsSimulating(false);
      if (activeSimulationScenario === 'legit') {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.480] Decision: RESOLVED_AUTONOMOUSLY via UPI Switch webhook. Ledger state committed.',
        ]);
      } else if (activeSimulationScenario === 'high_value') {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.460] Decision: ESCALATED_TO_HUMAN. Dispatched to Tier-2 supervisor for manual sign-off.',
        ]);
      } else {
        setSimLogs((prev) => [
          ...prev,
          '[00:00:00.450] Decision: ESCALATED_TO_HUMAN & BLOCKED. Session terminated; fraud team notified.',
        ]);
      }
    }, 2600);
  };

  const handleResetSimulation = () => {
    setSimStep(0);
    setIsSimulating(false);
    setSimLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl rounded-2xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden transition-all ${
          isMidnight
            ? 'bg-[#090b10] border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isMidnight ? 'border-neutral-800 bg-[#0d111a]' : 'border-neutral-200 bg-neutral-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-600 border border-red-600/20 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">ResolveIQ System Guide & Architecture Tour</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/10 text-red-600 border border-red-600/20 font-semibold">
                  INTERACTIVE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Complete architectural documentation & live multi-agent verification engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isMidnight
                  ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div
          className={`px-6 py-3 border-b flex items-center justify-between gap-2 overflow-x-auto shrink-0 ${
            isMidnight ? 'border-neutral-800 bg-[#090b10]' : 'border-neutral-200 bg-white'
          }`}
        >
          {steps.map((s, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? isMidnight
                      ? 'bg-neutral-800 text-white font-semibold ring-1 ring-neutral-700'
                      : 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : isCompleted
                    ? 'text-neutral-400 hover:text-neutral-200'
                    : 'text-neutral-500 hover:text-neutral-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : isCompleted
                      ? 'bg-neutral-700 text-neutral-200'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <span>{s.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Dynamic Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Step Header */}
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-xs font-mono font-semibold text-red-600 uppercase tracking-wider">
                {steps[currentStep].tag}
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5">{steps[currentStep].title}</h2>
              <p className="text-xs text-neutral-400 mt-1">{steps[currentStep].subtitle}</p>
            </div>
            <div className="text-xs font-mono text-neutral-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* STEP 1: Executive Mission & Problem Statement */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div
                className={`p-5 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>The Legacy Support Crisis</span>
                  </div>
                  <h3 className="text-base font-bold">72-Hour Dispute Latency & Burnout</h3>
                  <p className="text-xs leading-relaxed text-neutral-400">
                    Traditional e-commerce platforms suffer from disjointed customer support tickets. Tier-1 reps manually
                    cross-reference transaction IDs across banking gateways, warehouse ERPs, and courier tracking portals,
                    leading to frustrated buyers and high churn.
                  </p>
                  <ul className="text-xs space-y-1.5 text-neutral-400 pt-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>Average 48-72 hour turnaround per refund claim.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>Support reps making inconsistent discretionary payout decisions.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>Vulnerability to duplicate claims, Tor proxies, and serial friendly fraud.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>The ResolveIQ Solution</span>
                  </div>
                  <h3 className="text-base font-bold">Sub-2-Second Autonomous Resolution</h3>
                  <p className="text-xs leading-relaxed text-neutral-400">
                    ResolveIQ couples Google Gemini 2.5 Flash cognitive parsing with deterministic security policies and
                    PostgreSQL ACID ledger transactions to execute mathematically safe instant refunds while flagging high-risk
                    anomalies for human review.
                  </p>
                  <ul className="text-xs space-y-1.5 text-neutral-400 pt-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Instant UPI / Gateway disbursement in &lt; 2.0s.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Hard mathematical ₹5,000 autonomous payout limit (Zero LLM hallucination).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Automated human supervisor handoff with synthesized evidence dossier.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Performance Metrics Trio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-xl border text-center ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="text-2xl font-mono font-bold text-emerald-500">&lt; 1.84s</div>
                  <div className="text-xs font-semibold mt-1">Average Settlement Time</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">End-to-end webhook roundtrip</div>
                </div>
                <div
                  className={`p-4 rounded-xl border text-center ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="text-2xl font-mono font-bold text-red-500">100%</div>
                  <div className="text-xs font-semibold mt-1">Deterministic Financial Guard</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">LLMs never touch the payout ledger</div>
                </div>
                <div
                  className={`p-4 rounded-xl border text-center ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="text-2xl font-mono font-bold text-blue-500">94.8%</div>
                  <div className="text-xs font-semibold mt-1">Autonomous Resolution Rate</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Legitimate low-risk claims</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Multi-Agent AI Pipeline Anatomy */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <p className="text-xs text-neutral-400 leading-relaxed">
                Rather than relying on a single monolithic prompt, ResolveIQ isolates responsibilities across five distinct
                agents. Financial decisions are strictly gated so LLM non-determinism cannot result in unauthorized fund
                disbursements.
              </p>

              {/* Agent Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Agent 1 */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-mono text-xs font-bold">
                        01
                      </div>
                      <span className="text-xs font-bold">Customer Ingestion & Sanitizer</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                      ~12ms
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Validates customer auth tokens, extracts session IP addresses, normalizes inputs, and checks for prompt
                    injection or malicious script tags.
                  </p>
                </div>

                {/* Agent 2 */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-mono text-xs font-bold">
                        02
                      </div>
                      <span className="text-xs font-bold">Orchestrator & State Machine</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                      ~24ms
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Maintains the dispute state machine (<code className="text-red-400">OPEN</code> &rarr;{' '}
                    <code className="text-amber-400">ANALYZING</code> &rarr;{' '}
                    <code className="text-emerald-400">RESOLVED</code>), coordinates parallel agent calls, and manages transaction rollback locks.
                  </p>
                </div>

                {/* Agent 3 */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-mono text-xs font-bold">
                        03
                      </div>
                      <span className="text-xs font-bold">Cognitive Intent Agent (Gemini 2.5)</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                      ~310ms
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Parses customer messages with zero hallucination. Extracts normalized entity parameters: Transaction ID,
                    dispute reason category, courier delivery tracking status, and requested currency amounts.
                  </p>
                </div>

                {/* Agent 4 */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-xs font-bold">
                        04
                      </div>
                      <span className="text-xs font-bold">Transaction & ACID Ledger Agent</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                      ~18ms
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Executes foreign key cross-checks against the live PostgreSQL database. Verifies customer account age,
                    order status, prior refunds, and gateway transaction hashes.
                  </p>
                </div>

                {/* Agent 5 */}
                <div
                  className={`p-4 rounded-xl border space-y-2 md:col-span-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono text-xs font-bold">
                        05
                      </div>
                      <span className="text-xs font-bold">Deterministic Policy & Security Guard</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                      ~8ms
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    The unbreachable firewall: Checks for Tor exit node IPs, device fingerprint mismatches, refund velocity
                    (&gt;3 disputes in 30 days), and strictly enforces the ₹5,000 maximum autonomous settlement cap.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Dual Outcome Routing */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Outcome A */}
                <div
                  className={`p-6 rounded-xl border space-y-4 ${
                    isMidnight
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Pathway A · Autonomous Settlement</h3>
                      <span className="text-[11px] opacity-80">Instant payout via UPI / Card Gateway</span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed opacity-90">
                    When all deterministic policies pass, the system automatically instructs the payment gateway to disburse
                    funds. The transaction ledger and customer ticket are updated atomically in the same database transaction.
                  </p>

                  <div className="p-3 rounded-lg bg-black/20 text-xs font-mono space-y-1">
                    <div>&gt; Criteria: Amount &le; ₹5,000</div>
                    <div>&gt; Risk Score: &lt; 30 (Clean IP, Valid Courier SLA)</div>
                    <div>&gt; Action: Immediate refund credit &amp; SMS confirmation</div>
                  </div>
                </div>

                {/* Outcome B */}
                <div
                  className={`p-6 rounded-xl border space-y-4 ${
                    isMidnight
                      ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Pathway B · Human Escalation Queue</h3>
                      <span className="text-[11px] opacity-80">Circuit breaker triggered; funds locked</span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed opacity-90">
                    If an anomaly is detected (high claim amount, Tor exit node, courier status discrepancy), autonomous
                    disbursement halts immediately. An evidence dossier is dispatched to a Tier-2 supervisor.
                  </p>

                  <div className="p-3 rounded-lg bg-black/20 text-xs font-mono space-y-1">
                    <div>&gt; Criteria: Amount &gt; ₹5,000 OR Risk &ge; 30</div>
                    <div>&gt; Flag: Tor Proxy / High Velocity / Unverified Claim</div>
                    <div>&gt; Action: Route to Human Review Queue with prefilled dossier</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Live Agent Simulation Sandbox */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div
                className={`p-5 rounded-xl border space-y-4 ${
                  isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold">Interactive Sandbox Scenario Picker</h3>
                    <p className="text-xs text-neutral-400">Select a real-world edge case and simulate the multi-agent mesh</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSimulating ? 'Executing...' : 'Run Simulation'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetSimulation}
                      disabled={isSimulating}
                      className="p-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      title="Reset simulation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scenario Toggle Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSimulationScenario('legit');
                      handleResetSimulation();
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      activeSimulationScenario === 'legit'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'border-neutral-800 hover:bg-neutral-800/40 text-neutral-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>1. Legitimate Claim</span>
                      <span className="text-[10px] font-mono text-emerald-400">₹1,850</span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-1">Damaged in transit; passes &le; ₹5,000 threshold</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSimulationScenario('high_value');
                      handleResetSimulation();
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      activeSimulationScenario === 'high_value'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-semibold'
                        : 'border-neutral-800 hover:bg-neutral-800/40 text-neutral-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>2. High-Value Claim</span>
                      <span className="text-[10px] font-mono text-amber-400">₹38,999</span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-1">Exceeds ₹5,000 limit; triggers human sign-off</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSimulationScenario('fraud');
                      handleResetSimulation();
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      activeSimulationScenario === 'fraud'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-semibold'
                        : 'border-neutral-800 hover:bg-neutral-800/40 text-neutral-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>3. Tor Fraud Attack</span>
                      <span className="text-[10px] font-mono text-rose-400">Proxy/Tor</span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-1">Tor exit node detected; payout locked</div>
                  </button>
                </div>

                {/* Animated Node Strip */}
                <div className="pt-2">
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div
                      className={`p-2.5 rounded-lg border transition-all ${
                        simStep >= 1
                          ? 'border-blue-500 bg-blue-500/15 text-blue-400 font-bold'
                          : 'border-neutral-800 opacity-40'
                      }`}
                    >
                      <div className="text-[10px] font-mono">01 · Ingestion</div>
                      <div className="text-xs font-semibold mt-0.5">Input Sanitize</div>
                    </div>
                    <div
                      className={`p-2.5 rounded-lg border transition-all ${
                        simStep >= 2
                          ? 'border-purple-500 bg-purple-500/15 text-purple-400 font-bold'
                          : 'border-neutral-800 opacity-40'
                      }`}
                    >
                      <div className="text-[10px] font-mono">02 · Orchestrator</div>
                      <div className="text-xs font-semibold mt-0.5">Lock &amp; State</div>
                    </div>
                    <div
                      className={`p-2.5 rounded-lg border transition-all ${
                        simStep >= 3
                          ? 'border-red-500 bg-red-500/15 text-red-400 font-bold'
                          : 'border-neutral-800 opacity-40'
                      }`}
                    >
                      <div className="text-[10px] font-mono">03 · Gemini Intent</div>
                      <div className="text-xs font-semibold mt-0.5">Extract Entity</div>
                    </div>
                    <div
                      className={`p-2.5 rounded-lg border transition-all ${
                        simStep >= 4
                          ? 'border-amber-500 bg-amber-500/15 text-amber-400 font-bold'
                          : 'border-neutral-800 opacity-40'
                      }`}
                    >
                      <div className="text-[10px] font-mono">04 · Policy Guard</div>
                      <div className="text-xs font-semibold mt-0.5">Check Limit/IP</div>
                    </div>
                    <div
                      className={`p-2.5 rounded-lg border transition-all ${
                        simStep >= 5
                          ? activeSimulationScenario === 'legit'
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                            : 'border-amber-500 bg-amber-500/15 text-amber-400 font-bold'
                          : 'border-neutral-800 opacity-40'
                      }`}
                    >
                      <div className="text-[10px] font-mono">05 · Outcome</div>
                      <div className="text-xs font-semibold mt-0.5">
                        {activeSimulationScenario === 'legit' ? 'UPI Settlement' : 'Human Escalate'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulation Terminal Output */}
                <div className="rounded-xl bg-black border border-neutral-800 p-4 font-mono text-xs text-neutral-300 space-y-1.5 min-h-[140px]">
                  <div className="flex items-center justify-between text-neutral-500 border-b border-neutral-900 pb-2 mb-2 text-[10px]">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-red-500" />
                      <span>ResolveIQ Engine Live Telemetry Stream</span>
                    </span>
                    <span>{simLogs.length} events logged</span>
                  </div>
                  {simLogs.length === 0 ? (
                    <div className="text-neutral-600 italic py-4 text-center">
                      Click &quot;Run Simulation&quot; above to watch the agent network execute live.
                    </div>
                  ) : (
                    simLogs.map((log, i) => (
                      <div key={i} className="leading-relaxed animate-in fade-in duration-100">
                        {log.includes('PASSED') || log.includes('RESOLVED') ? (
                          <span className="text-emerald-400 font-semibold">{log}</span>
                        ) : log.includes('ALERT') || log.includes('EXCEEDS') || log.includes('ESCALATED') ? (
                          <span className="text-amber-400 font-semibold">{log}</span>
                        ) : (
                          <span>{log}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ACID Ledger & Relational Security */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <p className="text-xs text-neutral-400 leading-relaxed">
                ResolveIQ is engineered on PostgreSQL to deliver strict ACID guarantees. Every financial settlement is an
                atomic mutation across orders, tickets, and permanent immutable audit trails.
              </p>

              {/* Database Schema Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold font-mono">tickets</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Dispute ID, customer FK, current status, urgency priority, and assigned cognitive agent.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold font-mono">transactions</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Banking gateway transaction hashes, refund status, currency amount, and payment method.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold font-mono">audit_logs</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Append-only ledger recording every agent action, safety rule evaluation, and human supervisor approval.
                  </p>
                </div>
              </div>

              {/* RLS Security Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isMidnight ? 'bg-[#0d111a] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <Lock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold">Row-Level Security &amp; Isolation</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Customer data is strictly isolated via PostgreSQL Row-Level Security (RLS). Support representatives only
                    view tickets assigned to their workspace queue, and API credentials are kept in server-side proxies.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Quick Navigation & Live Workspaces */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <p className="text-xs text-neutral-400 leading-relaxed">
                You are ready to explore the live ResolveIQ production console. Select any workspace below to navigate
                directly:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTab?.('cases');
                  }}
                  className={`p-5 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    isMidnight
                      ? 'bg-[#0d111a] border-neutral-800 hover:border-neutral-700'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h4 className="text-sm font-bold">Dispute Resolution Workbench</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Inspect active dispute claims, view the live agent workflow visualizer, and trigger settlements.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTab?.('reports');
                  }}
                  className={`p-5 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    isMidnight
                      ? 'bg-[#0d111a] border-neutral-800 hover:border-neutral-700'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2">
                    <UserCheck className="w-5 h-5 text-amber-500" />
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h4 className="text-sm font-bold">Human Escalation Queue</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Review flagged high-value or proxy claims requiring supervisor review and manual sign-off.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTab?.('settings');
                  }}
                  className={`p-5 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    isMidnight
                      ? 'bg-[#0d111a] border-neutral-800 hover:border-neutral-700'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h4 className="text-sm font-bold">PostgreSQL Database Explorer</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Execute live SQL queries, inspect table structures, and verify foreign key constraints.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between shrink-0 ${
            isMidnight ? 'border-neutral-800 bg-[#0d111a]' : 'border-neutral-200 bg-neutral-50/80'
          }`}
        >
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              isMidnight
                ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === idx
                    ? 'w-6 bg-red-600'
                    : isMidnight
                    ? 'bg-neutral-700 hover:bg-neutral-600'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 text-white transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <span>Close Tour</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
