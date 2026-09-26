/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseDb, SUPABASE_SQL_SCHEMA } from '../supabase';
import { Database, CheckCircle2, AlertCircle, Copy, Check, Key, Globe, ExternalLink, X, Loader2, ArrowUpRight } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

export function SupabaseModal({ isOpen, onClose, onConfigured }: SupabaseModalProps) {
  const currentConfig = supabaseDb.getConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'schema'>('connect');

  useEffect(() => {
    if (isOpen) {
      const cfg = supabaseDb.getConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const res = await supabaseDb.configure(url, anonKey);
    setTesting(false);
    setTestResult(res);
    if (res.success) {
      onConfigured();
    }
  };

  const handleUseDemo = async () => {
    setUrl('');
    setAnonKey('');
    setTesting(true);
    const res = await supabaseDb.configure('', '');
    setTesting(false);
    setTestResult(res);
    onConfigured();
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl border border-neutral-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">PostgreSQL Connection Settings</h2>
              <p className="text-xs text-neutral-500">Configure Supabase credentials or use the local demo store</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 px-5 gap-6 text-xs font-medium text-neutral-600 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'connect'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Credentials & Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            PostgreSQL SQL Schema (DDL)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'connect' ? (
            <form onSubmit={handleTestAndSave} className="space-y-4">
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-md text-xs text-neutral-700 leading-relaxed space-y-1.5">
                <div className="font-semibold text-neutral-900">Connecting to your own Supabase instance:</div>
                <ol className="list-decimal list-inside space-y-0.5 text-neutral-600 text-[11px]">
                  <li>Open your Supabase dashboard at <strong>supabase.com</strong></li>
                  <li>Navigate to <strong>Project Settings → API</strong></li>
                  <li>Copy your <strong>Project URL</strong> and <strong>anon public key</strong> into the fields below</li>
                  <li>Execute the provided <strong>SQL Schema</strong> in the SQL Editor</li>
                </ol>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-700">
                  Supabase Project URL:
                </label>
                <input
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-700">
                  Supabase Anon Public API Key:
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-md text-xs flex items-start gap-2 border ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">{testResult.success ? 'Success' : 'Notice'}</span>
                    <span className="text-[11px] leading-relaxed">{testResult.message}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="text-xs text-neutral-600 hover:text-neutral-900 font-medium underline text-left"
                >
                  Reset to Local In-Memory Demo
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-md border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={testing}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-md text-xs font-medium transition-colors shadow-2xs"
                  >
                    {testing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Test & Save</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900">PostgreSQL DDL Schema</h3>
                  <p className="text-[11px] text-neutral-500">Run this in your Supabase SQL editor</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors shadow-2xs"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied' : 'Copy DDL'}</span>
                </button>
              </div>

              <div className="rounded-md border border-neutral-800 bg-neutral-950 p-4 max-h-[380px] overflow-y-auto">
                <pre className="font-mono text-xs text-neutral-300 leading-relaxed">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
