import React, { useContext, useEffect, useState } from 'react';
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
  Skeleton,
  Empty,
} from 'antd';
import Button from '@components/Button';
import { MdNotifications } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { findRoutePath, findIcon } from '@utils/routingUtils';
import './NotificationDropdown.less';
import {
  notificationListAPI,
  notificationReadAPI,
} from '@api/services/notificationAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { MessageContext } from '@contexts/MessageContext';
import { capitalize } from '@utils/strUtils';

const NotificationDropdown = () => {
  let navigate = useNavigate();
  const { Text } = Typography;
  const [markAllRead, setMarkAllRead] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    setLoading(true);
    notificationListAPI()
      .then((res) => {
        setData(res.data);
        let allRead = true;
        res.data?.forEach((datum) => {
          if (!datum.read) {
            allRead = false;
          }
        });
        if (allRead) {
          setMarkAllRead(true);
        } else {
          setMarkAllRead(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readNotification = (id: any[]) => {
    setMarkAllRead(true);

    notificationReadAPI(
      id.map((id) => {
        return { id: id, read: true };
      })
    )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const menuNotificationDropdown = (
    <Menu
      onClick={(item: { key: string }) => {
        let key = item.key.split('-');
        readNotification([key[1]]);
        navigate(key[0]);
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
                readNotification(data.map((notification) => notification.id));
              }}
            >
              Mark all as read
            </Button>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Divider key='notification-header-divider' />
      <Menu.ItemGroup
        key={'notification-content'}
        className='notification-menu-item-group'
      >
        {loading ? (
          Array.from(Array(5).keys()).map(() => (
            <Row align='middle' style={{ minHeight: 100, padding: 10 }}>
              <Col>
                <Skeleton
                  active={loading}
                  avatar
                  title={null}
                  paragraph={null}
                />
              </Col>
              <Col span={18}>
                <Skeleton
                  active={loading}
                  title={null}
                  paragraph={{ rows: 3 }}
                />
              </Col>
            </Row>
          ))
        ) : data.length > 0 ? (
          data?.map((notification, index) => {
            const Icon = findIcon(notification.type);

            return (
              <>
                <Menu.Item
                  key={`${findRoutePath(notification.type)}-${notification.id}`}
                  className='notification-menu-item'
                >
                  <Row align='middle'>
                    <Col className='notification-menu-item-avatar'>
                      <Badge
                        dot={!(notification.read || markAllRead)}
                        status={
                          !(notification.read || markAllRead)
                            ? 'default'
                            : undefined
                        }
                        color={
                          notification.type === 'order'
                            ? '#0e9f6e'
                            : ['product', 'package'].includes(notification.type)
                            ? '#f05252'
                            : notification.type === 'customer'
                            ? '#1bacf3'
                            : undefined
                        }
                      >
                        <Avatar
                          icon={<Icon size={24} />}
                          size={42}
                          className={`center-flex ${
                            notification.type === 'order'
                              ? 'success'
                              : ['product', 'package'].includes(
                                  notification.type
                                )
                              ? 'error'
                              : notification.type === 'customer'
                              ? 'info'
                              : null
                          }Background`}
                        />
                      </Badge>
                    </Col>
                    <Col>
                      <Row className='notification-menu-item-title'>
                        {notification.title}
                      </Row>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: notification.description,
                        }}
                        style={{ width: 245 }}
                      />
                      <Row>
                        <Space
                          split={
                            <Divider
                              type='vertical'
                              style={{ margin: 0 }}
                              className='notification-menu-item-split'
                            />
                          }
                        >
                          <Text className='notification-menu-item-info'>
                            {capitalize(notification.type)}
                          </Text>
                          <Text className='notification-menu-item-info'>
                            {notification.created_at}
                          </Text>
                        </Space>
                      </Row>
                    </Col>
                  </Row>
                </Menu.Item>
                {index !== data.length - 1 && <Menu.Divider />}
              </>
            );
          })
        ) : (
          <Empty style={{ margin: 20 }} />
        )}
      </Menu.ItemGroup>

      <Menu.Divider key='noti-footer-divider' />
      <Menu.Item
        key='noti-footer'
        disabled
        style={{ cursor: 'default', padding: '15px 0', textAlign: 'center' }}
      >
        <Button type='link' color='info'>
          View All Notifications
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown placement='bottomLeft' overlay={menuNotificationDropdown} arrow>
      <span className='notification-container'>
        <Badge
          dot={!markAllRead}
          offset={[-7, 5]}
          status='success'
          className='notification-badge'
        >
          <MdNotifications className='notification' />
        </Badge>
      </span>
    </Dropdown>
  );
};

export default NotificationDropdown;
