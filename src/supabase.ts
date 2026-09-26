/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Customer, Ticket, Transaction, Order, Refund, AuditLog } from './types';

// ============================================================
// Supabase & PostgreSQL Configuration
// ============================================================

const STORAGE_KEY_URL = 'resolveiq_supabase_url';
const STORAGE_KEY_KEY = 'resolveiq_supabase_anon_key';
const LOCAL_STORAGE_DB = 'resolveiq_postgres_local_cache';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  statusMessage: string;
}

// Default initial PostgreSQL seed data
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1001',
    user_id: 'USR-1001',
    customer_status: 'VIP',
    risk_level: 'LOW',
    total_spent: 48500,
    known_devices: ['iPhone 15 Pro (Mumbai)', 'MacBook Air M2 (Mumbai)'],
    last_ip: '103.21.124.89 (Mumbai, India)',
    created_at: '2026-01-15T09:35:00Z',
    user: {
      id: 'USR-1001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.in',
      phone: '+91 98201 44589',
      created_at: '2026-01-15T09:30:00Z',
    },
  },
  {
    id: 'CUST-1002',
    user_id: 'USR-1002',
    customer_status: 'ACTIVE',
    risk_level: 'MEDIUM',
    total_spent: 32000,
    known_devices: ['Pixel 8 (Bengaluru)', 'iPad Pro (Bengaluru)'],
    last_ip: '49.207.210.12 (Bengaluru, India)',
    created_at: '2026-02-10T14:20:00Z',
    user: {
      id: 'USR-1002',
      name: 'Priya Patel',
      email: 'priya.patel@techcorp.io',
      phone: '+91 98450 11234',
      created_at: '2026-02-10T14:15:00Z',
    },
  },
  {
    id: 'CUST-1003',
    user_id: 'USR-1003',
    customer_status: 'ACTIVE',
    risk_level: 'LOW',
    total_spent: 19400,
    known_devices: ['Samsung S24 (Delhi)', 'ThinkPad X1 (Delhi)'],
    last_ip: '122.160.18.4 (Delhi, India)',
    created_at: '2026-03-01T11:05:00Z',
    user: {
      id: 'USR-1003',
      name: 'Amit Verma',
      email: 'amit.verma@enterprise.co',
      phone: '+91 97112 88990',
      created_at: '2026-03-01T11:00:00Z',
    },
  },
  {
    id: 'CUST-1004',
    user_id: 'USR-1004',
    customer_status: 'ACTIVE',
    risk_level: 'LOW',
    total_spent: 12500,
    known_devices: ['OnePlus 12 (Hyderabad)'],
    last_ip: '115.112.90.1 (Hyderabad, India)',
    created_at: '2026-03-12T16:50:00Z',
    user: {
      id: 'USR-1004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@startup.in',
      phone: '+91 99887 66554',
      created_at: '2026-03-12T16:45:00Z',
    },
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8812',
    customer_id: 'CUST-1001',
    amount: 2000,
    currency: 'INR',
    status: 'FAILED',
    items_summary: 'Noise-Cancelling Wireless Earbuds (Black)',
    created_at: '2026-09-20T11:42:00Z',
  },
  {
    id: 'ORD-8790',
    customer_id: 'CUST-1001',
    amount: 3499,
    currency: 'INR',
    status: 'COMPLETED',
    items_summary: 'Ergonomic Vertical Mouse & Mechanical Keycaps',
    created_at: '2026-09-10T08:15:00Z',
  },
  {
    id: 'ORD-9104',
    customer_id: 'CUST-1002',
    amount: 8500,
    currency: 'INR',
    status: 'COMPLETED',
    items_summary: 'High-Speed NVMe SSD 2TB & External Enclosure',
    created_at: '2026-09-21T03:14:00Z',
  },
  {
    id: 'ORD-4091',
    customer_id: 'CUST-1003',
    amount: 1499,
    currency: 'INR',
    status: 'COMPLETED',
    items_summary: 'ResolveCloud Pro Annual Plan (Single Seat)',
    created_at: '2026-09-21T05:20:00Z',
  },
  {
    id: 'ORD-3820',
    customer_id: 'CUST-1004',
    amount: 4299,
    currency: 'INR',
    status: 'SHIPPED',
    items_summary: 'Smart Fitness Tracker & Extra Band (Express Delivery)',
    created_at: '2026-09-18T10:15:00Z',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-78291',
    customer_id: 'CUST-1001',
    order_id: 'ORD-8812',
    amount: 2000,
    currency: 'INR',
    payment_method: 'UPI (sharma@oksbi)',
    status: 'SUCCESS',
    transaction_date: '2026-09-20T11:42:18Z',
    gateway_ref: 'PG_UPI_78912903',
    device_id: 'iPhone 15 Pro (Mumbai)',
    ip_address: '103.21.124.89',
    location: 'Mumbai, India',
  },
  {
    id: 'TXN-77102',
    customer_id: 'CUST-1001',
    order_id: 'ORD-8790',
    amount: 3499,
    currency: 'INR',
    payment_method: 'Credit Card (HDFC **** 8821)',
    status: 'SUCCESS',
    transaction_date: '2026-09-10T08:15:22Z',
    gateway_ref: 'PG_CARD_5541092',
    device_id: 'MacBook Air M2 (Mumbai)',
    ip_address: '103.21.124.89',
    location: 'Mumbai, India',
  },
  {
    id: 'TXN-99342',
    customer_id: 'CUST-1002',
    order_id: 'ORD-9104',
    amount: 8500,
    currency: 'INR',
    payment_method: 'Direct Debit (Axis NetBanking)',
    status: 'SUCCESS',
    transaction_date: '2026-09-21T03:14:45Z',
    gateway_ref: 'PG_NB_0091823',
    device_id: 'Unknown Linux Automated Script',
    ip_address: '185.220.101.5',
    location: 'Tor Exit Node / Moscow, RU',
  },
  {
    id: 'TXN-9021',
    customer_id: 'CUST-1003',
    order_id: 'ORD-4091',
    amount: 1499,
    currency: 'INR',
    payment_method: 'UPI (amit@icici)',
    status: 'SUCCESS',
    transaction_date: '2026-09-21T05:20:10Z',
    gateway_ref: 'PG_UPI_9901201',
    device_id: 'Samsung S24 (Delhi)',
    ip_address: '122.160.18.4',
    location: 'Delhi, India',
  },
  {
    id: 'TXN-66421',
    customer_id: 'CUST-1004',
    order_id: 'ORD-3820',
    amount: 4299,
    currency: 'INR',
    payment_method: 'Credit Card (ICICI **** 4490)',
    status: 'SUCCESS',
    transaction_date: '2026-09-18T10:15:30Z',
    gateway_ref: 'PG_CARD_7719201',
    device_id: 'OnePlus 12 (Hyderabad)',
    ip_address: '115.112.90.1',
    location: 'Hyderabad, India',
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TCK-06758',
    customer_id: 'CUST-1001',
    title: 'UPI payment gateway timeout on Order ORD-8812',
    description: 'Amount ₹2,000 was debited via UPI (ananya@okhdfcbank) but checkout marked status as failed.',
    intent: 'PAYMENT_GATEWAY_TIMEOUT',
    priority: 'HIGH',
    status: 'OPEN',
    assigned_agent: 'ResolveIQ Engine',
    confidence_score: 97,
    created_at: '2026-09-25T19:30:00Z',
    updated_at: '2026-09-25T19:30:00Z',
    estimated_resolution_time: 'Instant (< 2s)',
  },
  {
    id: 'TCK-08508',
    customer_id: 'CUST-1002',
    title: 'Security flag: Tor exit node IP access detected',
    description: 'High-value transaction of ₹8,500 initiated from recognized Tor relay (185.220.101.5). Requires officer verification.',
    intent: 'FRAUD_SUSPICION',
    priority: 'URGENT',
    status: 'ESCALATED',
    assigned_agent: 'Fraud Review Desk',
    confidence_score: 91,
    created_at: '2026-09-25T14:15:00Z',
    updated_at: '2026-09-25T14:20:00Z',
    estimated_resolution_time: 'Manual SLA (< 2h)',
  },
  {
    id: 'TCK-05509',
    customer_id: 'CUST-1003',
    title: 'Double debit verification for Order ORD-4091',
    description: 'Customer statement shows two simultaneous debits of ₹1,499 on ICICI netbanking switch.',
    intent: 'DOUBLE_DEBIT',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assigned_agent: 'Billing Operations',
    confidence_score: 94,
    created_at: '2026-09-24T18:45:00Z',
    updated_at: '2026-09-25T09:10:00Z',
    estimated_resolution_time: '15 mins',
  },
  {
    id: 'TCK-08588',
    customer_id: 'CUST-1004',
    title: 'Estimated delivery timeline inquiry for Order ORD-3820',
    description: 'Customer requesting courier tracking AWB number for Mechanical Keyboard shipment.',
    intent: 'ORDER_TRACKING',
    priority: 'LOW',
    status: 'OPEN',
    assigned_agent: 'Logistics Desk',
    confidence_score: 99,
    created_at: '2026-09-24T11:20:00Z',
    updated_at: '2026-09-24T11:20:00Z',
    estimated_resolution_time: 'Instant (< 1s)',
  },
  {
    id: 'TCK-09588',
    customer_id: 'CUST-1001',
    title: 'Unrecognized card transaction dispute for ₹3,499',
    description: 'Cardholder noticed unexpected charge while traveling. Card temporarily blocked by issuer.',
    intent: 'UNAUTHORIZED_CHARGE',
    priority: 'HIGH',
    status: 'OPEN',
    assigned_agent: 'Risk Triage Agent',
    confidence_score: 93,
    created_at: '2026-09-23T16:05:00Z',
    updated_at: '2026-09-23T16:05:00Z',
    estimated_resolution_time: '30 mins',
  },
  {
    id: 'TCK-23358',
    customer_id: 'CUST-1004',
    title: 'Billing clarification for delivery express surcharge',
    description: 'Customer inquired why express delivery fee was charged on standard checkout.',
    intent: 'BILLING_QUERY',
    priority: 'LOW',
    status: 'RESOLVED',
    assigned_agent: 'ResolveIQ Engine',
    confidence_score: 98,
    created_at: '2026-09-22T10:10:00Z',
    updated_at: '2026-09-22T10:10:02Z',
    resolved_at: '2026-09-22T10:10:02Z',
    estimated_resolution_time: 'Instant (1.8s)',
  },
];

