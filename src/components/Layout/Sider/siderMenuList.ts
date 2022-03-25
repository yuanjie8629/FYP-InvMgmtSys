import { IconType } from 'react-icons';
import {
  MdHome,
  MdShoppingBag,
  MdAssignment,
  MdLocalShipping,
  MdGroups,
  MdInsertChart,
  MdConfirmationNumber,
  MdAccountCircle,
  MdAssignmentInd,
  MdHelp,
  MdInventory,
  MdLogout,
} from 'react-icons/md';

const menuList: {
  level: number;
  items: {
    key: string;
    label: string;
    icon: IconType;
    child?: {
      key: string;
      label: string;
    }[];
  }[];
}[] = [
  {
    level: 1,
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: MdHome },
      {
        key: 'product',
        label: 'Products',
        icon: MdShoppingBag,
        child: [
          { key: 'prodMgmt', label: 'Manage Products' },
          { key: 'prodInv', label: 'Product Inventory' },
          { key: 'prodAdd', label: 'Add Product' },
        ],
      },

      {
        key: 'package',
        label: 'Packages',
        icon: MdInventory,
        child: [
          { key: 'packMgmt', label: 'Manage Packages' },
          { key: 'packInv', label: 'Package Inventory' },
          { key: 'packAdd', label: 'Add Package' },
        ],
      },

      {
        key: 'order',
        label: 'Orders',
        icon: MdAssignment,
        child: [
          { key: 'orderMgmt', label: 'Manage Orders' },
          { key: 'orderAdd', label: 'Add Order' },
        ],
      },

      {
        key: 'shipment',
        label: 'Shipments',
        icon: MdLocalShipping,
        child: [
          { key: 'shptMgmt', label: 'Manage Shipments' },
          { key: 'shptFeeMgmt', label: 'Manage Shipping Fees' },
          { key: 'pickupMgmt', label: 'Manage Pickup Loc' },
          { key: 'shptFeeAdd', label: 'Add Shipping Fees' },
          { key: 'pickupAdd', label: 'Add Pickup Loc' },
        ],
      },

      {
        key: 'customer',
        label: 'Customers',
        icon: MdGroups,
        child: [
          { key: 'custMgmt', label: 'Manage Customers' },
          { key: 'custReg', label: 'Manage Registrations' },
          { key: 'custAdd', label: 'Add Customer' },
        ],
      },

      {
        key: 'business_insights',
        label: 'Business Insights',
        icon: MdInsertChart,
        child: [
          { key: 'bizStatistics', label: 'Statistics' },
          {
            key: 'invAnalysis',
            label: 'Inventory Analysis',
          },
        ],
      },

      {
        key: 'voucher',
        label: 'Vouchers',
        icon: MdConfirmationNumber,
        child: [
          { key: 'voucherMgmt', label: 'Manage Vouchers' },
          { key: 'voucherAdd', label: 'Add Voucher' },
        ],
      },
    ],
  },
  {
    level: 2,
    items: [
      {
        key: 'my_acc',
        label: 'My Account',
        icon: MdAccountCircle,
        child: [
          { key: 'profileMgmt', label: 'Manage Profile' },
          { key: 'accSettings', label: 'Account Settings' },
        ],
      },
      {
        key: 'admin',
        label: 'Admins',
        icon: MdAssignmentInd,
        child: [
          { key: 'adminMgmt', label: 'Manage Admins' },
          { key: 'adminAdd', label: 'Add Admin' },
        ],
      },
      { key: 'help', label: 'Help', icon: MdHelp },
    ],
  },
  {
    level: 3,
    items: [{ key: 'logout', label: 'Logout', icon: MdLogout }],
  },
];

export default menuList;
