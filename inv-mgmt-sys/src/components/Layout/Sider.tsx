import { useState } from 'react';
import { Layout, Menu, Image } from 'antd';
import menuList from './siderMenuList';
import Logo from '@assets/logo.webp';
import { useNavigate, useLocation } from 'react-router-dom';
import { findRoutePath } from '@utils/RoutingUtils';

const Sider = () => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  let navigate = useNavigate();
  let location = useLocation();

  let [collapsed, setCollapsed] = useState(false);

  const openKey = [location.pathname.split('/')[1]];

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <div
      className={`${
        collapsed === true ? 'sider-collapsed-fixed' : 'sider-fixed'
      }`}
    >
      <Sider
        theme='light'
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        width='220px'
        className='sider'
      >
        <div className={'sider-logo-fixed'}>
          <div
            className={`${
              collapsed === true
                ? 'sider-logo-collapsed-wrapper'
                : 'sider-logo-wrapper'
            }`}
            onClick={() => {
              navigate(findRoutePath('dashboard'), { replace: true });
            }}
          >
            <Image
              src={Logo}
              alt='Logo'
              preview={false}
              height={collapsed === true ? 25 : 65}
              className='sider-logo'
            />
          </div>
        </div>
        <Menu
          mode='inline'
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={openKey}
          inlineIndent={15}
          onClick={(item: { key: string }) => {
            navigate(item.key, { replace: true });
          }}
          className='sider-menu'
        >
          {menuList.map((menuLevel) => [
            menuLevel.items.map((item) =>
              item.child ? (
                <SubMenu
                  key={item.key}
                  title={item.label}
                  icon={<item.icon size={20} />}
                >
                  {item.child.map((child) => (
                    <Menu.Item key={findRoutePath(child.key)}>
                      {child.label}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={findRoutePath(item.key)}
                  icon={<item.icon size={20} />}
                  className='sider-menu-item'
                >
                  {item.label}
                </Menu.Item>
              )
            ),
            menuLevel.level !== menuList.length ? (
              <Menu.Divider style={{ margin: '24px 0' }} />
            ) : null,
          ])}
          <Menu.Item style={{ height: 48 }}></Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
};

export default Sider;
