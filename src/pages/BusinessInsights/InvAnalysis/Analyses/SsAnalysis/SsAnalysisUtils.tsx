import { DescIcon } from '../../Icons';

const ssDesc = {
  header:
    'Safety Stock analysis evaluates the products based on sales per month.',
  content: [
    {
      key: 'info',
      title: 'Info',
      desc: 'Safety stock is the additional quantity of a product to be stored in the inventory.',
      icon: <DescIcon type='info' />,
    },
    {
      key: 'purpose',
      title: 'Purpose',
      desc: 'The purpose of Safety Stock analysis to prevent an out-of-stock situation. ',
      icon: <DescIcon type='purpose' />,
    },
    {
      key: 'benefits',
      title: 'Benefits',
      desc: 'By using Safety Stock analysis, we can identify the number of reserved stock and reorder point.',
      icon: <DescIcon type='benefits' />,
    },
  ],
};

const ssComponent = {
  header: 'Components of Safety Stock Analysis',
  content: [
    {
      key: 'max_lead_tm',
      label: 'Maximum Lead Time',
      desc: 'Maximum number of days it takes to receive the product once you place a new order',
    },
    {
      key: 'avg_lead_tm',
      label: 'Average Lead Time',
      desc: 'Average number of days it takes to receive the product once you place a new order',
    },
  ],
};

const ssUtils = {
  desc: ssDesc,
  component: ssComponent,
  tableScroll: 1500,
};

export default ssUtils;
