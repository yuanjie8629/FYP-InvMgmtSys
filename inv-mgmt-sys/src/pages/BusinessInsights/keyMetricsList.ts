const keyMetricsList: {
  key: string;
  label: string;
  cat?: 'money' | 'percent';
  toFixed?: number;
}[] = [
  { key: 'sales', label: 'Sales', cat: 'money', toFixed: 2 },
  { key: 'revenue', label: 'Revenue', cat: 'money', toFixed: 2 },
  { key: 'conversionRt', label: 'Conversion Rate', cat:'percent' },
  { key: 'salesPerOrder', label: 'Sales per Order', cat: 'money', toFixed: 2 },
  { key: 'visitors', label: 'Visitors' },
  { key: 'buyers', label: 'Buyers' },
  { key: 'orders', label: 'Orders' },
  {
    key: 'avgOrderRev',
    label: 'Average Order Revenue',
    cat: 'money',
    toFixed: 2,
  },
  { key: 'unitSold', label: 'Unit Sold' },
  { key: 'avgBktSize', label: 'Average Basket Size' },
];

export default keyMetricsList;
