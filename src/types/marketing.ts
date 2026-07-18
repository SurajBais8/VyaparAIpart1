/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'WhatsApp' | 'SMS';
  audience: string;
  channel: 'Email' | 'WhatsApp' | 'SMS';
  status: 'Active' | 'Scheduled' | 'Draft' | 'Completed' | 'Archived';
  startDate: string;
  endDate: string;
  budget: number;
  conversion: number;
  description: string;
  subject?: string;
  body: string;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  leadsCount: number;
  revenue: number;
}

export interface Audience {
  id: string;
  name: string;
  type: 'Customer Segment' | 'Lead Segment' | 'Dynamic List';
  count: number;
  description: string;
  filters: Record<string, string>;
  aiSuggestions: string[];
  source?: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'Inbox' | 'Outbox' | 'Draft' | 'Scheduled';
  sentTime: string | null;
  read: boolean;
}

export interface WhatsAppMessage {
  id: string;
  text: string;
  sender: 'customer' | 'agent';
  timestamp: string;
  mediaUrl: string | null;
  mediaType: string | null;
}

export interface WhatsAppChat {
  id: string;
  contactName: string;
  phone: string;
  unread: number;
  lastMessage: string;
  lastUpdated: string;
  status: 'Active' | 'Archived' | 'Pending';
  messages: WhatsAppMessage[];
}

export interface SMSMessage {
  id: string;
  recipient: string;
  message: string;
  status: 'Delivered' | 'Sent' | 'Failed' | 'Pending';
  timestamp: string;
  cost: number;
}

export interface AutomationStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  description: string;
  config: Record<string, string>;
  title?: string;
  nextStepId?: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  trigger: string;
  conditions: string;
  actions: string[];
  steps: AutomationStep[];
  triggerEvent?: string;
  stepsCount?: number;
}

export interface MarketingTemplate {
  id: string;
  name: string;
  type: 'Email' | 'WhatsApp' | 'SMS';
  category: 'Transactional' | 'Marketing' | 'Engagement';
  content: string;
  variables: string[];
  subject?: string;
}

export interface ChannelPerformance {
  name: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  conversion: number;
}

export interface CampaignPerformance {
  name: string;
  leads: number;
  conversions: number;
  roi: number;
}

export interface LeadConversion {
  month: string;
  leads: number;
  conversions: number;
}

export interface MonthlyEngagement {
  month: string;
  email: number;
  whatsapp: number;
  sms: number;
}

export interface MarketingAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  scheduledCampaigns: number;
  completedCampaigns: number;
  totalLeads: number;
  conversionRate: number;
  emailSent: number;
  whatsAppSent: number;
  smsSent: number;
  channelPerformance: ChannelPerformance[];
  campaignPerformance: CampaignPerformance[];
  leadConversion: LeadConversion[];
  monthlyEngagement: MonthlyEngagement[];
}
