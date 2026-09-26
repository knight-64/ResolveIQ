/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================================
// ResolveIQ — Relational Database Types (PostgreSQL / Supabase)
// ==========================================================

export type CustomerStatus = 'ACTIVE' | 'VIP' | 'FLAGGED' | 'SUSPENDED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'INVESTIGATING' | 'ACTION_REQUIRED' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED' | 'DISPUTED';
export type OrderStatus = 'COMPLETED' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'PROCESSING' | 'SHIPPED';
export type RefundStatus = 'NOT_INITIATED' | 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
export type EscalationStatus = 'PENDING_HUMAN_REVIEW' | 'HUMAN_IN_PROGRESS' | 'RESOLVED_BY_HUMAN' | 'REJECTED';
export type ActionExecutionStatus = 'PENDING' | 'EXECUTED' | 'FAILED' | 'BLOCKED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  customer_status: CustomerStatus;
  risk_level: RiskLevel;
  total_spent: number;
  known_devices: string[];
  last_ip: string;
  created_at: string;
  user?: User;
}

export interface Ticket {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  intent: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_agent: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  customer?: Customer;
  estimated_resolution_time?: string;
  estimated_resolution_speech?: string;
  estimated_resolution_sla?: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  order_id?: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: TransactionStatus;
  transaction_date: string;
  gateway_ref: string;
  device_id?: string;
  ip_address?: string;
  location?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  items_summary: string;
  created_at: string;
}

export interface Refund {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason: string;
  gateway_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  ticket_id: string;
  role: 'customer' | 'agent' | 'system';
  agent_name?: string;
  message: string;
  created_at: string;
}

export interface AgentRun {
  id: string;
  ticket_id: string;
  agent_name: string;
  input: string;
  output: string;
  confidence: number;
  created_at: string;
}

export interface AgentAction {
  id: string;
  ticket_id: string;
  agent_name: string;
  action: string;
  status: ActionExecutionStatus;
  result: string;
  created_at: string;
}

export interface Escalation {
  id: string;
  ticket_id: string;
  reason: string;
  risk_level: RiskLevel;
  assigned_to: string;
  status: EscalationStatus;
  human_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface VerificationResult {
  id: string;
  ticket_id: string;
  action_id: string;
  verified: boolean;
  evidence: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  ticket_id: string;
  actor: string;
  action: string;
  metadata: Record<string, any>;
  created_at: string;
}

// ==========================================================
// Multi-Agent System Contracts
// ==========================================================

export type AgentName = 
  | 'Intent Agent' 
  | 'Orchestrator' 
  | 'Transaction Agent' 
  | 'Refund Agent' 
  | 'Security Agent' 
  | 'Account Agent' 
  | 'General Agent' 
  | 'Verification Engine';

export interface ExtractedEntities {
  amount?: number;
  currency?: string;
  transaction_id?: string;
  order_id?: string;
  date?: string;
  product_name?: string;
  recipient?: string;
}

export interface IntentResult {
  intent: string;
  category: string;
  urgency: TicketPriority;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FRUSTRATED';
  entities: ExtractedEntities;
  recommended_agent: AgentName;
  confidence: number;
  summary: string;
}

export interface BusinessRuleCheck {
  rule: string;
  passed: boolean;
  details: string;
}

export interface CounterfactualExplanation {
  approvedCondition: string[];
  wouldHaveBeenBlockedIf: string[];
}

export interface ReasoningSummary {
  issue: string;
  evidence: string[];
  business_rules: BusinessRuleCheck[];
  decision: string;
  action: string;
  action_payload?: Record<string, any>;
  confidence: number;
  verification: {
    verified: boolean;
    evidence: string;
  };
  escalation_required: boolean;
  escalation_reason?: string;
  risk_level: RiskLevel;
  customer_message: string;
  estimated_resolution_time?: string;
  estimated_resolution_speech?: string;
  estimated_resolution_category?: 'INSTANT' | 'FAST' | 'EXPEDITED_HUMAN' | 'STANDARD_HUMAN';
  estimated_resolution_sla?: string;
  ml_prediction?: {
    escalation_probability: number;
    risk_level: string;
    model_version: string;
    contributing_factors?: { feature: string; impact: number; description: string }[];
  };
  counterfactual_explanation?: CounterfactualExplanation;
  knowledge_sources?: {
    source: string;
    similarity: number;
    relevantClause: string;
  }[];
}

export interface LiveStep {
  id: string;
  agent: AgentName;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'error';
  timestamp: string;
  details?: Record<string, any>;
}

export interface CaseContext {
  customer: Customer;
  currentTicket?: Ticket;
  recentTransactions: Transaction[];
  recentOrders: Order[];
  recentRefunds: Refund[];
  conversationHistory: Conversation[];
  previousTickets: Ticket[];
  agentActions: AgentAction[];
  verificationResults: VerificationResult[];
  escalation?: Escalation;
}
