const siderDefKeyList: {
  path: string;
  key: string;
}[] = [
  {
    path: '/order/management?status=toShip',
    key: 'orderPend',
  },
  {
    path: '/order/management?status=cancel',
    key: 'orderCancel',
  },
];

export default siderDefKeyList;
