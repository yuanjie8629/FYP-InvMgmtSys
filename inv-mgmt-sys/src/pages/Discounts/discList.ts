const discList: {
  key: string;
  discCde: string;
  discType: 'amount' | 'percentage';
  discAmt: number;
  minSpend?: number;
  maxDisc?: number;
  custType: ('agent' | 'drpshpr' | 'cust')[];
  availability: number | 'infinite';
  usageLimit?: number;
  autoApply?: boolean;
  startTm: string;
  endTm?: string;
  status: 'active' | 'hidden' | 'scheduled' | 'expired';
}[] = [
  {
    key: '1',
    discCde: 'shrfagent',
    discType: 'percentage',
    discAmt: 0.3,
    minSpend: 150,
    custType: ['agent'],
    availability: 'infinite',
    autoApply: true,
    startTm: '01-01-2018 00:00',
    status: 'active',
  },
  {
    key: '2',
    discCde: 'shrfdropship',
    discType: 'percentage',
    discAmt: 0.2,
    minSpend: 150,
    custType: ['drpshpr'],
    availability: 'infinite',
    autoApply: true,
    startTm: '01-01-2018 00:00',
    status: 'active',
  },
  {
    key: '3',
    discCde: 'merdeka64',
    discType: 'amount',
    discAmt: 10,
    minSpend: 50,
    maxDisc: 10,
    custType: ['cust', 'agent', 'drpshpr'],
    availability: 200,
    startTm: '15-09-2021 00:00',
    endTm: '01-09-2021 23:59',
    status: 'hidden',
    usageLimit: 3,
  },
];

export default discList;
