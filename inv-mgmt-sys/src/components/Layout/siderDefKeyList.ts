const siderDefKeyList: {
  path: string;
  key: string;
}[] = [
  {
    path: '/order/management?stat=toShip',
    key: 'orderPend',
  },
  {
    path: '/order/management?stat=cancel',
    key: 'orderCancel',
  },
];

export default siderDefKeyList;
