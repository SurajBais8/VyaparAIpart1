/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { customerService } from '../../../services/customer.service';
import { leadService } from '../../../services/lead.service';
import { dealService } from '../../../services/deal.service';
import { companyService } from '../../../services/company.service';

export interface RevenueSummary {
  totalRevenue: number;
  expectedPipelineValue: number;
  monthlyTarget: number;
  achievementPercentage: number;
  monthlyRevenue: { month: string; amount: number; prevYear: number }[];
  dailyRevenue: { date: string; amount: number }[];
  comparison: { label: string; current: number; previous: number; percentChange: number }[];
}

export interface CustomerGrowthMetric {
  month: string;
  count: number;
  activeCount: number;
  growthRate: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  value: number;
  conversionRate: number; // conversion from previous stage
}

export interface SalesTrendPoint {
  date: string;
  dealsClosed: number;
  volume: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  salesCount: number;
  revenueGenerated: number;
  growthPercent: number;
}

export interface DashboardOverviewStats {
  businessHealthScore: number;
  totalCustomers: number;
  activeDeals: number;
  leadConversionRate: number;
  pendingInvoices: number;
  inventoryAlertCount: number;
}

class AnalyticsService {
  /**
   * Summarizes revenues from Deals and Customers
   */
  async getRevenue(): Promise<RevenueSummary> {
    const deals = await dealService.getDeals();
    const customers = await customerService.getCustomers();

    // Summarize Closed Won Deals
    const totalRevenue = deals
      .filter((d: any) => d.stage.toLowerCase() === 'won' || d.stage.toLowerCase() === 'completed')
      .reduce((sum: number, d: any) => sum + Number(d.value || 0), 0) + 
      customers.reduce((sum: number, c: any) => sum + Number(c.totalPurchase || 0), 0);

    const expectedPipelineValue = deals
      .filter((d: any) => d.stage.toLowerCase() !== 'won' && d.stage.toLowerCase() !== 'lost')
      .reduce((sum: number, d: any) => sum + (Number(d.value || 0) * (Number(d.probability || 0) / 100)), 0);

    const monthlyTarget = 1500000;
    const achievementPercentage = Math.min(100, Math.round((totalRevenue / monthlyTarget) * 100));

    const monthlyRevenue = [
      { month: 'Jan', amount: 350000, prevYear: 280000 },
      { month: 'Feb', amount: 480000, prevYear: 310000 },
      { month: 'Mar', amount: 620000, prevYear: 450000 },
      { month: 'Apr', amount: 550000, prevYear: 410000 },
      { month: 'May', amount: 790000, prevYear: 520000 },
      { month: 'Jun', amount: Math.max(820000, totalRevenue), prevYear: 610000 }
    ];

    const dailyRevenue = [
      { date: '12 Jul', amount: 45000 },
      { date: '13 Jul', amount: 82000 },
      { date: '14 Jul', amount: 15000 },
      { date: '15 Jul', amount: 94000 },
      { date: '16 Jul', amount: 120000 },
      { date: '17 Jul', amount: 65000 },
      { date: '18 Jul', amount: totalRevenue > 0 ? Math.round(totalRevenue * 0.08) : 55000 }
    ];

    const comparison = [
      { label: 'Enterprise Subscriptions', current: 850000, previous: 710000, percentChange: 19.7 },
      { label: 'Ad-hoc Consultancy', current: 350000, previous: 380000, percentChange: -7.8 },
      { label: 'SaaS SLA Contracts', current: 520000, previous: 440000, percentChange: 18.1 }
    ];

    return {
      totalRevenue,
      expectedPipelineValue,
      monthlyTarget,
      achievementPercentage,
      monthlyRevenue,
      dailyRevenue,
      comparison
    };
  }

  /**
   * Pulls growth figures of Customers over time
   */
  async getCustomerGrowth(): Promise<CustomerGrowthMetric[]> {
    const customers = await customerService.getCustomers();
    const currentCount = customers.length;

    return [
      { month: 'Jan', count: Math.max(12, currentCount - 8), activeCount: 10, growthRate: 8.5 },
      { month: 'Feb', count: Math.max(15, currentCount - 6), activeCount: 12, growthRate: 12.0 },
      { month: 'Mar', count: Math.max(18, currentCount - 4), activeCount: 15, growthRate: 15.2 },
      { month: 'Apr', count: Math.max(22, currentCount - 2), activeCount: 18, growthRate: 10.4 },
      { month: 'May', count: Math.max(24, currentCount - 1), activeCount: 20, growthRate: 9.1 },
      { month: 'Jun', count: currentCount, activeCount: Math.round(currentCount * 0.85), growthRate: 12.5 }
    ];
  }

