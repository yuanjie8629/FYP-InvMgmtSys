const routeRedirectList: {
  path: string;
  redirect: string;
}[] = [
  { path: '*', redirect: '/404' },
  { path: '/', redirect: '/dashboard' },
  { path: '/product', redirect: '/product/management' },
  { path: '/package', redirect: '/package/management' },
  { path: '/order', redirect: '/order/management' },
  { path: '/shipment', redirect: '/shipment/management' },
  { path: '/customer', redirect: '/customer/management' },
  { path: '/business-insights', redirect: '/business-insights/statistics' },
  { path: '/voucher', redirect: '/voucher/management' },
  { path: '/my-acc', redirect: '/my-acc/profile-management' },
  { path: '/admin', redirect: '/admin/management' },
];

export default routeRedirectList;
