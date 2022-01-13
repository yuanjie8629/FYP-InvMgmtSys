const discList: {
  key: string;
  custID: string;
  custNm: string;
  custType: 'agent' | 'drpshpr' | 'cust';
  regDt: string;
  salesMth?: number;
  lastOrderDt: string;
  status: 'active' | 'suspended';
}[] = [
  {
    key: '1',
    custID: 'AGT-12346',
    custNm: 'Tan Yuan Jie',
    custType: 'agent',
    regDt: 'Aug 16, 2020',
    salesMth: 3260,
    lastOrderDt: '23-08-2021 14:30',
    status: 'active',
  },
  {
    key: '2',
    custID: 'DC-54663',
    custNm: 'Nur Nuraliah binti Haiqal',
    custType: 'cust',
    regDt: 'Jan 03, 2021',
    lastOrderDt: '23-08-2021 12:41',
    status: 'active',
  },
  {
    key: '3',
    custID: 'DC-46626',
    custNm: 'Jong Cai Tien',
    custType: 'cust',
    regDt: 'April 15, 2021',
    lastOrderDt: '23-08-2021 09:21',
    status: 'active',
  },
  {
    key: '4',
    custID: 'DS-14153',
    custNm: 'Mohammed Yusni bin Ayyadi',
    custType: 'drpshpr',
    regDt: 'Dec 22, 2019',
    salesMth: 4500.5,
    lastOrderDt: '22-08-2021 21:06',
    status: 'suspended',
  },
  {
    key: '5',
    custID: 'AGT-53531',
    custNm: 'Huzaifi Hafizh bin Zaidi',
    custType: 'agent',
    regDt: 'Sep 26, 2020',
    salesMth: 2600,
    lastOrderDt: '22-08-2021 19:34',
    status: 'active',
  },
  {
    key: '6',
    custID: 'DC-35354',
    custNm: 'Steven Tan',
    custType: 'cust',
    regDt: 'Oct 01, 2020',
    lastOrderDt: '21-08-2021 17:32',
    status: 'active',
  },
  {
    key: '7',
    custID: 'DC-92542',
    custNm: 'Kar Ming Xiu',
    custType: 'cust',
    regDt: 'Feb 13, 2021',
    lastOrderDt: '21-08-2021 15:30',
    status: 'active',
  },
  {
    key: '8',
    custID: 'DS-12454',
    custNm: 'Shoba Bhullar a/l Darma Raja',
    custType: 'drpshpr',
    regDt: 'Aug 21, 2021',
    salesMth: 360,
    lastOrderDt: '21-08-2021 12:01',
    status: 'active',
  },
  {
    key: '9',
    custID: 'AGT-12425',
    custNm: 'Mohd Ramli Zulkefli bin Nik Bakri',
    custType: 'agent',
    regDt: 'July 30, 2021',
    salesMth: 240,
    lastOrderDt: '20-08-2021 18:00',
    status: 'active',
  },
  {
    key: '10',
    custID: 'DC-98124',
    custNm: 'Nur Khaliesah binti Yussof',
    custType: 'cust',
    regDt: 'Aug 20, 2021',
    lastOrderDt: '20-08-2021 13:00',
    status: 'active',
  },
];

export default discList;
