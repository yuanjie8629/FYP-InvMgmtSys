import Login from '@pages/Login/Login';
import Dashboard from '@pages/Dashboard/Dashboard';
import ProdMgmt from '@pages/Products/ProdMgmt';
import ProdInv from '@pages/Products/ProdInv';
import ProdAdd from '@pages/Products/ProdAdd';
import PackMgmt from '@pages/Packages/PackMgmt';
import PackInv from '@pages/Packages/PackInv';
import PackAdd from '@pages/Packages/PackAdd';
import OrderMgmt from '@pages/Orders/OrderMgmt';
import OrderAdd from '@pages/Orders/OrderAdd';
import ShptMgmt from '@pages/Shipments/ShptMgmt';
import CustMgmt from '@pages/Customers/CustMgmt';
import CustReg from '@pages/Customers/CustReg';
import CustAdd from '@pages/Customers/CustAdd';
import Statistics from '@pages/BusinessInsights/BusinessStatistics';
import InvAnalysis from '@pages/BusinessInsights/InvAnalysis';
import VoucherMgmt from '@pages/Vouchers/VoucherMgmt';
import VoucherAdd from '@pages/Vouchers/VoucherAdd';
import ProfileMgmt from '@pages/MyAccount/ProfileMgmt';
import AccSettings from '@pages/MyAccount/AccSettings';
import AdminMgmt from '@pages/Admins/AdminMgmt';
import AdminAdd from '@pages/Admins/AdminAdd';
import Help from '@pages/Help/Help';
import ShpFeeMgmt from '@pages/Shipments/ShptFeeMgmt';
import NotFound from '@pages/Not Found/NotFound';

const routeList: {
  label: string;
  path: string;
  component?: JSX.Element;
}[] = [
  {
    label: 'notFound',
    path: '/404',
    component: <NotFound />,
  },
  {
    label: 'login',
    path: '/login',
    component: <Login />,
  },
  {
    label: 'dashboard',
    path: '/dashboard',
    component: <Dashboard />,
  },
  {
    label: 'product',
    path: '/product',
  },
  {
    label: 'prodMgmt',
    path: '/product/management',
    component: <ProdMgmt />,
  },
  {
    label: 'prodInv',
    path: '/product/inventory',
    component: <ProdInv />,
  },
  {
    label: 'prodAdd',
    path: '/product/add',
    component: <ProdAdd />,
  },
  {
    label: 'package',
    path: '/package',
  },
  {
    label: 'packMgmt',
    path: '/package/management',
    component: <PackMgmt />,
  },
  {
    label: 'packInv',
    path: '/package/inventory',
    component: <PackInv />,
  },
  {
    label: 'packAdd',
    path: '/package/add',
    component: <PackAdd />,
  },
  {
    label: 'order',
    path: '/order',
  },
  {
    label: 'orderMgmt',
    path: '/order/management',
    component: <OrderMgmt />,
  },
  {
    label: 'orderPend',
    path: '/order/management?stat=toShip',
    },
    {
      label: 'orderCancel',
      path: '/order/management?stat=cancel',
    },
  {
    label: 'orderAdd',
    path: '/order/add',
    component: <OrderAdd />,
  },
  {
    label: 'orderUnpaid',
    path: '/order/management?unpaid',
  },
  {
    label: 'orderRefund',
    path: '/order/management?refund',
  },
  {
    label: 'shipment',
    path: '/shipment',
  },
  {
    label: 'shptMgmt',
    path: '/shipment/management',
    component: <ShptMgmt />,
  },
  {
    label: 'shpFeeMgmt',
    path: '/shipment/shipping-fee',
    component: <ShpFeeMgmt />,
  },
  {
    label: 'customer',
    path: '/customer',
  },
  {
    label: 'custMgmt',
    path: '/customer/management',
    component: <CustMgmt />,
  },
  {
    label: 'custReg',
    path: '/customer/registrations',
    component: <CustReg />,
  },
  {
    label: 'custAdd',
    path: '/customer/add',
    component: <CustAdd />,
  },
  {
    label: 'bizInsights',
    path: '/business-insights',
  },
  {
    label: 'bizStatistics',
    path: '/business-insights/statistics',
    component: <Statistics />,
  },
  {
    label: 'invAnalysis',
    path: '/business-insights/inventory-analysis',
    component: <InvAnalysis />,
  },
  {
    label: 'voucher',
    path: '/voucher',
  },
  {
    label: 'voucherMgmt',
    path: '/voucher/management',
    component: <VoucherMgmt />,
  },
  {
    label: 'voucherAdd',
    path: '/voucher/add',
    component: <VoucherAdd />,
  },
  {
    label: 'myAccount',
    path: '/my-acc',
  },
  {
    label: 'profileMgmt',
    path: '/my-acc/profile-management',
    component: <ProfileMgmt />,
  },
  {
    label: 'accSettings',
    path: '/my-acc/acc-settings',
    component: <AccSettings />,
  },
  {
    label: 'admin',
    path: '/admin',
  },
  {
    label: 'adminMgmt',
    path: '/admin/management',
    component: <AdminMgmt />,
  },
  {
    label: 'adminAdd',
    path: '/admin/add',
    component: <AdminAdd />,
  },
  {
    label: 'help',
    path: '/help',
    component: <Help />,
  },
  {
    label: 'logout',
    path: '/',
  },
  {
    label: 'root',
    path: '/',
  },
];

export default routeList;
