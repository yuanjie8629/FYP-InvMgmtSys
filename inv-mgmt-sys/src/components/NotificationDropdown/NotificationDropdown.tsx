import {
  Badge,
  Dropdown,
  Menu,
  Typography,
  Row,
  Col,
  Avatar,
  Space,
  Divider,
} from 'antd';
import Button from '@components/Button/Button';
import { MdNotifications } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import menuList from './NotificationDropdownList';
import siderMenuList from '@components/Layout/SiderMenuList';
import routeList from '@routes/RouteList';
import './NotificationDropdown.less';
import { IconType } from 'react-icons';

const CustomNotificationDropdown = () => {
  let history = useHistory();
  const { Text } = Typography;

  const findIcon = (cat: string) => {
    let selected = siderMenuList.map((siderMenuLevel) =>
      siderMenuLevel.items.find((item) => item.key === cat)
    );
    let icons = selected.find((selectedItem) => selectedItem !== undefined);
    let MatchedIcon: IconType = icons!.icon;
    return <MatchedIcon size={20} />;
  };

  const findRoutePath = (label: string) => {
    let route = routeList.find((route) => route.label === label);
    return route?.path === undefined ? '404' : route.path;
  };

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const menuNotificationDropdown = (
    <Menu
      onClick={(item: { key: string }) => {
        console.log(item.key.substring(0, item.key.length - 2));
        history.push(item.key.substring(0, item.key.length - 2));
      }}
      className='notification-menu'
    >
      <Menu.Item key='noti-header' disabled style={{ cursor: 'default' }}>
        <Row align='middle' justify='space-between'>
          <Col>
            <Text strong>Recent Notifications</Text>
          </Col>
          <Col>
            <Button color='info' type='link'>
              Mark all as read
            </Button>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Divider key='notification-header-divider' />
      {menuList.map((menu, index) => (
        <Menu.ItemGroup key={'notification-content-' + index}>
          <Menu.Item
            key={`${findRoutePath(menu.cat)}-${index}`}
            className='notification-menu-item'
          >
            <Row align='middle'>
              <Col className='notification-menu-item-avatar'>
                <Avatar
                  icon={findIcon(menu.cat)}
                  className={`centerFlex ${menu.status}Background`}
                />
              </Col>
              <Col>
                <Row className='notification-menu-item-title'>{menu.title}</Row>
                <Row>{menu.description}</Row>
                <Row>
                  <Space
                    split={<Divider type='vertical' style={{ margin: 0 }} />}
                  >
                    <Text className='notification-menu-item-content'>
                      {capitalize(menu.cat)}
                    </Text>
                    <Text className='notification-menu-item-content'>
                      {menu.timestamp}
                    </Text>
                  </Space>
                </Row>
              </Col>
            </Row>
          </Menu.Item>
          {index !== menuList.length - 1 ? <Menu.Divider /> : null}
        </Menu.ItemGroup>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menuNotificationDropdown} arrow trigger={['hover']}>
      <div className='notification-container'>
        <Badge
          dot
          offset={[-6, 5]}
          status='success'
          className='notification-badge'
        >
          <MdNotifications className='notification' />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default CustomNotificationDropdown;
