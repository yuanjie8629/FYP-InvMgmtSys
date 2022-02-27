import PromoRayaQurban from '@assets/Product/PromoRayaQurban.png';
import hashtag from '@assets/Login/Hashtag.svg';
const packageList: {
  key: string;
  packNm: string;
  packProds: {
    prodNm: string;
    quantity: number;
  }[];
  packSKU: string;
  packImg: string;
  packPrice: number;
  packStock: number;
  packStat: 'active' | 'oos' | 'scheduled' | 'expired' | 'hidden';
}[] = [
  {
    key: '1',
    packNm: 'Promo Raya Qurban',
    packProds: [
      { prodNm: 'Rendang Dengeng Daging', quantity: 5 },
      { prodNm: 'test', quantity: 6 },
    ],
    packSKU: 'SHRF-RTC-NBB',
    packImg: PromoRayaQurban,
    packPrice: 50,
    packStock: 50,
    packStat: 'active',
  },
  {
    key: '2',
    packNm: 'Hashtag',
    packProds: [
      { prodNm: 'Paste', quantity: 7 },
      { prodNm: 'testing', quantity: 10 },
    ],
    packSKU: 'SHRF-RTC-NBB',
    packImg: hashtag,
    packPrice: 100.2,
    packStock: 210,
    packStat: 'expired',
  },
];

export default packageList;
