import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { collapse, expand, increment } from '@state/siderSlice';
import { Layout, Menu, Image, Grid } from 'antd';
import menuList from './-siderMenuList';
import Logo from '@assets/logo.webp';
import { useNavigate, useLocation } from 'react-router-dom';
import { findRoutePath } from '@utils/RoutingUtils';
import classNames from 'classnames';

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

  const openKey = [location.pathname.split('/')[1]];
  useEffect(() => {
    if (renderCount < 1 && !(screens.xl || screens.xl === undefined)) {
      dispatch(collapse());
      dispatch(increment());
    }
  }, [dispatch, renderCount, screens.xl]);

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
        onCollapse={() =>
          isSiderCollapsed ? dispatch(expand()) : dispatch(collapse())
        }
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
          defaultSelectedKeys={[location.pathname]}
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
              <Menu.Divider key={menuLevel.level}style={{ margin: '24px 0' }} />
            ) : null,
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
