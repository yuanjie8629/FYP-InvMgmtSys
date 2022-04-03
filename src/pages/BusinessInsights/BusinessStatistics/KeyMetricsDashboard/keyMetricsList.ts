import { KeyMetricsType } from "@api/services/analysisAPI";

const keyMetricsList: {
  key: KeyMetricsType;
  label: string;
  desc: string;
  cat?: 'money' | 'percent';
  toFixed?: number;
}[] = [
  {
    key: 'sales',
    label: 'Sales',
    desc: 'Total value of placed orders over the selected time period, excluding the unpaid and cancelled orders.',
    cat: 'money',
    toFixed: 2,
  },
  {
    key: 'profit',
    label: 'Profit',
    desc: 'Total value of placed orders after deducting the cost per units of the order items, excluding the unpaid and cancelled orders',
    cat: 'money',
    toFixed: 2,
  },
  {
    key: 'orders',
    label: 'Orders',
    desc: 'Total number of orders placed over the selected period.',
  },
  {
    key: 'customers',
    label: 'Customers',
    desc: 'Total number of new registered customers over the selected period.',
  },
  {
    key: 'buyers',
    label: 'Buyers',
    desc: 'Total number of unique buyers who placed new orders over the selected period.',
  },
  {
    key: 'avg_order_value',
    label: 'Average Order Value',
    cat: 'money',
    desc: 'Average sales per order over the selected period.',
    toFixed: 2,
  },
  {
    key: 'units_sold',
    label: 'Units Sold',
    desc: 'Total unit solds of items over the selected period.',
  },
  {
    key: 'avg_basket_size',
    label: 'Average Basket Size',
    desc: 'Average of the item unit sold per order over the selected period.',
    toFixed: 2,
  },
];

export default keyMetricsList;
