const recentOrders = {
  data: [
    {
      key: '1',
      orderID: '#2908724',
      custName: 'Tan Yuan Jie',
      custType: 'Agent',
      orderTime: '23-08-2021 14:30',
      amount: 'RM60.00',
      status: 'packed',
    },
    {
      key: '2',
      orderID: '#1659883',
      custName: 'Nur Nuraliah binti Haiqal',
      custType: 'Direct Customer',
      orderTime: '23-08-2021 12:41',
      amount: 'RM120.00',
      status: 'packed',
    },
    {
      key: '3',
      orderID: '#7156802',
      custName: 'Jong Cai Tien',
      custType: 'Direct Customer',
      orderTime: '23-08-2021 09:21',
      amount: 'RM32.00',
      status: 'shipped',
    },
    {
      key: '4',
      orderID: '#1605044',
      custName: 'Mohammed Yusni bin Ayyadi',
      custType: 'Dropshipper',
      orderTime: '22-08-2021 21:06',
      amount: 'RM88.20',
      status: 'shipped',
    },
    {
      key: '5',
      orderID: '#1487160',
      custName: 'Huzaifi Hafizh bin Zaidi',
      custType: 'Agent',
      orderTime: '22-08-2021 19:34',
      amount: 'RM29.90',
      status: 'completed',
    },
    {
      key: '6',
      orderID: '#7698033',
      custName: 'Steven Tan',
      custType: 'Direct Customer',
      orderTime: '21-08-2021 17:32',
      amount: 'RM164.50',
      status: 'return',
    },
  ],
  columns: [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
    },
    {
      title: 'Customer Name',
      dataIndex: 'custName',
      key: 'custName',
    },
    {
      title: 'Customer Type',
      dataIndex: 'custType',
      key: 'custType',
    },
    {
      title: 'Order Time',
      dataIndex: 'orderTime',
      key: 'orderTime',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ],
};

export default recentOrders;
