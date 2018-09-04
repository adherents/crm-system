export interface OverviewPage {
  gain: OverviewPageItem;
  orders: OverviewPageItem;
}

export interface OverviewPageItem {
  percent: number;
  compare: number;
  yesterday: number;
  isHigher: boolean;
}
