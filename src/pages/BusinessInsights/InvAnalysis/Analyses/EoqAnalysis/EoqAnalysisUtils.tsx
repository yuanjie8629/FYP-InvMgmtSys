import { DescIcon } from "../../Icons";

const eoqDesc = {
  header: 'EOQ analysis evaluates the products based on sales per month.',
  content: [
    {
      key: 'info',
      title: 'Info',
      desc: 'EOQ stands for Economic Order Quantity. It is the ideal order quantity a company should purchase to minimize inventory costs.',
      icon: <DescIcon type='info' />,
    },
    {
      key: 'purpose',
      title: 'Purpose',
      desc: 'The purpose of EOQ analysis to minimise the ordering and carrying costs incurred in inventory.',
      icon: <DescIcon type='purpose' />,
    },
    {
      key: 'benefits',
      title: 'Benefits',
      desc: 'By using EOQ analysis, we can identify the optimum amount of items to be ordered.',
      icon: <DescIcon type='benefits' />,
    },
  ],
};

const eoqComponent = {
  header: 'Components of EOQ Analysis',
  content: [
    {
      key: 'orderCost',
      label: 'Ordering/Reorder Cost',
      desc: 'Cost when reordering the product',
      prodList: ['Sambal Ikan Bilis', 'Pes Mi Goreng'],
    },
    {
      key: 'carryCost',
      label: 'Carrying/Holding Cost',
      desc: 'Cost for holding inventory in stock',
      prodList: [],
    },
  ],
};

const eoqUtils = {
  desc: eoqDesc,
  component: eoqComponent,
};

export default eoqUtils