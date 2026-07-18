export interface AnalyticsReport {
  id: string;
  title: string;
  category: 'Sales' | 'Customers' | 'Inventory' | 'Accounting' | 'Purchase' | 'Employees' | 'Marketing';
  description: string;
  isFavorite?: boolean;
  schedule?: string; // 'None' | 'Daily' | 'Weekly' | 'Monthly'
}

const STORAGE_KEY = 'crm_v3_analytics_reports_list';

const INITIAL_REPORTS: AnalyticsReport[] = [
  { id: "REP-SAL-01", title: "Monthly Sales Revenue Analysis", category: "Sales", description: "Audit regional sales numbers, average cart sizes, and high velocity products.", isFavorite: true, schedule: "Weekly" },
  { id: "REP-CUST-01", title: "Customer Lifetime Value & Retention Index", category: "Customers", description: "Calculates cohort retention rates and highlights accounts with elevated churn risks.", isFavorite: true },
  { id: "REP-INV-01", title: "Inventory Turnover & Capital Valuation", category: "Inventory", description: "Comprehensive audit of storage depot utilization rates, stock age lists, and slow moving models." },
  { id: "REP-ACC-01", title: "Profit & Loss (P&L) Dynamic Report", category: "Accounting", description: "Consolidated balance of digital invoices, operating cost lines, and net tax liabilities.", isFavorite: true, schedule: "Monthly" },
  { id: "REP-PUR-01", title: "Supplier Fulfilment SLA Compliance", category: "Purchase", description: "Audit purchase order response lead-times, defects rates, and procurement price variances." },
  { id: "REP-EMP-01", title: "Sales Rep Commission & Productivity", category: "Employees", description: "Performance metrics of personnel, total deal closures, and customer onboarding feedback." },
  { id: "REP-MKT-01", title: "ROI Campaign Attribution Analysis", category: "Marketing", description: "Ad campaigns conversions, organic lead inflow counts, and customer acquisitions cost." }
];

export const reportService = {
  getReports: async (): Promise<AnalyticsReport[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  },

  updateReports: async (list: AnalyticsReport[]): Promise<AnalyticsReport[]> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  },

  toggleFavorite: async (id: string): Promise<AnalyticsReport> => {
    const list = await reportService.getReports();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Report not found');
    list[idx].isFavorite = !list[idx].isFavorite;
    await reportService.updateReports(list);
    return list[idx];
  },

  setSchedule: async (id: string, schedule: string): Promise<AnalyticsReport> => {
    const list = await reportService.getReports();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Report not found');
    list[idx].schedule = schedule;
    await reportService.updateReports(list);
    return list[idx];
  }
};
