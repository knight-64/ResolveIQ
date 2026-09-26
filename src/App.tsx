/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, MainNavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { ResolutionView } from './components/ResolutionView';
import { CustomersView } from './components/CustomersView';
import { HumanQueue } from './components/HumanQueue';
import { DatabaseExplorer } from './components/DatabaseExplorer';
import { AboutSection } from './components/AboutSection';
import { SupabaseModal } from './components/SupabaseModal';
import { CreateCaseModal } from './components/CreateCaseModal';
import { SystemTourModal } from './components/SystemTourModal';
import { ChatAssistant } from './components/ChatAssistant';
import { ToastProvider, useToast } from './components/Toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { supabaseDb } from './supabase';

function AppContent() {
  const { isMidnight } = useTheme();
  const { showToast } = useToast();
  const [currentTab, setCurrentTab] = useState<MainNavTab>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-1001');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isSystemTourOpen, setIsSystemTourOpen] = useState(false);
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
  const tickets = supabaseDb.getTickets();
  const openCasesCount = tickets.filter((t) => t.status !== 'RESOLVED').length;

  const handleRefresh = () => {
    setTick((t) => t + 1);
  };

  const handleResetDatabase = () => {
    supabaseDb.resetDatabase();
    handleRefresh();
    showToast({
      type: 'info',
      title: 'Database Reset',
      description: 'Records restored to default PostgreSQL demo seeds.',
    });
  };

  const handleCaseCreated = (customerId: string, issue: string) => {
    setSelectedCustomerId(customerId);
    setCurrentTab('cases');
    handleRefresh();
    showToast({
      type: 'success',
      title: 'Dispute Case Logged',
      description: 'New claim registered and opened in Dispute Workbench.',
    });
  };

  const handleSelectCaseFromDashboard = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedCustomerId(ticket.customer_id);
    }
    setCurrentTab('cases');
  };

  const getBreadcrumbLabel = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'cases':
        return 'Dispute Cases & Workbench';
      case 'customers':
        return 'Customers Directory';
      case 'reports':
        return 'Security & Escalation Reports';
      case 'knowledge':
        return 'Knowledge Base & Architecture';
      case 'settings':
        return 'Settings & Relational Ledger';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-red-600 selection:text-white antialiased bg-black text-white">
      {/* Dark Sidebar matching enterprise aesthetic */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        openCasesCount={openCasesCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenTour={() => setIsSystemTourOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          currentTabName={getBreadcrumbLabel()}
          supabaseConfig={supabaseConfig}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onResetDatabase={handleResetDatabase}
          onOpenSystemTour={() => setIsSystemTourOpen(true)}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              tickets={tickets}
              customers={customers}
              onOpenCreateCase={() => setIsCreateCaseOpen(true)}
              onSelectCase={handleSelectCaseFromDashboard}
              onOpenTour={() => setIsSystemTourOpen(true)}
            />
          )}

          {currentTab === 'cases' && (
            <ResolutionView
              customers={customers}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={setSelectedCustomerId}
              transactions={customerTransactions}
              orders={customerOrders}
              onViewDatabase={() => setCurrentTab('settings')}
              onRefresh={handleRefresh}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersView
              customers={customers}
              onSelectCustomerForCase={(customerId) => {
                setSelectedCustomerId(customerId);
                setCurrentTab('cases');
              }}
            />
          )}

          {currentTab === 'reports' && <HumanQueue onRefresh={handleRefresh} />}

          {currentTab === 'knowledge' && (
            <AboutSection onOpenTour={() => setIsSystemTourOpen(true)} />
          )}

          {currentTab === 'settings' && <DatabaseExplorer />}
        </main>
      </div>

      {/* System Tour & Architecture Guide Modal */}
      <SystemTourModal
        isOpen={isSystemTourOpen}
        onClose={() => setIsSystemTourOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Create New Case Modal */}
      <CreateCaseModal
        isOpen={isCreateCaseOpen}
        onClose={() => setIsCreateCaseOpen(false)}
        customers={customers}
        onCaseCreated={handleCaseCreated}
      />

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

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
