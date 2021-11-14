const toDoList: {
  label: string;
  quantity: number;
  link: string;
}[] = [
  {
    label: 'Pending Orders',
    quantity: 5,
    link: 'orderPend',
  },
  {
    label: 'Unpaid Orders',
    quantity: 3,
    link: 'orderUnpaid',
  },
  {
    label: 'Pending Return/Refund',
    quantity: 0,
    link: 'orderRefund',
  },
  {
    label: 'Out-of-Stock Products',
    quantity: 0,
    link: 'prodMgmt',
  },
  {
    label: 'Out-of-Stock Packages',
    quantity: 0,
    link: 'packMgmt',
  },
  {
    label: 'Pending Agent Registration',
    quantity: 3,
    link: 'custReg',
  },
  {
    label: 'Pending Dropshipper Registration',
    quantity: 1,
    link: 'custReg',
  },
];

export default toDoList;
