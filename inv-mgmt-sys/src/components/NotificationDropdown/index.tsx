import React, { useState } from 'react';
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
import Button from '@components/Button';
import { MdNotifications } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import menuList from './notificationDropdownList';
import { findRoutePath, findIcon } from '@utils/routingUtils';
import './NotificationDropdown.less';

const NotificationDropdown = () => {
  let navigate = useNavigate();
  const { Text } = Typography;

  const [markAllRead, setMarkAllRead] = useState(false);

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const menuNotificationDropdown = (
    <Menu
      onClick={(item: { key: string }) => {
        navigate(item.key.substring(0, item.key.length - 2), {
          replace: true,
        });
      }}
      className='notification-menu'
    >
      <Menu.Item
        key='noti-header'
        disabled
        style={{ cursor: 'default', padding: 15 }}
      >
        <Row align='middle' justify='space-between'>
          <Col>
            <Text strong>Recent Notifications</Text>
          </Col>
          <Col>
            <Button
              color='info'
              type='link'
              onClick={() => {
                setMarkAllRead(true);
              }}
            >
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
                <Badge
                  dot={menu.read}
                  offset={[-5, 5]}
                  status={menu.status}
                  className='notification-menu-item-badge'
                >
                  <Avatar
                    icon={findIcon(menu.cat)}
                    size={42}
                    className={`centerFlex ${menu.status}Background`}
                  />
                </Badge>
              </Col>
              <Col>
                <Row className='notification-menu-item-title'>{menu.title}</Row>
                {menu.description}
                <Row>
                  <Space
                    split={<Divider type='vertical' style={{ margin: 0 }} />}
                  >
                    <Text className='notification-menu-item-info'>
                      {capitalize(menu.cat)}
                    </Text>
                    <Text className='notification-menu-item-info'>
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
      <Menu.Item
        key='notiCenter'
        disabled
        style={{ cursor: 'default', padding: '15px 0', textAlign: 'center' }}
      >
        <Button type='link' color='info'>
          View More
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuNotificationDropdown} arrow>
      <div className='notification-container'>
        <Badge
          dot={!markAllRead}
          offset={[-7, 5]}
          status='success'
          className='notification-badge'
        >
          <MdNotifications className='notification' />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;
