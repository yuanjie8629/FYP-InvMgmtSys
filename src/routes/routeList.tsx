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
import Help from '@pages/Help';
import NotFound from '@pages/NotFound/NotFound';
import ResetPass from '@pages/Login/ResetPass';
import { SuccessResult } from '@pages/ResultFeedback';
import ProdEdit from '@pages/Items/Products/ProdEdit';
import PackEdit from '@pages/Items/Packages/PackEdit';
import VoucherEdit from '@pages/Vouchers/VoucherEdit';
import CustRegView from '@pages/Customers/CustRegView';
import CustView from '@pages/Customers/CustView';
import ShptFeeAdd from '@pages/Shipments/ShptFee/ShptFeeAdd';
import ShptMgmt from '@pages/Shipments/ShptMgmt';
import ShptFeeMgmt from '@pages/Shipments/ShptFee/ShptFeeMgmt';
import ShptFeeEdit from '@pages/Shipments/ShptFee/ShptFeeEdit';
import PickupMgmt from '@pages/Shipments/Pickup/PickupMgmt';
import PickupAdd from '@pages/Shipments/Pickup/PickupAdd';
import PickupEdit from '@pages/Shipments/Pickup/PickupEdit';
import OrderView from '@pages/Orders/OrderView';

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
    component: <PackEdit />,
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
    label: 'orderAdd',
    path: '/order/add',
    protected: true,
    component: <OrderAdd />,
  },
  {
    label: 'orderAdd',
    path: '/order/:id',
    protected: true,
    component: <OrderView />,
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
    label: 'shptFeeMgmt',
    path: '/shipment/shipping_fee',
    protected: true,
    component: <ShptFeeMgmt />,
  },
  {
    label: 'shptFeeAdd',
    path: '/shipment/shipping_fee/add',
    protected: true,
    component: <ShptFeeAdd />,
  },
  {
    label: 'shptFeeAdd',
    path: '/shipment/shipping_fee/:id',
    protected: true,
    component: <ShptFeeEdit />,
  },
  {
    label: 'shptFeeAddSuccess',
    path: '/shipment/shipping_fee/add/success',
    protected: true,
    component: <SuccessResult record='shptFee' type='add' />,
  },
  {
    label: 'shptFeeEditSuccess',
    path: '/shipment/shipping_fee/edit/success',
    protected: true,
    component: <SuccessResult record='shptFee' type='edit' />,
  },
  {
    label: 'pickupMgmt',
    path: '/shipment/pickup',
    protected: true,
    component: <PickupMgmt />,
  },
  {
    label: 'pickupAdd',
    path: '/shipment/pickup/add',
    protected: true,
    component: <PickupAdd />,
  },
  {
    label: 'pickupAdd',
    path: '/shipment/pickup/:id',
    protected: true,
    component: <PickupEdit />,
  },
  {
    label: 'pickupAddSuccess',
    path: '/shipment/pickup/add/success',
    protected: true,
    component: <SuccessResult record='pickup' type='add' />,
  },
  {
    label: 'pickupEditSuccess',
    path: '/shipment/pickup/edit/success',
    protected: true,
    component: <SuccessResult record='pickup' type='edit' />,
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
    label: 'custMgmt',
    path: '/customer/:id',
    protected: true,
    component: <CustView />,
  },
  {
    label: 'custReg',
    path: '/customer/registration',
    protected: true,
    component: <CustReg />,
  },
  {
    label: 'custReg',
    path: '/customer/registration/:id',
    protected: true,
    component: <CustRegView />,
  },
  {
    label: 'custAdd',
    path: '/customer/add',
    protected: true,
    component: <CustAdd />,
  },
  {
    label: 'custAddSuccess',
    path: '/customer/add/success',
    protected: true,
    component: <SuccessResult record='cust' type='add' />,
  },
  {
    label: 'custEdit',
    path: '/customer/:id',
    protected: true,
    component: <CustAdd />,
  },
  {
    label: 'bizInsights',
    path: '/business_insights',
    protected: true,
  },
  {
    label: 'bizStatistics',
    path: '/business_insights/statistics',
    protected: true,
    component: <Statistics />,
  },
  {
    label: 'invAnalysis',
    path: '/business_insights/inventory_analysis',
    protected: true,
    component: <InvAnalysis />,
  },
  {
    label: 'voucher',
    path: '/voucher',
    protected: true,
  },
  {
    label: 'voucherAddSuccess',
    path: '/voucher/add/success',
    protected: true,
    component: <SuccessResult record='voucher' type='add' />,
  },
  {
    label: 'voucherEditSuccess',
    path: '/voucher/edit/success',
    protected: true,
    component: <SuccessResult record='voucher' type='edit' />,
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
    component: <VoucherEdit />,
  },
  {
    label: 'myAccount',
    path: '/my_acc',
    protected: true,
  },
  {
    label: 'profileMgmt',
    path: '/my_acc/profile_management',
    protected: true,
    component: <ProfileMgmt />,
  },
  {
    label: 'accSettings',
    path: '/my_acc/acc_settings',
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
