const orderList: {
  key: string;
  orderID: number;
  custNm: string;
  custType: 'agent' | 'drpshpr' | 'cust';
  orderTm: string;
  trackNum?: string;
  orderAmt: number;
  orderStat: 'completed' | 'unpaid' | 'cancel' | 'toShip' | 'shipping';
}[] = [
  {
    key: '1',
    orderID: 2908724,
    custNm: 'Tan Yuan Jie',
    custType: 'agent',
    orderTm: '23-08-2021 14:30',
    orderAmt: 60,
    orderStat: 'toShip',
  },
  {
    key: '2',
    orderID: 1659883,
    custNm: 'Nur Nuraliah binti Haiqal',
    custType: 'cust',
    orderTm: '23-08-2021 12:41',
    orderAmt: 120,
    orderStat: 'toShip',
  },
  {
    key: '3',
    orderID: 7156802,
    custNm: 'Jong Cai Tien',
    custType: 'cust',
    orderTm: '23-08-2021 09:21',
    trackNum: 'PL054981244515',
    orderAmt: 32,
    orderStat: 'shipping',
  },
  {
    key: '4',
    orderID: 1605044,
    custNm: 'Mohammed Yusni bin Ayyadi',
    custType: 'drpshpr',
    orderTm: '22-08-2021 21:06',
    trackNum: 'PL124994664623',
    orderAmt: 88.2,
    orderStat: 'shipping',
  },
  {
    key: '5',
    orderID: 1487160,
    custNm: 'Huzaifi Hafizh bin Zaidi',
    custType: 'agent',
    orderTm: '22-08-2021 19:34',
    trackNum: 'PL124994664623',
    orderAmt: 88.2,
    orderStat: 'shipping',
  },
  {
    key: '6',
    orderID: 7698033,
    custNm: 'Steven Tan',
    custType: 'cust',
    orderTm: '21-08-2021 17:32',
    orderAmt: 164.5,
    orderStat: 'cancel',
  },
  {
    key: '7',
    orderID: 2741131,
    custNm: 'Kar Ming Xiu',
    custType: 'cust',
    orderTm: '21-08-2021 15:30',
    trackNum: 'PL259637281293',
    orderAmt: 50,
    orderStat: 'completed',
  },
  {
    key: '8',
    orderID: 5943806,
    custNm: 'Shoba Bhullar a/l Darma Raja',
    custType: 'drpshpr',
    orderTm: '21-08-2021 12:01',
    trackNum: 'PL568920594212',
    orderAmt: 360,
    orderStat: 'completed',
  },
  {
    key: '9',
    orderID: 5166945,
    custNm: 'Mohd Ramli Zulkefli bin Nik Bakri',
    custType: 'agent',
    orderTm: '20-08-2021 18:00',
    trackNum: 'PL654623442345',
    orderAmt: 240,
    orderStat: 'completed',
  },
  {
    key: '10',
    orderID: 9851040,
    custNm: 'Nur Khaliesah binti Yussof',
    custType: 'cust',
    orderTm: '20-08-2021 13:00',
    trackNum: 'PL098946552414',
    orderAmt: 45,
    orderStat: 'completed',
  },
];

export default orderList;
