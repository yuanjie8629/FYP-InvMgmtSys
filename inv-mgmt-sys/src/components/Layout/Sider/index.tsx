import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { collapse, expand } from '@state/siderSlice';
import { Layout, Menu, Image } from 'antd';
import { SiderProps as AntdSiderProps } from 'antd/lib/layout';
import menuList from './siderMenuList';
import Logo from '@assets/logo.webp';
import { useNavigate, useLocation } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import classNames from 'classnames';
import siderDefKeyList from './siderDefKeyList';

export interface SiderProps extends AntdSiderProps {}

const Sider = (props) => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsedSiderOpen, setCollapsedSiderOpen] = useState(true);
  const isSiderCollapsed = useAppSelector((state) => state.sider.collapsed);
  const dispatch = useAppDispatch();

  const selectedKeys =
    siderDefKeyList.find(
      (defKey) => defKey.path === location.pathname + location.search
    ) !== undefined
      ? [
          findRoutePath(
            siderDefKeyList.find(
              (defKey) => defKey.path === location.pathname + location.search
            ).key
          ),
        ]
      : [location.pathname];

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
        onMouseLeave={() =>
          isSiderCollapsed ? setCollapsedSiderOpen(false) : null
        }
        onBreakpoint={(breakpoint) => {
          if (breakpoint) {
            dispatch(collapse());
            setCollapsedSiderOpen(false);
          } else {
            dispatch(expand());
            setCollapsedSiderOpen(true);
          }
        }}
        className='sider'
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
              src={Logo}
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
            navigate(item.key);
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
