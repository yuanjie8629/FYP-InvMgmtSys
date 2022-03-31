const toDoList: {
  label: string;
  value: string;
  link: string;
}[] = [
  {
    label: 'Pending Order Shipments',
    value: 'order_shipment',
    link: '/order/management?status=toShip',
  },
  {
    label: 'Pending Order Pickup',
    value: 'order_pickup',
    link: '/order/management?status=toPick',
  },
  {
    label: 'Unpaid Orders',
    value: 'order_unpaid',
    link: '/order/management?status=unpaid',
  },
  {
    label: 'Out-of-Stock Products',
    value: 'product_oos',
    link: '/product/management?status=oos',
  },
  {
    label: 'Out-of-Stock Packages',
    value: 'package_oos',
    link: '/package/management?status=oos',
  },
  {
    label: 'Pending Agent Registration',
    value: 'agent_reg',
    link: '/customer/registration?type=agent&pending=true',
  },
  {
    label: 'Pending Dropshipper Registration',
    value: 'drpshpr_reg',
    link: '/customer/registration?type=drpshpr&pending=true',
  },
];

export default toDoList;
