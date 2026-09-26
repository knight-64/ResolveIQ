/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, RefreshCw, Database, SlidersHorizontal, User, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { SupabaseConfig } from '../supabase';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface TopHeaderProps {
  currentTabName: string;
  supabaseConfig: SupabaseConfig;
  onOpenSupabaseModal: () => void;
  onResetDatabase: () => void;
}

export function TopHeader({
  currentTabName,
  supabaseConfig,
  onOpenSupabaseModal,
  onResetDatabase,
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
    <header
      className={`h-16 border-b px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors ${
        isMidnight
          ? 'bg-[#090b10] border-neutral-800 text-white'
          : 'bg-white border-neutral-200/90 text-neutral-800'
      }`}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className={`font-semibold capitalize ${isMidnight ? 'text-white' : 'text-neutral-900'}`}>
          {currentTabName}
        </span>
      </div>

      {/* Right Header Utilities */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher Toggle */}
        <ThemeToggle variant="compact" />

        {/* Database Connection Indicator Pill */}
        <button
          type="button"
          onClick={onOpenSupabaseModal}
          title="Configure PostgreSQL credentials"
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border transition-colors shadow-2xs ${
            isMidnight
              ? 'border-neutral-800 bg-[#0d111a] hover:bg-neutral-800/80 text-neutral-300'
              : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              supabaseConfig.isConnected ? 'bg-emerald-600 ring-4 ring-emerald-500/20' : 'bg-neutral-400'
            }`}
          />
          <span className="font-mono text-[11px] text-neutral-400 hidden sm:inline">PostgreSQL:</span>
          <span className={`font-medium ${isMidnight ? 'text-white' : 'text-neutral-900'}`}>
            {supabaseConfig.isConnected ? 'Supabase Live' : 'Demo DB'}
          </span>
          <SlidersHorizontal className="w-3 h-3 text-neutral-400" />
        </button>

        {/* Reset Seed Button */}
        <button
          type="button"
          onClick={onResetDatabase}
          title="Reset database seed records"
          className={`p-1.5 rounded-lg border transition-colors ${
            isMidnight
              ? 'border-neutral-800 bg-[#0d111a] text-neutral-400 hover:text-white hover:bg-neutral-800'
              : 'border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className={`h-4 w-px ${isMidnight ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={`relative p-2 rounded-full transition-colors ${
              isMidnight
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-neutral-900" />
          </button>

          {isNotificationsOpen && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                isMidnight
                  ? 'bg-[#0d111a] border-neutral-800 text-neutral-100'
                  : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${
                  isMidnight ? 'border-neutral-800 bg-[#090b10]' : 'border-neutral-100 bg-neutral-50/60'
                }`}
              >
                <span className="text-xs font-bold">Incident Alerts</span>
                <span className="text-[10px] font-mono text-neutral-400">Live Telemetry</span>
              </div>

              <div className="divide-y divide-neutral-800/40 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs transition-colors ${
                      isMidnight ? 'hover:bg-neutral-800/50' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                        {n.type === 'warning' && <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                        {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">{n.time}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isMidnight ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className={`px-4 py-2 border-t text-center ${
                  isMidnight ? 'border-neutral-800 bg-[#090b10]' : 'border-neutral-100 bg-neutral-50/50'
                }`}
              >
                <span className="text-[11px] text-neutral-400">System operating with zero unhandled incidents</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-neutral-700/60 cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
