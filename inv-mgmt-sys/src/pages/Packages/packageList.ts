import PromoRayaQurban from '@assets/Product/PromoRayaQurban.png';
import hashtag from '@assets/Login/Hashtag.svg';
const packageList = [
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
    packStatus: 'expired',
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
    packStatus: 'scheduled',
  },
];

export default packageList;
