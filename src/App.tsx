/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ResolutionView } from './components/ResolutionView';
import { HumanQueue } from './components/HumanQueue';
import { DatabaseExplorer } from './components/DatabaseExplorer';
import { SupabaseModal } from './components/SupabaseModal';
import { ChatAssistant } from './components/ChatAssistant';
import { supabaseDb } from './supabase';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('resolution');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-1001');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [, setTick] = useState(0);

  // Re-render when database state updates
  useEffect(() => {
    const unsub = supabaseDb.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => unsub();
  }, []);

  const customers = supabaseDb.getCustomers();
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerTransactions = supabaseDb.getTransactionsByCustomer(selectedCustomer.id);
  const customerOrders = supabaseDb.getOrdersByCustomer(selectedCustomer.id);
  const supabaseConfig = supabaseDb.getConfig();

  const handleRefresh = () => {
    setTick((t) => t + 1);
  };

  const handleResetDatabase = () => {
    supabaseDb.resetDatabase();
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        supabaseConfig={supabaseConfig}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onResetDatabase={handleResetDatabase}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'resolution' && (
          <ResolutionView
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
            transactions={customerTransactions}
            orders={customerOrders}
            onViewDatabase={() => setActiveTab('database')}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'human' && <HumanQueue onRefresh={handleRefresh} />}

        {activeTab === 'database' && <DatabaseExplorer />}
      </main>

      {/* Supabase Connection & Schema Configuration Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigured={handleRefresh}
      />

      {/* Floating Chatbot Assistant */}
      <ChatAssistant />
    </div>
  );
}

export default App;
