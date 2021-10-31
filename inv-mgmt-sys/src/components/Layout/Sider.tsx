import React, { useState, useEffect } from 'react';

import { Layout, Menu, Divider, Image } from 'antd';
import menuList from './SiderMenuList';
import './Layout.less';
import Logo from '@assets/logo.webp';
import { useHistory } from 'react-router-dom';

const CustomSider = () => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  let history = useHistory();
  const handleClick = (item: { key: string }) => {
    history.push(item.key);
  };

  const [openKeys, setOpenKeys] = useState(['']);

  useEffect(() => {
    setOpenKeys([history.location.pathname]);
  }, [history.location.pathname]);
  
  return (
    <Sider width='220px' className='sider'>
      <Menu
        mode='inline'
        defaultSelectedKeys={['/dashboard']}
        selectedKeys={[history.location.pathname]}
        inlineIndent={15}
        onClick={handleClick}
        className='sider-menu'
      >
        <div className='sider-logo-fixed'>
          <div
            className='sider-logo-wrapper'
            onClick={() => {
              history.push('/dashboard');
            }}
          >
            <Image
              src={Logo}
              alt='Logo'
              preview={false}
              height='65px'
              className='sider-logo'
            />
          </div>
        </div>
        {menuList.map((menuGroup) => [
          menuGroup.items.map((item) =>
            item.child ? (
              <SubMenu title={item.label} icon={<item.icon size={20} />}>
                {item.child.map((child) => (
                  <Menu.Item key={child.key}>{child.label}</Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={<item.icon size={20} />}>
                {item.label}
              </Menu.Item>
            )
          ),
          menuGroup.level !== menuList.length ? <Divider /> : null,
        ])}
      </Menu>
    </Sider>
  );
};

export default CustomSider;
