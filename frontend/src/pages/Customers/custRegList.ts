const custRegList: {
  key: string;
  regID: string;
  applicant: string;
  custType: 'agent' | 'drpshpr';
  gender: 'm' | 'f';
  regDt: string;
  contactNum: string;
}[] = [
  {
    key: '1',
    regID: 'R-AGT-24845',
    applicant: 'Nik Irfan Jelani bin Hammani',
    custType: 'agent',
    gender: 'm',
    regDt: 'Aug 22 ,2021',
    contactNum: '012-4567783',
  },
  {
    key: '2',
    regID: 'R-DS-52640',
    applicant: 'Rabiatul binti Hasnan',
    custType: 'drpshpr',
    gender: 'f',
    regDt: 'Aug 21 ,2021',
    contactNum: '011-8721245',
  },
  {
    key: '3',
    regID: 'R-AGT-84449',
    applicant: 'Tse Cho Fan',
    custType: 'agent',
    gender: 'f',
    regDt: 'Aug 21 ,2021',
    contactNum: '016-2215653',
  },
  {
    key: '4',
    regID: 'R-AGT-93651',
    applicant: 'Priya Vadiveloo a/l Sasikumar Pereira',
    custType: 'agent',
    gender: 'f',
    regDt: 'Aug 20 ,2021',
    contactNum: '018-2241234',
  },
];

export default custRegList;
