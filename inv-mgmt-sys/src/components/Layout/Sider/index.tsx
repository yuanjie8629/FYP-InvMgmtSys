import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { collapse, expand, increment } from '@state/siderSlice';
import { Layout, Menu, Image, Grid } from 'antd';
import menuList from './siderMenuList';
import Logo from '@assets/logo.webp';
import { useNavigate, useLocation } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import classNames from 'classnames';
import siderDefKeyList from './siderDefKeyList';
import less from 'less';

const Sider = () => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const isSiderCollapsed = useAppSelector((state) => state.sider.collapsed);
  const renderCount = useAppSelector((state) => state.sider.renderCount);
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

  const openKey = [location.pathname.split('/')[1]];
  useEffect(() => {
    if (
      renderCount < 1 &&
      !(
        screens.xl ||
        screens.xxl ||
        screens.xl === undefined ||
        screens.xxl === undefined
      )
    ) {
      dispatch(collapse());
      dispatch(increment());
    }
  }, [dispatch, renderCount, screens.xl, screens.xxl]);

  return (
    <div
      className={classNames(
        { 'sider-collapsed-fixed': isSiderCollapsed },
        { 'sider-fixed': !isSiderCollapsed }
      )}
    >
      <Sider
        theme='light'
        collapsible
        collapsed={isSiderCollapsed}
        onCollapse={() => {
          isSiderCollapsed ? dispatch(expand()) : dispatch(collapse());
          less.modifyVars({ '@message-margin': 40 });
        }}
        width='220px'
        className='sider'
      >
        <div className={'sider-logo-fixed'}>
          <div
            className={classNames(
              { 'sider-logo-collapsed-wrapper': isSiderCollapsed },
              { 'sider-logo-wrapper': !isSiderCollapsed }
            )}
            onClick={() => {
              navigate(findRoutePath('dashboard'), { replace: true });
            }}
          >
            <Image
              src={Logo}
              alt='Logo'
              preview={false}
              height={isSiderCollapsed ? 25 : 65}
              className='sider-logo'
            />
          </div>
        </div>
        <Menu
          mode='inline'
          selectedKeys={selectedKeys}
          defaultOpenKeys={!isSiderCollapsed ? openKey : undefined}
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
              <Menu.Divider
                key={menuLevel.level}
                style={{ margin: '24px 0' }}
              />
            ) : (
              <div style={{ height: 48 }} />
            ),
          ])}
          <Menu.Item
            key='siderCollapsedTrigger'
            style={{ height: 48 }}
          ></Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
};

export default Sider;
