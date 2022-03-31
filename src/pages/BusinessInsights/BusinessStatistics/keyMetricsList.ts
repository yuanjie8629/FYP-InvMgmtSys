const keyMetricsList: {
  key: string;
  label: string;
  desc: string;
  cat?: 'money' | 'percent';
  toFixed?: number;
}[] = [
  {
    key: 'sales',
    label: 'Sales',
    desc: 'Total value of placed orders over the selected time period, including the cancelled orders.',
    cat: 'money',
    toFixed: 2,
  },
  {
    key: 'profit',
    label: 'Profit',
    desc: '',
    cat: 'money',
    toFixed: 2,
  },
  { key: 'orders', label: 'Orders', desc: '' },
  { key: 'visitors', label: 'Visitors', desc: '' },
  { key: 'buyers', label: 'Buyers', desc: '' },
  {
    key: 'conversionRt',
    label: 'Conversion Rate',
    cat: 'percent',
    desc: '',
  },
  {
    key: 'salesPerOrder',
    label: 'Sales per Order',
    cat: 'money',
    desc: 'Average value of a single placed order over selected time period. Total sales divided by the total number of orders.',
    toFixed: 2,
  },
  {
    key: 'avgOrderRev',
    label: 'Average Order Revenue',
    cat: 'money',
    desc: '',
    toFixed: 2,
  },
  { key: 'unitSold', label: 'Unit Sold', desc: '' },
  { key: 'avgBktSize', label: 'Average Basket Size', desc: '' },
];

export default keyMetricsList;
