  const topProduct: {
  date: string;
  type: 'sales' | 'units';
  items: {
    itemNm: string;
    itemCat?: string;
    value: number;
  }[];
} = {
  date: '2021 August',
  type: 'sales',
  items: [
    {
      itemNm: 'Kari Ayam',
      itemCat: 'Ready-To-Eat',
      value: 80,
    },
    {
      itemNm: 'Sambal Ikan Bilis',
      itemCat: 'Ready-To-Eat',
      value: 54,
    },
    {
      itemNm: 'Nasi Briyani Bukhari',
      itemCat: 'Ready-To-Cook',
      value: 47,
    },
    {
      itemNm: 'Rendang Dendeng Daging',
      itemCat: 'Ready-To-Eat',
      value: 53,
    },
    {
      itemNm: 'Pes Sambal Tumis',
      itemCat: 'Paste',
      value: 38,
    },
    {
      itemNm: 'Pes Masakan Kerutuk',
      itemCat: 'Paste',
      value: 22,
    },
  ],
};

export default topProduct;
