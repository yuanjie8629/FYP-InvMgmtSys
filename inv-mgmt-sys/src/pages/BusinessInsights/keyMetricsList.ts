const keyMetricsList: {
  key: string;
  label: string;
  prefix?: string;
  suffix?: string;
}[] = [
  { key: 'sales', label: 'Sales', prefix: 'RM' },
  { key: 'revenue', label: 'Revenue', prefix: 'RM' },
  { key: 'conversionRt', label: 'Conversion Rate', suffix: '%' },
  { key: 'salesPerOrder', label: 'Sales per Order', prefix: 'RM' },
  { key: 'visitors', label: 'Visitors' },
  { key: 'buyers', label: 'Buyers' },
  { key: 'orders', label: 'Orders' },
  { key: 'avgOrderRev', label: 'Average Order Revenue', prefix: 'RM' },
  { key: 'unitSold', label: 'Unit Sold' },
  { key: 'avgBktSize', label: 'Average Basket Size' },
];

export default keyMetricsList;
