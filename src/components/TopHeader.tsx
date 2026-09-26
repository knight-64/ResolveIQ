/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, RefreshCw, Database, SlidersHorizontal, User, CheckCircle2, ShieldAlert, X, Compass } from 'lucide-react';
import { SupabaseConfig } from '../supabase';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface TopHeaderProps {
  currentTabName: string;
  supabaseConfig: SupabaseConfig;
  onOpenSupabaseModal: () => void;
  onResetDatabase: () => void;
  onOpenSystemTour: () => void;
}

export function TopHeader({
  currentTabName,
  supabaseConfig,
  onOpenSupabaseModal,
  onResetDatabase,
  onOpenSystemTour,
}: TopHeaderProps) {
  const { isMidnight } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Tor Exit Node Detected',
      desc: 'Security guard halted payout on CUST-1002. Escalated to Tier-2 supervisor.',
      time: '12m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Autonomous Refund Settled',
      desc: '₹2,000 dispatched via UPI for Order ORD-8812. PostgreSQL ledger updated.',
      time: '28m ago',
      type: 'success',
    },
    {
      id: 3,
      title: 'PostgreSQL ACID Schema Ready',
      desc: 'Foreign key constraints and audit tables verified with Supabase.',
      time: '1h ago',
      type: 'info',
    },
  ];

  return (
    <header className="h-16 border-b border-red-950/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 bg-black text-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <span className="font-bold capitalize text-white tracking-wide">
          {currentTabName}
        </span>
      </div>

      {/* Right Header Utilities */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher Toggle */}
        <ThemeToggle variant="compact" />

        {/* System Guide & Tour Button */}
        <button
          type="button"
          onClick={onOpenSystemTour}
          title="Open interactive System Guide & Multi-Agent Architecture Tour"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-red-800/80 bg-red-950/40 hover:bg-red-900/60 text-white transition-all shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:scale-102"
        >
          <Compass className="w-3.5 h-3.5 text-red-500 animate-spin-slow" />
          <span className="font-semibold hidden sm:inline text-white">System Guide</span>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-red-600 text-white font-bold">
            TOUR
          </span>
        </button>

        {/* Database Connection Indicator Pill */}
        <button
          type="button"
          onClick={onOpenSupabaseModal}
          title="Configure PostgreSQL credentials"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border border-red-950/80 bg-neutral-950 hover:border-red-600 text-white transition-colors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              supabaseConfig.isConnected ? 'bg-red-500 ring-4 ring-red-500/20' : 'bg-neutral-600'
            }`}
          />
          <span className="font-mono text-[11px] text-red-400 hidden sm:inline">PostgreSQL:</span>
          <span className="font-medium text-white">
            {supabaseConfig.isConnected ? 'Supabase Live' : 'Demo DB'}
          </span>
          <SlidersHorizontal className="w-3 h-3 text-red-400" />
        </button>

        {/* Reset Seed Button */}
        <button
          type="button"
          onClick={onResetDatabase}
          title="Reset database seed records"
          className="p-1.5 rounded-lg border border-red-950/80 bg-neutral-950 text-red-400 hover:text-white hover:border-red-600 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-red-950" />

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-full transition-colors text-red-400 hover:text-white hover:bg-red-950/40"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1.5 right-1.5 ring-2 ring-black" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border border-red-900/60 overflow-hidden z-50 bg-black text-white animate-in fade-in slide-in-from-top-2 duration-150">
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${
                  isMidnight ? 'border-neutral-800 bg-[#090b10]' : 'border-neutral-100 bg-neutral-50/60'
                }`}
              >
                <span className="text-xs font-bold">Incident Alerts</span>
                <span className="text-[10px] font-mono text-neutral-400">Live Telemetry</span>
              </div>

              <div className="divide-y divide-red-950/50 max-h-80 overflow-y-auto bg-black">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 text-xs transition-colors hover:bg-red-950/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {n.type === 'warning' && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                        {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-red-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-neutral-300">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-red-950/80 bg-neutral-950 text-center">
                <span className="text-[11px] text-red-400 font-mono">System operating with zero unhandled incidents</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-red-500/40 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.4)]">
          A
        </div>
      </div>
    </header>
  );
}
