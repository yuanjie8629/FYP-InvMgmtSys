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
    packStatus: 'active',
  },
  {
    key: '2',
    packNm: 'Nasi B234124 Bukhari',
    packSKU: 'SHRF-RTC-NBB',
    packImg: hashtag,
    packPrice: 17.6,
    packStock: 120,
    packStatus: 'oos',
  },
];

export default packageList;
