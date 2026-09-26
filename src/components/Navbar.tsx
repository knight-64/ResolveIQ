/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, ShieldAlert, CheckCircle2, RefreshCw, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { SupabaseConfig } from '../supabase';
import { Logo } from './Logo';

export type ActiveTab = 'resolution' | 'human' | 'database' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  supabaseConfig: SupabaseConfig;
  onOpenSupabaseModal: () => void;
  onResetDatabase: () => void;
  escalatedCount?: number;
}

export function Navbar({
  activeTab,
  onTabChange,
  supabaseConfig,
  onOpenSupabaseModal,
  onResetDatabase,
  escalatedCount = 0,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Logo size="md" showWordmark={true} />
              <span className="hidden sm:inline-block text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/80">
                Operations
              </span>
            </div>

            {/* Primary Tab Navigation — Authentic Underline Pattern */}
            <nav className="hidden md:flex items-center gap-6 h-14">
              <button
                type="button"
                onClick={() => onTabChange('resolution')}
                className={`h-full border-b-2 text-xs font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'resolution'
                    ? 'border-neutral-900 text-neutral-900 font-semibold'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
              >
                <span>Dispute Workbench</span>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('human')}
                className={`h-full border-b-2 text-xs font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'human'
                    ? 'border-neutral-900 text-neutral-900 font-semibold'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
              >
                <span>Escalations</span>
                {escalatedCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300/80 tabular-nums">
                    {escalatedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onTabChange('database')}
                className={`h-full border-b-2 text-xs font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'database'
                    ? 'border-neutral-900 text-neutral-900 font-semibold'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
              >
                <span>Ledger & Tables</span>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('about')}
                className={`h-full border-b-2 text-xs font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'about'
                    ? 'border-neutral-900 text-neutral-900 font-semibold'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
              >
                <span>About & Architecture</span>
              </button>
            </nav>
          </div>

          {/* Right Action & Environment Status */}
          <div className="flex items-center gap-3">
            {/* Database Connection Indicator Button */}
            <button
              type="button"
              onClick={onOpenSupabaseModal}
              title="Configure PostgreSQL credentials"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseConfig.isConnected ? 'bg-emerald-600 ring-4 ring-emerald-50' : 'bg-neutral-400'
                }`}
              />
              <span className="font-mono text-[11px] text-neutral-500 hidden sm:inline">PostgreSQL:</span>
              <span className="text-neutral-900 font-medium">
                {supabaseConfig.isConnected ? 'Supabase Live' : 'Demo Memory DB'}
              </span>
              <SlidersHorizontal className="w-3 h-3 text-neutral-400 ml-0.5" />
            </button>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={onResetDatabase}
              title="Reset records to default demo data"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md border border-neutral-200/90 bg-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs (under 768px) */}
        <div className="flex md:hidden items-center gap-4 py-2 border-t border-neutral-100 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => onTabChange('resolution')}
            className={`pb-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'resolution'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500'
            }`}
          >
            Dispute Workbench
          </button>
          <button
            type="button"
            onClick={() => onTabChange('human')}
            className={`pb-1 border-b-2 font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'human'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500'
            }`}
          >
            <span>Escalations</span>
            {escalatedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-900">
                {escalatedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onTabChange('database')}
            className={`pb-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500'
            }`}
          >
            Ledger & Tables
          </button>
          <button
            type="button"
            onClick={() => onTabChange('about')}
            className={`pb-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500'
            }`}
          >
            About
          </button>
        </div>
      </div>
    </header>
  );
}
