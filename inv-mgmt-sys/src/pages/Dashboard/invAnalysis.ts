const invAnalysis: {
  key: string;
  prodNm: string;
  stock: number;
  ABC: string;
  HML: string;
  reorderPt: number;
  optimalOrderQty: number;
}[] = [
  {
    key: '1',
    prodNm: 'Kari Ayam',
    stock: 25,
    ABC: 'A',
    HML: 'L',
    reorderPt: 50,
    optimalOrderQty: 200,
  },
  {
    key: '2',
    prodNm: 'Sambal Ikan Bilis',
    stock: 75,
    ABC: 'B',
    HML: 'L',
    reorderPt: 30,
    optimalOrderQty: 300,
  },
  {
    key: '3',
    prodNm: 'Nasi Briyani Bukhari',
    stock: 120,
    ABC: 'A',
    HML: 'M',
    reorderPt: 45,
    optimalOrderQty: 200,
  },
  {
    key: '4',
    prodNm: 'Rendang Dendeng Daging',
    stock: 47,
    ABC: 'A',
    HML: 'H',
    reorderPt: 25,
    optimalOrderQty: 150,
  },
  {
    key: '5',
    prodNm: 'Pes Sambal Tumis',
    stock: 90,
    ABC: 'B',
    HML: 'L',
    reorderPt: 30,
    optimalOrderQty: 175,
  },
  {
    key: '6',
    prodNm: 'Pes Masakan Keruntuk',
    stock: 200,
    ABC: 'C',
    HML: 'L',
    reorderPt: 15,
    optimalOrderQty: 145,
        },
        {
            key: '7',
            prodNm: 'Pes Nasi Goreng Kampung',
            stock: 130,
            ABC: 'B',
            HML: 'M',
            reorderPt: 50,
            optimalOrderQty: 124,
          },
];

export default invAnalysis;