export const INITIAL_REFUNDS: Refund[] = [
  {
    id: 'REF-5501',
    transaction_id: 'TXN-77102',
    amount: 500,
    currency: 'INR',
    status: 'COMPLETED',
    reason: 'Partial goodwill promotional credit discount',
    gateway_reference: 'PG_REF_11094',
    created_at: '2026-09-22T10:10:02Z',
    updated_at: '2026-09-22T10:10:05Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-8910',
    ticket_id: 'TCK-06758',
    actor: 'ResolveIQ Engine',
    action: 'TICKET_INGESTED',
    metadata: { source: 'Checkout UPI Webhook', amount: 2000, bank: 'HDFC Bank' },
    created_at: '2026-09-25T19:30:00Z',
  },
  {
    id: 'AUD-8909',
    ticket_id: 'TCK-08508',
    actor: 'Security Guard',
    action: 'ANOMALY_HALTED',
    metadata: { reason: 'Tor Exit Node detected (185.220.101.5)', risk_score: 94 },
    created_at: '2026-09-25T14:15:10Z',
  },
  {
    id: 'AUD-8908',
    ticket_id: 'TCK-05509',
    actor: 'Banking Ledger Syncer',
    action: 'RECONCILIATION_FLAGGED',
    metadata: { duplicate_seq: 'PG_UPI_9901201', order_id: 'ORD-4091' },
    created_at: '2026-09-24T18:45:00Z',
  },
  {
    id: 'AUD-8907',
    ticket_id: 'TCK-23358',
    actor: 'ResolveIQ Engine',
    action: 'AUTONOMOUS_SETTLEMENT',
    metadata: { refund_id: 'REF-5501', execution_latency_ms: 1820 },
    created_at: '2026-09-22T10:10:02Z',
  },
];

