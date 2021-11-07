import Login from '@pages/Login/Login';
import Dashboard from '@pages/Dashboard/Dashboard';
import ProdMgmt from '@pages/Products/ProdMgmt';
import ProdInv from '@pages/Products/Prodtnv';
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
import Statistics from '@pages/BusinessInsights/Statistics';
import InvAnalysis from '@pages/BusinessInsights/InvAnalysis';
import DiscMgmt from '@pages/Discounts/DiscMgmt';
import DiscAdd from '@pages/Discounts/DiscAdd';
import ProfileMgmt from '@pages/MyAccount/ProfileMgmt';
import AccSettings from '@pages/MyAccount/AccSettings';
import AdminMgmt from '@pages/Admins/AdminMgmt';
import AdminAdd from '@pages/Admins/AdminAdd';
import Help from '@pages/Help/Help';
import ShpFeeMgmt from '@pages/Shipments/ShpFeeMgmt';
import OrderPend from '@pages/Orders/OrderPend';

const routeList: {
  label: string;
  path: string;
  exact?: boolean;
  component?: () => JSX.Element;
}[] = [
  {
    label: 'login',
    path: '/login',
    component: Login,
  },
  {
    label: 'dashboard',
    path: '/dashboard',
    component: Dashboard,
  },
  {
    label: 'product',
    path: '/product',
    exact: true,
  },
  {
    label: 'prodMgmt',
    path: '/product/management',
    component: ProdMgmt,
  },
  {
    label: 'prodInv',
    path: '/product/inventory',
    component: ProdInv,
  },
  {
    label: 'prodAdd',
    path: '/product/add',
    component: ProdAdd,
  },
  {
    label: 'package',
    path: '/package',
    exact: true,
  },
  {
    label: 'packMgmt',
    path: '/package/management',
    component: PackMgmt,
  },
  {
    label: 'packInv',
    path: '/package/inventory',
    component: PackInv,
  },
  {
    label: 'packAdd',
    path: '/package/add',
    component: PackAdd,
  },
  {
    label: 'order',
    path: '/order',
    exact: true,
  },
  {
    label: 'orderMgmt',
    path: '/order/management',
    component: OrderMgmt,
  },
  {
    label: 'orderPend',
    path: '/order/pending',
    component: OrderPend,
  },
  {
    label: 'orderAdd',
    path: '/order/add',
    component: OrderAdd,
  },
  {
    label: 'shipment',
    path: '/shipment',
    exact: true,
  },
  {
    label: 'shptMgmt',
    path: '/shipment/management',
    component: ShptMgmt,
  },
  {
    label: 'shpFeeMgmt',
    path: '/shipment/shipping-fee',
    component: ShpFeeMgmt,
  },
  {
    label: 'customer',
    path: '/customer',
    exact: true,
  },
  {
    label: 'custMgmt',
    path: '/customer/management',
    component: CustMgmt,
  },
  {
    label: 'custReg',
    path: '/customer/registrations',
    component: CustReg,
  },
  {
    label: 'custAdd',
    path: '/customer/add',
    component: CustAdd,
  },
  {
    label: 'businessInsights',
    path: '/business-insights',
    exact: true,
  },
  {
    label: 'statistics',
    path: '/business-insights/statistics',
    component: Statistics,
  },
  {
    label: 'invAnalysis',
    path: '/business-insights/inventory-analysis',
    component: InvAnalysis,
  },
  {
    label: 'discount',
    path: '/discount',
    exact: true,
  },
  {
    label: 'discMgmt',
    path: '/discount/management',
    component: DiscMgmt,
  },
  {
    label: 'discAdd',
    path: '/discount/add',
    component: DiscAdd,
  },
  {
    label: 'myAccount',
    path: '/my-acc',
    exact: true,
  },
  {
    label: 'profileMgmt',
    path: '/my-acc/profile-management',
    component: ProfileMgmt,
  },
  {
    label: 'accSettings',
    path: '/my-acc/acc-settings',
    component: AccSettings,
  },
  {
    label: 'admin',
    path: '/admin',
    exact: true,
  },
  {
    label: 'adminMgmt',
    path: '/admin/management',
    component: AdminMgmt,
  },
  {
    label: 'adminAdd',
    path: '/admin/add',
    component: AdminAdd,
  },
  {
    label: 'help',
    path: '/help',
    component: Help,
  },
  {
    label: 'logout',
    path: '/',
    exact: true,
  },
];

export default routeList;
