/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MonthlyPerformance {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  newCustomers: number;
}

export interface RegionalRevenue {
  region: string;
  value: number;
}

export interface CustomerSegment {
  segment: string;
  value: number;
}

export interface AnalyticsKPIs {
  revenueGrowth: number;
  profitMargin: number;
  customerGrowth: number;
  inventoryValue: number;
  salesTrend: string;
  purchaseTrend: string;
  conversionRate: number;
}

export interface AnalyticsData {
  monthlyPerformance: MonthlyPerformance[];
  regionalRevenue: RegionalRevenue[];
  customerSegment: CustomerSegment[];
  kpis: AnalyticsKPIs;
}

export interface ForecastItem {
  period: string;
  revenueActual: number | null;
  revenuePredicted: number;
  profitActual: number | null;
  profitPredicted: number;
  inventoryLevel: number;
}

export interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
  action: string;
}

export interface BusinessScoreFactor {
  name: string;
  score: number;
  status: string;
  comment: string;
}

export interface BusinessScore {
  overallScore: number;
  factors: BusinessScoreFactor[];
  predictions: {
    revenueQ3: number;
    growthQonQ: number;
    expenseSurgeRisk: string;
  };
}

export interface ExecutiveRoleView {
  marketPerformance?: string;
  cashFlowHealth?: string;
  velocity?: string;
  warehouseEfficiency?: string;
  criticalInsights?: string;
  balanceSheetSummary?: string;
  pipelineStatus?: string;
  deadStockWarning?: string;
  kpis: { label: string; value: string }[];
}

export interface ExecutiveDashboardData {
  ceoView: ExecutiveRoleView;
  cfoView: ExecutiveRoleView;
  salesView: ExecutiveRoleView;
  inventoryView: ExecutiveRoleView;
}
