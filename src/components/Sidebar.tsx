/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Compass,
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export type MainNavTab =
  | 'dashboard'
  | 'cases'
  | 'customers'
  | 'reports'
  | 'knowledge'
  | 'settings';

interface SidebarProps {
  currentTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  openCasesCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenTour?: () => void;
}

export function Sidebar({
  currentTab,
  onTabChange,
  openCasesCount = 124,
  isCollapsed,
  onToggleCollapse,
  onOpenTour,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as MainNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases' as MainNavTab, label: 'Cases', icon: FileText, badge: openCasesCount },
    { id: 'customers' as MainNavTab, label: 'Customers', icon: Users },
    { id: 'reports' as MainNavTab, label: 'Reports', icon: BarChart2 },
    { id: 'knowledge' as MainNavTab, label: 'Knowledge Base', icon: BookOpen },
    { id: 'settings' as MainNavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-black text-white flex flex-col justify-between shrink-0 border-r border-red-950/80 transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-18' : 'w-60'
      } h-screen sticky top-0`}
    >
      {/* Top Branding & Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4.5 border-b border-red-950/80 gap-3 bg-black">
          <Logo size="md" textColor="light" showWordmark={!isCollapsed} />
        </div>

        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white font-bold ring-1 ring-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    : 'text-neutral-300 hover:text-white hover:bg-red-950/30 hover:border-red-900/50'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-red-500'}`} />
                {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                {!isCollapsed && item.badge && item.id === 'cases' && (
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    isActive ? 'bg-black text-white border-white/40' : 'bg-red-950 text-red-300 border-red-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Collapse Button */}
      <div className="p-3 border-t border-red-950/80 space-y-2 bg-black">
        {/* System Tour Quick Link */}
        {onOpenTour && (
          <button
            type="button"
            onClick={onOpenTour}
            title={isCollapsed ? 'System Guide & Architecture Tour' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold border border-red-800/80 bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Compass className="w-4 h-4 text-red-400 shrink-0" />
            {!isCollapsed && <span className="truncate flex-1 text-left text-white">System Tour</span>}
            {!isCollapsed && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-600 text-white font-bold">
                GUIDE
              </span>
            )}
          </button>
        )}

        {/* Theme Switcher in Sidebar */}
        {!isCollapsed ? (
          <ThemeToggle variant="full" />
        ) : (
          <ThemeToggle variant="compact" className="w-full" />
        )}

        {/* User Profile */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-red-950/30 transition-colors cursor-pointer border border-transparent hover:border-red-900/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white border border-red-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                A
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">Alex</div>
                <div className="text-[11px] text-red-300 truncate">@resolveiq.io</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-red-400 shrink-0 ml-1" />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white border border-red-400 flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(239,68,68,0.4)]">
              A
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:text-white hover:bg-red-950/30 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-4 h-4 text-red-500" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4 text-red-500" />
              <span className="text-neutral-200">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
