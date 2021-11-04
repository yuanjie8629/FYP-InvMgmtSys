import Login from '@pages/Login/Login';
import Dashboard from '@pages/Dashboard/Dashboard';
import ProdMgmt from '@pages/Products/ProdMgmt';
import ProdInv from '@pages/Products/Prodtnv';
import AddProd from '@pages/Products/AddProd';
import PackMgmt from '@pages/Packages/PackMgmt';
import PackInv from '@pages/Packages/PackInv';
import AddPack from '@pages/Packages/AddPack';
import OrderMgmt from '@pages/Orders/OrderMgmt';
import AddOrder from '@pages/Orders/AddOrder';
import ShptMgmt from '@pages/Shipments/ShptMgmt';
import CustMgmt from '@pages/Customers/CustMgmt';
import CustReg from '@pages/Customers/CustReg';
import AddCust from '@pages/Customers/AddCust';
import Statistics from '@pages/BusinessInsights/Statistics';
import InvAnalysis from '@pages/BusinessInsights/InvAnalysis';
import DiscMgmt from '@pages/Discounts/DiscMgmt';
import AddDisc from '@pages/Discounts/AddDisc';
import ProfileMgmt from '@pages/MyAccount/ProfileMgmt';
import AccSettings from '@pages/MyAccount/AccSettings';
import AdminMgmt from '@pages/Admins/AdminMgmt';
import AddAdmin from '@pages/Admins/AddAdmin';
import Help from '@pages/Help/Help';
import ShpFeeMgmt from '@pages/Shipments/ShpFeeMgmt';
import PendOrder from '@pages/Orders/PendOrder';

const routeList = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/product/management',
    component: ProdMgmt,
  },
  {
    path: '/product/inventory',
    component: ProdInv,
  },
  {
    path: '/product/add',
    component: AddProd,
  },
  {
    path: '/package/management',
    component: PackMgmt,
  },
  {
    path: '/package/inventory',
    component: PackInv,
  },
  {
    path: '/package/add',
    component: AddPack,
  },
  {
    path: '/order/management',
    component: OrderMgmt,
  },
  {
    path: '/order/pending',
    component: PendOrder,
  },
  {
    path: '/order/add',
    component: AddOrder,
  },
  {
    path: '/shipment/management',
    component: ShptMgmt,
  },
  {
    path: '/shipment/shipping-fee',
    component: ShpFeeMgmt,
  },
  {
    path: '/customer/management',
    component: CustMgmt,
  },
  {
    path: '/customer/registrations',
    component: CustReg,
  },
  {
    path: '/customer/add',
    component: AddCust,
  },
  {
    path: '/business-insights/statistics',
    component: Statistics,
  },
  {
    path: '/business-insights/inventory-analysis',
    component: InvAnalysis,
  },
  {
    path: '/discount/management',
    component: DiscMgmt,
  },
  {
    path: '/discount/add',
    component: AddDisc,
  },
  {
    path: '/my-acc/profile-management',
    component: ProfileMgmt,
  },
  {
    path: '/my-acc/acc-settings',
    component: AccSettings,
  },
  {
    path: '/admin/management',
    component: AdminMgmt,
  },
  {
    path: '/admin/add',
    component: AddAdmin,
  },
  {
    path: '/help',
    component: Help,
  },
];

export default routeList;
