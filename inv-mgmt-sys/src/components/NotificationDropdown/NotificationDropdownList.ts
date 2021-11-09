const menuList: {
  cat: string;
  status: 'success' | 'error' | 'processing' | 'default' | 'warning';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}[] = [
  {
    cat: 'order',
    status: 'success',
    title: 'New Order',
    description:
      'Tan Yuan Jie has placed new order!\nPlease proceed his order.',
    timestamp: '08-11-2021 16:00',
    read: false,
  },
  {
    cat: 'product',
    status: 'error',
    title: 'Low Stock',
    description:
      'Kari Ayam is currently in low stock.\nPlease consider restocking it.',
    timestamp: '07-11-2021 18:00',
    read: true,
  },
];

export default menuList;