// SQL Schema for users to execute in Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- ResolveIQ — PostgreSQL Schema for Supabase
-- Run this in the Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  customer_status TEXT DEFAULT 'ACTIVE',
  risk_level TEXT DEFAULT 'LOW',
  total_spent NUMERIC DEFAULT 0,
  known_devices JSONB DEFAULT '[]',
  last_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'COMPLETED',
  items_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Transactions Table (Relational Ledger)
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  order_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  status TEXT DEFAULT 'SUCCESS',
  gateway_ref TEXT,
  device_id TEXT,
  ip_address TEXT,
  location TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
  id TEXT PRIMARY KEY,
  transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'COMPLETED',
  reason TEXT,
  gateway_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Support Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  intent TEXT,
  priority TEXT DEFAULT 'MEDIUM',
  status TEXT DEFAULT 'NEW',
  assigned_agent TEXT,
  confidence_score NUMERIC DEFAULT 95,
  resolution_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 6. Audit Logs Table (Full auditability)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  ticket_id TEXT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (Optional: allow anon read/write for demo)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON customers FOR ALL USING (true);
CREATE POLICY "Allow public read access" ON orders FOR ALL USING (true);
CREATE POLICY "Allow public read access" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow public read access" ON refunds FOR ALL USING (true);
CREATE POLICY "Allow public read access" ON tickets FOR ALL USING (true);
CREATE POLICY "Allow public read access" ON audit_logs FOR ALL USING (true);
`;

// ============================================================
// Supabase Database Service
// ============================================================

class SupabaseDatabaseService {
  private client: SupabaseClient | null = null;
  private url: string = '';
  private anonKey: string = '';
  private isConnected: boolean = false;
  private listeners: Set<() => void> = new Set();

  // In-memory / local PostgreSQL store fallback
  private localData = {
    customers: [...INITIAL_CUSTOMERS],
    orders: [...INITIAL_ORDERS],
    transactions: [...INITIAL_TRANSACTIONS],
    tickets: [...INITIAL_TICKETS],
    refunds: [...INITIAL_REFUNDS],
    auditLogs: [...INITIAL_AUDIT_LOGS],
  };

  constructor() {
    this.loadFromStorage();
    this.initSupabaseFromEnvOrStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_DB);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.customers) {
            const existingTicketIds = new Set((parsed.tickets || []).map((t: any) => t.id));
            const missingTickets = INITIAL_TICKETS.filter((t) => !existingTicketIds.has(t.id));
            parsed.tickets = [...(parsed.tickets || []), ...missingTickets];
            this.localData = parsed;
          }
        }
      } catch (err) {
        console.warn('Could not load local database cache', err);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_DB, JSON.stringify(this.localData));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
    }
    this.notify();
  }

  private initSupabaseFromEnvOrStorage() {
    if (typeof window !== 'undefined') {
      const storedUrl = localStorage.getItem(STORAGE_KEY_URL) || (import.meta as any).env?.VITE_SUPABASE_URL || '';
      const storedKey = localStorage.getItem(STORAGE_KEY_KEY) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

      if (storedUrl && storedKey && storedUrl.startsWith('https://')) {
        this.configure(storedUrl, storedKey);
      }
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Configure Supabase credentials
  public async configure(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!url.trim() || !anonKey.trim()) {
        this.client = null;
        this.url = '';
        this.anonKey = '';
        this.isConnected = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY_URL);
          localStorage.removeItem(STORAGE_KEY_KEY);
        }
        this.notify();
        return { success: true, message: 'Switched to PostgreSQL Local Demo mode.' };
      }

      const client = createClient(url.trim(), anonKey.trim(), {
        auth: { persistSession: false },
      });

      // Quick ping test to verify credentials
      const { error } = await client.from('customers').select('id').limit(1);

      this.client = client;
      this.url = url.trim();
      this.anonKey = anonKey.trim();
      this.isConnected = !error;

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_URL, this.url);
        localStorage.setItem(STORAGE_KEY_KEY, this.anonKey);
      }

      this.notify();

      if (error) {
        return {
          success: false,
          message: `Connected to Supabase endpoint, but table check returned: ${error.message}. (Did you run the SQL schema in Supabase SQL editor?)`,
        };
      }

      return { success: true, message: 'Successfully connected to Supabase PostgreSQL database!' };
    } catch (err: any) {
      console.error('Supabase configuration error:', err);
      this.isConnected = false;
      this.notify();
      return { success: false, message: err.message || 'Failed to connect to Supabase.' };
    }
  }

  public getConfig(): SupabaseConfig {
    return {
      url: this.url,
      anonKey: this.anonKey,
      isConnected: this.isConnected,
      statusMessage: this.isConnected
        ? 'Connected to Supabase PostgreSQL'
        : this.url
        ? 'Configured (Verifying or waiting for tables)'
        : 'Running on PostgreSQL Local Store (Supabase-ready)',
    };
  }

  // --- QUERY METHODS ---

  public getCustomers(): Customer[] {
    return this.localData.customers;
  }

  public getAllOrders(): Order[] {
    return this.localData.orders;
  }

  public getAllTransactions(): Transaction[] {
    return this.localData.transactions;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.localData.customers.find((c) => c.id === id);
  }

  public getOrdersByCustomer(customerId: string): Order[] {
    return this.localData.orders.filter((o) => o.customer_id === customerId);
  }

  public getTransactionsByCustomer(customerId: string): Transaction[] {
    return this.localData.transactions.filter((t) => t.customer_id === customerId);
  }

  public getTickets(): Ticket[] {
    return this.localData.tickets;
  }

  public getTicketsByCustomer(customerId: string): Ticket[] {
    return this.localData.tickets.filter((t) => t.customer_id === customerId);
  }

  public getRefunds(): Refund[] {
    return this.localData.refunds;
  }

  public getAuditLogs(): AuditLog[] {
    return this.localData.auditLogs;
  }

  // --- MUTATION METHODS ---

  public async createTicket(ticketData: {
    customer_id: string;
    title: string;
    description: string;
    intent: string;
    priority?: Ticket['priority'];
    status?: Ticket['status'];
    assigned_agent?: string;
    confidence_score?: number;
    estimated_resolution_time?: string;
  }): Promise<Ticket> {
    const id = `RX-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id,
      customer_id: ticketData.customer_id,
      title: ticketData.title,
      description: ticketData.description,
      intent: ticketData.intent,
      priority: ticketData.priority || 'MEDIUM',
      status: ticketData.status || 'NEW',
      assigned_agent: ticketData.assigned_agent || 'Autonomous Engine',
      confidence_score: ticketData.confidence_score || 96,
      created_at: now,
      updated_at: now,
      estimated_resolution_time: ticketData.estimated_resolution_time || 'Instant (< 2s)',
    };

    this.localData.tickets.unshift(newTicket);
    this.logAudit(id, 'ResolveIQ Engine', 'TICKET_CREATED', {
      intent: newTicket.intent,
      priority: newTicket.priority,
    });
    this.saveToStorage();

    // If connected to live Supabase, push to remote PostgreSQL
    if (this.client && this.isConnected) {
      try {
        await this.client.from('tickets').insert([
          {
            id: newTicket.id,
            customer_id: newTicket.customer_id,
            title: newTicket.title,
            description: newTicket.description,
            intent: newTicket.intent,
            priority: newTicket.priority,
            status: newTicket.status,
            assigned_agent: newTicket.assigned_agent,
            confidence_score: newTicket.confidence_score,
            created_at: newTicket.created_at,
            updated_at: newTicket.updated_at,
          },
        ]);
      } catch (err) {
        console.warn('Supabase remote write error (saved locally):', err);
      }
    }

    return newTicket;
  }

  public async updateTicketStatus(
    ticketId: string,
    status: Ticket['status'],
    resolutionSummary?: string
  ): Promise<Ticket | undefined> {
    const ticket = this.localData.tickets.find((t) => t.id === ticketId);
    if (!ticket) return undefined;

    ticket.status = status;
    ticket.updated_at = new Date().toISOString();
    if (status === 'RESOLVED') {
      ticket.resolved_at = new Date().toISOString();
    }
    this.logAudit(ticketId, 'Agent Orchestrator', 'TICKET_STATUS_UPDATED', {
      status,
      summary: resolutionSummary,
    });
    this.saveToStorage();

    if (this.client && this.isConnected) {
      try {
        await this.client
          .from('tickets')
          .update({
            status,
            updated_at: ticket.updated_at,
            resolved_at: ticket.resolved_at,
            resolution_summary: resolutionSummary,
          })
          .eq('id', ticketId);
      } catch (err) {
        console.warn('Supabase ticket update error:', err);
      }
    }

    return ticket;
  }

  public async createRefund(
    transactionId: string,
    amount: number,
    currency: string,
    reason: string
  ): Promise<Refund> {
    const id = `REF-${Math.floor(5000 + Math.random() * 5000)}`;
    const now = new Date().toISOString();

    const newRefund: Refund = {
      id,
      transaction_id: transactionId,
      amount,
      currency,
      status: 'COMPLETED',
      reason,
      gateway_reference: `PG_REF_${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: now,
      updated_at: now,
    };

    this.localData.refunds.unshift(newRefund);
    this.logAudit('SYS', 'Refund Agent', 'REFUND_EXECUTED', {
      refund_id: id,
      amount,
      currency,
      transaction_id: transactionId,
    });
    this.saveToStorage();

    if (this.client && this.isConnected) {
      try {
        await this.client.from('refunds').insert([
          {
            id: newRefund.id,
            transaction_id: newRefund.transaction_id,
            amount: newRefund.amount,
            currency: newRefund.currency,
            status: newRefund.status,
            reason: newRefund.reason,
            gateway_reference: newRefund.gateway_reference,
            created_at: newRefund.created_at,
            updated_at: newRefund.updated_at,
          },
        ]);
      } catch (err) {
        console.warn('Supabase refund insert error:', err);
      }
    }

    return newRefund;
  }

  public logAudit(ticketId: string, actor: string, action: string, metadata: Record<string, any>): AuditLog {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticket_id: ticketId,
      actor,
      action,
      metadata,
      created_at: new Date().toISOString(),
    };
    this.localData.auditLogs.unshift(newLog);
    this.saveToStorage();

    if (this.client && this.isConnected) {
      this.client
        .from('audit_logs')
        .insert([
          {
            id: newLog.id,
            ticket_id: newLog.ticket_id,
            actor: newLog.actor,
            action: newLog.action,
            metadata: newLog.metadata,
            created_at: newLog.created_at,
          },
        ])
        .then();
    }

    return newLog;
  }

  public resetDatabase() {
    this.localData = {
      customers: [...INITIAL_CUSTOMERS],
      orders: [...INITIAL_ORDERS],
      transactions: [...INITIAL_TRANSACTIONS],
      tickets: [...INITIAL_TICKETS],
      refunds: [...INITIAL_REFUNDS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
    };
    this.saveToStorage();
  }
}

export const supabaseDb = new SupabaseDatabaseService();
