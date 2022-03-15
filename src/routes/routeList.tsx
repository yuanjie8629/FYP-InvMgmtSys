import Login from '@pages/Login/Login';
import Dashboard from '@pages/Dashboard/Dashboard';
import ProdMgmt from '@pages/Items/Products/ProdMgmt';
import ProdInv from '@pages/Items/Products/ProdInv';
import ProdAdd from '@pages/Items/Products/ProdAdd';
import PackMgmt from '@pages/Items/Packages/PackMgmt';
import PackInv from '@pages/Items/Packages/PackInv';
import PackAdd from '@pages/Items/Packages/PackAdd';
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
import ResetPass from '@pages/Login/ResetPass';
import { SuccessResult } from '@pages/ResultFeedback';
import ProdEdit from '@pages/Items/Products/ProdEdit';

const routeList: {
  label: string;
  path: string;
  protected?: boolean;
  component?: JSX.Element;
}[] = [
  {
    label: 'notFound',
    path: '/404',
    protected: true,
    component: <NotFound />,
  },
  {
    label: 'login',
    path: '/login',
    protected: false,
    component: <Login />,
  },
  {
    label: 'dashboard',
    path: '/dashboard',
    protected: true,
    component: <Dashboard />,
  },
  {
    label: 'product',
    path: '/product',
    protected: true,
  },
  {
    label: 'prodMgmt',
    path: '/product/management',
    protected: true,
    component: <ProdMgmt />,
  },
  {
    label: 'prodInv',
    path: '/product/inventory',
    protected: true,
    component: <ProdInv />,
  },
  {
    label: 'prodAdd',
    path: '/product/add',
    protected: true,
    component: <ProdAdd />,
  },
  {
    label: 'prodAdd',
    path: '/product/:id',
    protected: true,
    component: <ProdEdit />,
  },
  {
    label: 'prodAddSuccess',
    path: '/product/add/success',
    protected: true,
    component: <SuccessResult record='prod' type='add' />,
  },
  {
    label: 'prodEditSuccess',
    path: '/product/edit/success',
    protected: true,
    component: <SuccessResult record='prod' type='edit' />,
  },
  {
    label: 'package',
    path: '/package',
    protected: true,
  },
  {
    label: 'packMgmt',
    path: '/package/management',
    protected: true,
    component: <PackMgmt />,
  },
  {
    label: 'packInv',
    path: '/package/inventory',
    protected: true,
    component: <PackInv />,
  },
  {
    label: 'packAdd',
    path: '/package/add',
    protected: true,
    component: <PackAdd />,
  },
  {
    label: 'packAdd',
    path: '/package/:id',
    protected: true,
    component: <PackAdd />,
  },
  {
    label: 'packAddSuccess',
    path: '/package/add/success',
    protected: true,
    component: <SuccessResult record='pack' type='add' />,
  },
  {
    label: 'packEditSuccess',
    path: '/package/edit/success',
    protected: true,
    component: <SuccessResult record='pack' type='edit' />,
  },
  {
    label: 'order',
    path: '/order',
    protected: true,
  },
  {
    label: 'orderMgmt',
    path: '/order/management',
    protected: true,
    component: <OrderMgmt />,
  },
  {
    label: 'orderPend',
    path: '/order/management?status=toShip',
    protected: true,
  },
  {
    label: 'orderCancel',
    path: '/order/management?status=cancel',
    protected: true,
  },
  {
    label: 'orderUnpaid',
    path: '/order/management?status=unpaid',
    protected: true,
  },
  {
    label: 'orderRefund',
    path: '/order/management?status=refund',
    protected: true,
  },
  {
    label: 'orderAdd',
    path: '/order/add',
    protected: true,
    component: <OrderAdd />,
  },

  {
    label: 'shipment',
    path: '/shipment',
    protected: true,
  },
  {
    label: 'shptMgmt',
    path: '/shipment/management',
    protected: true,
    component: <ShptMgmt />,
  },
  {
    label: 'shpFeeMgmt',
    path: '/shipment/shipping-fee',
    protected: true,
    component: <ShpFeeMgmt />,
  },
  {
    label: 'customer',
    path: '/customer',
    protected: true,
  },
  {
    label: 'custMgmt',
    path: '/customer/management',
    protected: true,
    component: <CustMgmt />,
  },
  {
    label: 'custReg',
    path: '/customer/registrations',
    protected: true,
    component: <CustReg />,
  },
  {
    label: 'custAdd',
    path: '/customer/add',
    protected: true,
    component: <CustAdd />,
  },
  {
    label: 'custAdd',
    path: '/customer/:id',
    protected: true,
    component: <CustAdd />,
  },
  {
    label: 'bizInsights',
    path: '/business-insights',
    protected: true,
  },
  {
    label: 'bizStatistics',
    path: '/business-insights/statistics',
    protected: true,
    component: <Statistics />,
  },
  {
    label: 'invAnalysis',
    path: '/business-insights/inventory-analysis',
    protected: true,
    component: <InvAnalysis />,
  },
  {
    label: 'voucher',
    path: '/voucher',
    protected: true,
  },
  {
    label: 'voucherMgmt',
    path: '/voucher/management',
    protected: true,
    component: <VoucherMgmt />,
  },
  {
    label: 'voucherAdd',
    path: '/voucher/add',
    protected: true,
    component: <VoucherAdd />,
  },
  {
    label: 'voucherAdd',
    path: '/voucher/:id',
    protected: true,
    component: <VoucherAdd />,
  },
  {
    label: 'myAccount',
    path: '/my-acc',
    protected: true,
  },
  {
    label: 'profileMgmt',
    path: '/my-acc/profile-management',
    protected: true,
    component: <ProfileMgmt />,
  },
  {
    label: 'accSettings',
    path: '/my-acc/acc-settings',
    protected: true,
    component: <AccSettings />,
  },
  {
    label: 'admin',
    path: '/admin',
    protected: true,
  },
  {
    label: 'adminMgmt',
    path: '/admin/management',
    protected: true,
    component: <AdminMgmt />,
  },
  {
    label: 'adminAdd',
    path: '/admin/add',
    protected: true,
    component: <AdminAdd />,
  },
  {
    label: 'help',
    path: '/help',
    protected: true,
    component: <Help />,
  },
  {
    label: 'resetPass',
    path: '/pass_reset',
    protected: false,
    component: <ResetPass />,
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
