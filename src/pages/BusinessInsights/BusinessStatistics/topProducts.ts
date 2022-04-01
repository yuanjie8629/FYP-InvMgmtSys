const topProduct: {
  type: 'sales' | 'units';
  items: {
    name: string;
    category?: string;
    value: number;
  }[];
} = {
  type: 'sales',
  items: [
    {
      name: 'Kari Ayam',
      category: 'Ready-To-Eat',
      value: 80,
    },
    {
      name: 'Sambal Ikan Bilis',
      category: 'Ready-To-Eat',
      value: 54,
    },
    {
      name: 'Nasi Briyani Bukhari',
      category: 'Ready-To-Cook',
      value: 47,
    },
    {
      name: 'Rendang Dendeng Daging',
      category: 'Ready-To-Eat',
      value: 53,
    },
    {
      name: 'Pes Sambal Tumis',
      category: 'Paste',
      value: 38,
    },
    {
      name: 'Pes Masakan Kerutuk',
      category: 'Paste',
      value: 22,
    },
  ],
};

export default topProduct;
