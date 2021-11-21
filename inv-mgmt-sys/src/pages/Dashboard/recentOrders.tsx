const recentOrders: {
  key: string;
  orderID: string;
  custName: string;
  custType: string;
  orderTime: string;
  amount: number;
  status: string;
}[] = [
  {
    key: '1',
    orderID: '#2908724',
    custName: 'Tan Yuan Jie',
    custType: 'Agent',
    orderTime: '23-08-2021 14:30',
    amount: 60.0,
    status: 'packed',
  },
  {
    key: '2',
    orderID: '#1659883',
    custName: 'Nur Nuraliah binti Haiqal',
    custType: 'Direct Customer',
    orderTime: '23-08-2021 12:41',
    amount: 120.0,
    status: 'packed',
  },
  {
    key: '3',
    orderID: '#7156802',
    custName: 'Jong Cai Tien',
    custType: 'Direct Customer',
    orderTime: '23-08-2021 09:21',
    amount: 32.0,
    status: 'shipped',
  },
  {
    key: '4',
    orderID: '#1605044',
    custName: 'Mohammed Yusni bin Ayyadi',
    custType: 'Dropshipper',
    orderTime: '22-08-2021 21:06',
    amount: 88.2,
    status: 'shipped',
  },
  {
    key: '5',
    orderID: '#1487160',
    custName: 'Huzaifi Hafizh bin Zaidi',
    custType: 'Agent',
    orderTime: '22-08-2021 19:34',
    amount: 29.9,
    status: 'completed',
  },
  {
    key: '6',
    orderID: '#7698033',
    custName: 'Steven Tan',
    custType: 'Direct Customer',
    orderTime: '21-08-2021 17:32',
    amount: 164.5,
    status: 'return',
  },
];

export default recentOrders;
