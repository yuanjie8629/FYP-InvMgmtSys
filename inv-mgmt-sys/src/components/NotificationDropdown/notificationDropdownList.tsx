const menuList: {
  cat: string;
  status: 'success' | 'error' | 'processing' | 'default' | 'warning';
  title: string;
  description: JSX.Element;
  timestamp: string;
  read: boolean;
}[] = [
  {
    cat: 'order',
    status: 'success',
    title: 'New Order',
    description: (
      <>
        <p>
          <span>Tan Yuan Jie has placed new order!</span>
        </p>
        <p>
          <span>Please proceed with his order.</span>
        </p>
      </>
    ),
    timestamp: '08-11-2021 16:00',
    read: false,
  },
  {
    cat: 'product',
    status: 'error',
    title: 'Low Stock',
    description: (
      <>
        <p>
          <span>Kari Ayam is currently in low stock.</span>
        </p>
        <p>
          <span>Please consider restocking it.</span>
        </p>
      </>
    ),
    timestamp: '07-11-2021 18:00',
    read: true,
    },
    {
      cat: 'product',
      status: 'error',
      title: 'Low Stock',
      description: (
        <>
          <p>
            <span>Kari Ayam is currently in low stock.</span>
          </p>
          <p>
            <span>Please consider restocking it.</span>
          </p>
        </>
      ),
      timestamp: '07-11-2021 18:00',
      read: true,
    },
    {
      cat: 'product',
      status: 'error',
      title: 'Low Stock',
      description: (
        <>
          <p>
            <span>Kari Ayam is currently in low stock.</span>
          </p>
          <p>
            <span>Please consider restocking it.</span>
          </p>
        </>
      ),
      timestamp: '07-11-2021 18:00',
      read: true,
    },
    {
      cat: 'product',
      status: 'error',
      title: 'Low Stock',
      description: (
        <>
          <p>
            <span>Kari Ayam is currently in low stock.</span>
          </p>
          <p>
            <span>Please consider restocking it.</span>
          </p>
        </>
      ),
      timestamp: '07-11-2021 18:00',
      read: true,
    },
    {
      cat: 'product',
      status: 'error',
      title: 'Low Stock',
      description: (
        <>
          <p>
            <span>Kari Ayam is currently in low stock.</span>
          </p>
          <p>
            <span>Please consider restocking it.</span>
          </p>
        </>
      ),
      timestamp: '07-11-2021 18:00',
      read: true,
    },
];

export default menuList;
