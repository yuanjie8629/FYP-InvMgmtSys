const topProduct: {
  date: string;
  type: 'sales' | 'units';
  items: {
    label: string;
    cat?: string;
    value: number;
  }[];
} = {
  date: '2021 August',
  type: 'sales',
  items: [
    {
      label: 'Kari Ayam',
      cat: 'Ready-To-Eat',
      value: 80,
    },
    {
      label: 'Sambal Ikan Bilis',
      cat: 'Ready-To-Eat',
      value: 54,
    },
    {
      label: 'Nasi Briyani Bukhari',
      cat: 'Ready-To-Cook',
      value: 47,
    },
    {
      label: 'Rendang Dendeng Daging',
      cat: 'Ready-To-Eat',
      value: 53,
    },
    {
      label: 'Pes Sambal Tumis',
      cat: 'Paste',
      value: 38,
    },
    {
      label: 'Pes Masakan Kerutuk',
      cat: 'Paste',
      value: 22,
    },
  ],
};

export default topProduct;
