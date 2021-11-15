import { Layout, Menu, Image } from 'antd';
import menuList from './SiderMenuList';
import routeList from '@routes/RouteList';
import Logo from '@assets/logo.webp';
import { useHistory } from 'react-router-dom';


const CustomSider = () => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  let history = useHistory();

  const openKey = [history.location.pathname.split('/')[1]];

  const findRoutePath = (label: string) => {
    let route = routeList.find((route) => route.label === label);
    return route?.path === undefined ? '404' : route.path;
  };
  return (
    <div style={{width: 220}}>
    <Sider width='220px' className='sider'>
      <div className='sider-logo-fixed'>
        <div
          className='sider-logo-wrapper'
          onClick={() => {
            history.push(findRoutePath('dashboard'));
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
      <Menu
        mode='inline'
        defaultSelectedKeys={[history.location.pathname]}
        defaultOpenKeys={openKey}
        inlineIndent={15}
        onClick={(item: { key: string }) => {
          history.push(item.key);
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
              >
                {item.label}
              </Menu.Item>
            )
          ),
          menuLevel.level !== menuList.length ? (
            <Menu.Divider style={{ margin: '24px 0' }} />
          ) : null,
        ])}
      </Menu>
      </Sider>
      </div>
  );
};

export default CustomSider;
