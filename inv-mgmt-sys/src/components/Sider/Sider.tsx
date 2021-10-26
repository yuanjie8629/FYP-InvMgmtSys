import { Layout, Menu, Divider } from 'antd';
import { HomeIcon } from '@heroicons/react/solid';
import './Sider.less';
const CustomSider = () => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  return (
    <Sider className='sider'>
      <Menu mode='inline'>
        <div className='logo'></div>
        <Menu.Item
          key='dashboard'
          icon={<HomeIcon style={{ width: '20px' }} />}
        >
          Dashboard
        </Menu.Item>
        <SubMenu key='products' title='Products'>
          <Menu.Item>Manage Products</Menu.Item>
          <Menu.Item>Product Inventory</Menu.Item>
          <Menu.Item>Add Product</Menu.Item>
        </SubMenu>
        <SubMenu key='packages' title='Packages'>
          <Menu.Item>Manage Packages</Menu.Item>
          <Menu.Item>Package Inventory</Menu.Item>
          <Menu.Item>Add Package</Menu.Item>
        </SubMenu>
        <SubMenu key='orders' title='Orders'>
          <Menu.Item>Manage Orders</Menu.Item>
          <Menu.Item>Pending Orders</Menu.Item>
          <Menu.Item>Add Order</Menu.Item>
        </SubMenu>
        <SubMenu key='shipments' title='Shipments'>
          <Menu.Item>Manage Shipments</Menu.Item>
          <Menu.Item>Manage Shipping Fees</Menu.Item>
        </SubMenu>
        <SubMenu key='customers' title='Customers'>
          <Menu.Item>Manage Customers</Menu.Item>
          <Menu.Item>Manage Registrations</Menu.Item>
          <Menu.Item>Add Customer</Menu.Item>
        </SubMenu>
        <SubMenu key='bi' title='Business Insights'>
          <Menu.Item>Statistics</Menu.Item>
          <Menu.Item>Inventory Analysis</Menu.Item>
        </SubMenu>
        <SubMenu key='discounts' title='Discounts'>
          <Menu.Item>Manage Discounts</Menu.Item>
          <Menu.Item>Add Discount</Menu.Item>
        </SubMenu>
        <Divider />
        <SubMenu key='acc' title='My Account'>
          <Menu.Item>Manage Profile</Menu.Item>
          <Menu.Item>Account Setting</Menu.Item>
          <Menu.Item>Manage Admins</Menu.Item>
        </SubMenu>
        <Menu.Item>Help</Menu.Item>
        <Divider />
        <Menu.Item>Logout</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default CustomSider;