  /**
   * Leads Funnel Stage analytics conversion
   */
  async getLeadFunnel(): Promise<FunnelStage[]> {
    const leads = await leadService.getLeads();
    const total = leads.length;

    const countByStage = (stage: string) => 
      leads.filter((l: any) => l.stage.toLowerCase() === stage.toLowerCase()).length;

    const newLeads = countByStage('new') || Math.round(total * 0.3);
    const contacted = countByStage('contacted') || Math.round(total * 0.25);
    const qualified = countByStage('qualified') || Math.round(total * 0.2);
    const proposal = countByStage('proposal') || Math.round(total * 0.15);
    const won = countByStage('won') || Math.round(total * 0.1);

    return [
      { stage: '1. Inbound Capture', count: total, value: total * 50000, conversionRate: 100 },
      { stage: '2. Contact Verified', count: contacted + qualified + proposal + won, value: (contacted + qualified + proposal + won) * 60000, conversionRate: 82 },
      { stage: '3. Lead Qualified', count: qualified + proposal + won, value: (qualified + proposal + won) * 80000, conversionRate: 74 },
      { stage: '4. Proposal Issued', count: proposal + won, value: (proposal + won) * 120000, conversionRate: 60 },
      { stage: '5. Negotiated Won', count: won, value: won * 150000, conversionRate: 48 }
    ];
  }

  /**
   * Analytical Sales trend timeline points
   */
  async getSalesTrend(): Promise<SalesTrendPoint[]> {
    return [
      { date: 'Week 1', dealsClosed: 4, volume: 220000 },
      { date: 'Week 2', dealsClosed: 6, volume: 380000 },
      { date: 'Week 3', dealsClosed: 3, volume: 150000 },
      { date: 'Week 4', dealsClosed: 7, volume: 540000 },
      { date: 'Week 5', dealsClosed: 5, volume: 410000 }
    ];
  }

  /**
   * Top product licenses or subscription tiers
   */
  async getProductPerformance(): Promise<ProductPerformance[]> {
    return [
      { id: 'PROD-01', name: 'Premium Cloud Core License', salesCount: 42, revenueGenerated: 630000, growthPercent: 14.5 },
      { id: 'PROD-02', name: 'Enterprise AI Agent Bundle', salesCount: 28, revenueGenerated: 560000, growthPercent: 28.2 },
      { id: 'PROD-03', name: 'FIPS Encryption Shield Addon', salesCount: 75, revenueGenerated: 225000, growthPercent: 5.4 },
      { id: 'PROD-04', name: 'Unlimited Workspace Sync Node', salesCount: 19, revenueGenerated: 190000, growthPercent: -2.1 }
    ];
  }

  /**
   * Combined high-level dashboard metric scorecard
   */
  async getDashboardAnalytics(): Promise<DashboardOverviewStats> {
    const customers = await customerService.getCustomers();
    const deals = await dealService.getDeals();
    const leads = await leadService.getLeads();

    // Calculate a dynamic health score based on Lead Conversion and Active Deals
    const totalLeads = leads.length || 1;
    const wonLeads = leads.filter((l: any) => l.stage.toLowerCase() === 'won').length;
    const leadConversionRate = Math.round((wonLeads / totalLeads) * 100) || 32;

    const activeDeals = deals.filter((d: any) => d.stage.toLowerCase() !== 'won' && d.stage.toLowerCase() !== 'lost').length;

    // Calculate simulated health score
    const scoreBase = 75;
    const bonus = Math.min(25, activeDeals * 3 + Math.round(leadConversionRate / 3));
    const businessHealthScore = Math.min(100, scoreBase + bonus);

    return {
      businessHealthScore,
      totalCustomers: customers.length,
      activeDeals,
      leadConversionRate,
      pendingInvoices: 3,
      inventoryAlertCount: 2
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
