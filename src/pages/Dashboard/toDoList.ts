const toDoList: {
  label: string;
  quantity: number;
  link: string;
}[] = [
  {
    label: 'Pending Orders',
    quantity: 5,
    link: '/order/management?status=toShip',
  },
  {
    label: 'Unpaid Orders',
    quantity: 3,
    link: '/order/management?status=unpaid',
  },
  {
    label: 'Pending Cancellation',
    quantity: 0,
    link: '/order/management?status=cancel',
  },
  {
    label: 'Out-of-Stock Products',
    quantity: 0,
    link: '/product/management?status=oos',
  },
  {
    label: 'Out-of-Stock Packages',
    quantity: 0,
    link: '/package/management?status=oos',
  },
  {
    label: 'Pending Agent Registration',
    quantity: 3,
    link: 'customer/registrations',
  },
  {
    label: 'Pending Dropshipper Registration',
    quantity: 1,
    link: 'customer/registrations',
  },
];

export default toDoList;
