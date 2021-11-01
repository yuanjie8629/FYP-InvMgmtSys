import {
  HiHome,
  HiShoppingBag,
  HiCube,
  HiClipboardList,
  HiTruck,
  HiUserGroup,
  HiChartSquareBar,
  HiTicket,
  HiUserCircle,
  HiIdentification,
  HiQuestionMarkCircle,
  HiLogout,
} from 'react-icons/hi';

const menuList = [
  {
    level: 1,
    items: [
      { key: '/dashboard', label: 'Dashboard', icon: HiHome },
      {
        key: '/product',
        label: 'Products',
        icon: HiShoppingBag,
        child: [
          { key: '/product/management', label: 'Manage Products' },
          { key: '/product/inventory', label: 'Product Inventory' },
          { key: '/product/add', label: 'Add Product' },
        ],
      },

      {
        key: '/package',
        label: 'Packages',
        icon: HiCube,
        child: [
          { key: '/package/management', label: 'Manage Packages' },
          { key: '/package/inventory', label: 'Package Inventory' },
          { key: '/package/add', label: 'Add Package' },
        ],
      },

      {
        key: '/order',
        label: 'Orders',
        icon: HiClipboardList,
        child: [
          { key: '/order/management', label: 'Manage Orders' },
          { key: '/order/pending', label: 'Pending Orders' },
          { key: '/order/add', label: 'Add Order' },
        ],
      },

      {
        key: '/shipment',
        label: 'Shipments',
        icon: HiTruck,
        child: [
          { key: '/shipment/management', label: 'Manage Shipments' },
          { key: '/shipment/shipping-fee', label: 'Manage Shipping Fees' },
        ],
      },

      {
        key: '/customer',
        label: 'Customers',
        icon: HiUserGroup,
        child: [
          { key: '/customer/management', label: 'Manage Customers' },
          { key: '/customer/registrations', label: 'Manage Registrations' },
          { key: '/customer/add', label: 'Add Customer' },
        ],
      },

      {
        key: '/business-insights',
        label: 'Business Insights',
        icon: HiChartSquareBar,
        child: [
          { key: '/business-insights/statistics', label: 'Statistics' },
          {
            key: '/business-insights/inventory-analysis',
            label: 'Inventory Analysis',
          },
        ],
      },

      {
        key: '/discount',
        label: 'Discounts',
        icon: HiTicket,
        child: [
          { key: '/discount/management', label: 'Manage Discounts' },
          { key: '/discount/add', label: 'Add Discount' },
        ],
      },
    ],
  },
  {
    level: 2,
    items: [
      {
        key: '/my-acc',
        label: 'My Account',
        icon: HiUserCircle,
        child: [
          { key: '/my-acc/profile-management', label: 'Manage Profile' },
          { key: '/my-acc/acc-settings', label: 'Account Settings' },
        ],
      },

      {
        key: '/admin',
        label: 'Admins',
        icon: HiIdentification,
        child: [
          { key: '/admin/management', label: 'Manage Admins' },
          { key: '/admin/add', label: 'Add Admin' },
        ],
      },
      { key: '/help', label: 'Help', icon: HiQuestionMarkCircle },
    ],
  },
  {
    level: 3,
    items: [{ key: '/', label: 'Logout', icon: HiLogout }],
  },
];

export default menuList;
