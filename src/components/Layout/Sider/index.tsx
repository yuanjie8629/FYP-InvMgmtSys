import React, { useEffect, useState } from 'react';
import { Layout, Menu, Image } from 'antd';
import { SiderProps as AntdSiderProps } from 'antd/lib/layout';
import menuList from './siderMenuList';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkURL, findRouteLabel, findRoutePath } from '@utils/routingUtils';
import classNames from 'classnames';
import { logoutAPI } from '@api/services/authAPI';

export interface SiderProps extends AntdSiderProps {
  onCollapsed?: (boolean) => void;
}

const Sider = ({ onCollapsed = () => null, ...props }: SiderProps) => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsedSiderOpen, setCollapsedSiderOpen] = useState(true);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);

  useEffect(() => {
    onCollapsed(isSiderCollapsed);
  }, [isSiderCollapsed, onCollapsed]);

  const selectedKeys = [findRouteLabel(checkURL(location.pathname))];

  const openKeys = [location.pathname.split('/')[1]];

  return (
    <span
      className={classNames(
        { 'sider-collapsed-fixed': isSiderCollapsed },
        { 'sider-fixed': !isSiderCollapsed }
      )}
    >
      <Sider
        theme='light'
        breakpoint='xl'
        width={220}
        collapsed={!collapsedSiderOpen}
        onMouseLeave={() => isSiderCollapsed && setCollapsedSiderOpen(false)}
        onBreakpoint={(breakpoint) => {
          if (breakpoint) {
            setIsSiderCollapsed(true);
            setCollapsedSiderOpen(false);
          } else {
            setIsSiderCollapsed(false);
            setCollapsedSiderOpen(true);
          }
        }}
        className='sider'
        {...props}
      >
        <div className='sider-logo-fixed'>
          <div
            className={classNames(
              { 'sider-logo-collapsed-wrapper': !collapsedSiderOpen },
              { 'sider-logo-wrapper': collapsedSiderOpen }
            )}
            onClick={() => {
              navigate(findRoutePath('dashboard'));
            }}
          >
            <Image
              src='https://res.cloudinary.com/yuanjie/image/upload/v1645908976/Shrf/logo_mvamgs.png'
              alt='Logo'
              preview={false}
              height={!collapsedSiderOpen ? 25 : 65}
              className='sider-logo'
            />
          </div>
        </div>
        <Menu
          mode='inline'
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          inlineIndent={15}
          onClick={(item: { key: string }) => {
            if (item.key === 'logout') {
              logoutAPI();
            }
            navigate(findRoutePath(item.key));
          }}
          onMouseOver={() => setCollapsedSiderOpen(true)}
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
                    <Menu.Item key={child.key}>{child.label}</Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={item.key}
                  icon={<item.icon size={20} />}
                  className='sider-menu-item'
                >
                  {item.label}
                </Menu.Item>
              )
            ),
            menuLevel.level !== menuList.length ? (
              <Menu.Divider
                key={menuLevel.level}
                style={{ margin: '24px 0' }}
              />
            ) : (
              <div style={{ height: 35 }} />
            ),
          ])}
        </Menu>
      </Sider>
    </span>
  );
};

export default Sider;
