export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  category: string;
  lastUpdated: string;
  daysUntilEmpty: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface AnalysisResult {
  items: Array<{
    name: string;
    count: number;
    category: string;
  }>;
  summary: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SCAN = 'SCAN',
  ANALYTICS = 'ANALYTICS',
  DOCS = 'DOCS'
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
