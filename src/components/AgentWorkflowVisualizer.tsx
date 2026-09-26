/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Cpu,
  Sparkles,
  Database,
  ShieldCheck,
  Scale,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Info,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';

export type AgentStage =
  | 'idle'
  | 'request'
  | 'orchestrator'
  | 'intent'
  | 'specialized'
  | 'settlement'
  | 'escalation';

interface AgentWorkflowVisualizerProps {
  currentStage?: AgentStage;
  isProcessing?: boolean;
  isEscalated?: boolean;
  className?: string;
}

export function AgentWorkflowVisualizer({
  currentStage = 'idle',
  isProcessing = false,
  isEscalated = false,
  className = '',
}: AgentWorkflowVisualizerProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Agent inspection definitions
  const agentDetails: Record<
    string,
    { title: string; role: string; latency: string; model: string; guarantee: string }
  > = {
    request: {
      title: 'Customer Claim Ingestion',
      role: 'Parses raw user dispute messages, sanitizes inputs, and binds session context.',
      latency: '12ms',
      model: 'Frontline Gateway Proxy',
      guarantee: 'Rate-limited & authenticated session',
    },
    orchestrator: {
      title: 'Workflow Orchestrator',
      role: 'Evaluates customer status, routes inquiry to downstream agents, and tracks SLA timeout.',
      latency: '24ms',
      model: 'Deterministic State Machine',
      guarantee: 'ACID transaction boundary protection',
    },
    intent: {
      title: 'Cognitive Intent Agent',
      role: 'Extracts entities (order ID, amount, payment method) and classifies dispute intent.',
      latency: '310ms',
      model: 'Google Gemini 2.5 Flash',
      guarantee: 'Zero hallucinated payouts (Read-only reasoning)',
    },
    transaction: {
      title: 'Transaction & Ledger Agent',
      role: 'Executes indexed queries against PostgreSQL transactions & orders tables in Supabase.',
      latency: '18ms',
      model: 'PostgreSQL Relational Engine',
      guarantee: 'Foreign key integrity & lock-free reads',
    },
    security: {
      title: 'Security & Risk Agent',
      role: 'Audits origin IP against Tor exit nodes, velocity counters, and device fingerprints.',
      latency: '15ms',
      model: 'Deterministic Rule Guard',
      guarantee: 'Automatic halt on Tor or high-risk origin',
    },
    policy: {
      title: 'Policy Guard Agent',
      role: 'Evaluates refund rules: ₹5,000 instant cap, 2-day delivery window, and duplicate claims.',
      latency: '8ms',
      model: 'Rule Constraint Engine',
      guarantee: 'Zero-discretion financial compliance',
    },
    settlement: {
      title: 'Autonomous Settlement Node',
      role: 'Writes refund record to PostgreSQL and dispatches instant reversal to UPI/Card gateway.',
      latency: '140ms',
      model: 'Payment Gateway Switch',
      guarantee: 'Idempotency key prevents double refund',
    },
    escalation: {
      title: 'Human Handoff Queue',
      role: 'Freezes automated payout and dispatches incident to Tier-2 supervisor for manual sign-off.',
      latency: 'Instant',
      model: 'Supervisor Review Docket',
      guarantee: 'Strict 4-eyes principle on exceptions',
    },
  };

  const getStatusClass = (nodeStage: AgentStage) => {
    if (isProcessing && currentStage === nodeStage) {
      return 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10 animate-pulse';
    }
    if (currentStage === 'settlement' || currentStage === 'escalation') {
      return 'border-neutral-300 bg-white';
    }
    return 'border-neutral-200 bg-white hover:border-neutral-300';
  };

  return (
    <div className={`bg-white rounded-xl border border-neutral-200/90 p-5 shadow-2xs space-y-5 ${className}`}>
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-neutral-100 gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-neutral-800" />
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Autonomous Multi-Agent Pipeline
          </h3>
          <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
            Enterprise Architecture
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isProcessing ? 'bg-amber-500 animate-ping' : 'bg-emerald-600'
              }`}
            />
            <span>{isProcessing ? 'Pipeline Active' : 'Pipeline Ready'}</span>
          </span>
          <span>·</span>
          <span>Latency: ~515ms</span>
        </div>
      </div>

      {/* Main Workflow Pipeline Layout */}
      <div className="space-y-4">
        {/* Tier 1: Customer Request & Orchestrator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Step 1: Customer Request */}
          <div
            onClick={() => setSelectedAgent('request')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${getStatusClass(
              'request'
            )}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-neutral-900">01. Customer Request</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">12ms</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
              Inquiry ingestion &amp; session security validation.
            </p>
          </div>

          {/* Step 2: Orchestrator */}
          <div
            onClick={() => setSelectedAgent('orchestrator')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${getStatusClass(
              'orchestrator'
            )}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-neutral-900">02. Orchestrator</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">24ms</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
              Context router &amp; ACID transaction guard.
            </p>
          </div>
        </div>

        {/* Downward Connector Line */}
        <div className="flex justify-center -my-1">
          <div className="w-px h-4 bg-neutral-200" />
        </div>

        {/* Tier 2: Cognitive Intent Agent */}
        <div
          onClick={() => setSelectedAgent('intent')}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${getStatusClass(
            'intent'
          )}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-900">
                  03. Cognitive Intent Agent
                </span>
                <span className="ml-2 text-[10px] font-mono text-neutral-400">Gemini 2.5 Flash</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">310ms</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
            Extracts claimed order references, financial amounts, and classifies issue intent with zero payout hallucination.
          </p>
        </div>

        {/* Downward Connector Line */}
        <div className="flex justify-center -my-1">
          <div className="w-px h-4 bg-neutral-200" />
        </div>

        {/* Tier 3: Specialized Parallel Guards (Transaction, Security, Policy) */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 text-center mb-1.5">
            Parallel Verification &amp; Security Isolation Tier
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Sub-agent A: Transaction */}
            <div
              onClick={() => setSelectedAgent('transaction')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${getStatusClass(
                'specialized'
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-xs font-semibold text-neutral-900">Ledger Agent</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">18ms</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">PostgreSQL query verification</p>
            </div>

            {/* Sub-agent B: Security */}
            <div
              onClick={() => setSelectedAgent('security')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${getStatusClass(
                'specialized'
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-xs font-semibold text-neutral-900">Security Agent</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">15ms</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Tor node &amp; velocity check</p>
            </div>

            {/* Sub-agent C: Policy */}
            <div
              onClick={() => setSelectedAgent('policy')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${getStatusClass(
                'specialized'
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-xs font-semibold text-neutral-900">Policy Guard</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">8ms</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">₹5,000 cap &amp; SLA check</p>
            </div>
          </div>
        </div>

        {/* Downward Connector Line */}
        <div className="flex justify-center -my-1">
          <div className="w-px h-4 bg-neutral-200" />
        </div>

        {/* Tier 4: Dual Outcomes (Resolution vs. Human Handoff) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Path A: Autonomous Settlement */}
          <div
            onClick={() => setSelectedAgent('settlement')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              !isEscalated
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-white border-neutral-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950">
                    Path A · Autonomous Settlement
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-mono">
                    Instant Reversal (&lt; 2.0s)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 font-semibold">PASS</span>
            </div>
          </div>

          {/* Path B: Human Handoff */}
          <div
            onClick={() => setSelectedAgent('escalation')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              isEscalated
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-white border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-950">
                    Path B · Human Handoff
                  </span>
                  <span className="block text-[10px] text-amber-700 font-mono">
                    Tier-2 Supervisor Review
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-800 font-semibold">
                EXCEPTION
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Agent Telemetry Drawer */}
      {selectedAgent && agentDetails[selectedAgent] && (
        <div className="p-4 bg-neutral-900 text-white rounded-lg text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-red-400" />
              <span className="font-bold text-neutral-100">
                {agentDetails[selectedAgent].title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedAgent(null)}
              className="text-neutral-400 hover:text-white text-[11px]"
            >
              Close
            </button>
          </div>
          <p className="text-neutral-300 text-[11px] leading-relaxed">
            {agentDetails[selectedAgent].role}
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px] text-neutral-400">
            <div>
              <span className="text-neutral-500 block">EXECUTION LATENCY</span>
              <span className="text-white">{agentDetails[selectedAgent].latency}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">UNDERLYING ENGINE</span>
              <span className="text-white">{agentDetails[selectedAgent].model}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">SECURITY GUARANTEE</span>
              <span className="text-emerald-400">{agentDetails[selectedAgent].guarantee}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
