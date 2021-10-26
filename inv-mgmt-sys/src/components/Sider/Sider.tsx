import { Layout, Menu, Divider, Image } from 'antd';
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
  HiQuestionMarkCircle,
  HiLogout,
} from 'react-icons/hi';
import './Sider.less';

import Logo from '@assets/logo.webp';

const CustomSider = () => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  return (
    <Sider className='sider'>
      <Menu mode='inline'>
        <div className='logo'>
          <Image src={Logo} alt='Logo' preview={false} />
        </div>
        <Menu.Item key='dashboard' icon={<HiHome />}>
          Dashboard
        </Menu.Item>
        <SubMenu key='products' title='Products' icon={<HiShoppingBag />}>
          <Menu.Item>Manage Products</Menu.Item>
          <Menu.Item>Product Inventory</Menu.Item>
          <Menu.Item>Add Product</Menu.Item>
        </SubMenu>
        <SubMenu key='packages' title='Packages' icon={<HiCube />}>
          <Menu.Item>Manage Packages</Menu.Item>
          <Menu.Item>Package Inventory</Menu.Item>
          <Menu.Item>Add Package</Menu.Item>
        </SubMenu>
        <SubMenu key='orders' title='Orders' icon={<HiClipboardList />}>
          <Menu.Item>Manage Orders</Menu.Item>
          <Menu.Item>Pending Orders</Menu.Item>
          <Menu.Item>Add Order</Menu.Item>
        </SubMenu>
        <SubMenu key='shipments' title='Shipments' icon={<HiTruck />}>
          <Menu.Item>Manage Shipments</Menu.Item>
          <Menu.Item>Manage Shipping Fees</Menu.Item>
        </SubMenu>
        <SubMenu key='customers' title='Customers' icon={<HiUserGroup />}>
          <Menu.Item>Manage Customers</Menu.Item>
          <Menu.Item>Manage Registrations</Menu.Item>
          <Menu.Item>Add Customer</Menu.Item>
        </SubMenu>
        <SubMenu key='bi' title='Business Insights' icon={<HiChartSquareBar />}>
          <Menu.Item>Statistics</Menu.Item>
          <Menu.Item>Inventory Analysis</Menu.Item>
        </SubMenu>
        <SubMenu key='discounts' title='Discounts' icon={<HiTicket />}>
          <Menu.Item>Manage Discounts</Menu.Item>
          <Menu.Item>Add Discount</Menu.Item>
        </SubMenu>
        <Divider />
        <SubMenu key='acc' title='My Account' icon={<HiUserCircle />}>
          <Menu.Item>Manage Profile</Menu.Item>
          <Menu.Item>Account Setting</Menu.Item>
          <Menu.Item>Manage Admins</Menu.Item>
        </SubMenu>
        <Menu.Item icon={<HiQuestionMarkCircle />}>Help</Menu.Item>
        <Divider />
        <Menu.Item icon={<HiLogout />}>Logout</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default CustomSider;
