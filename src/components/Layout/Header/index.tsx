import { Col, Divider, Layout, Row, Space } from 'antd';
import Breadcrumb from '@components/BreadCrumb';
import AvatarDropdown from '@components/AvatarDropdown';
import NotificationDropdown from '@components/NotificationDropdown';
import classNames from 'classnames';
import React from 'react';

interface HeaderProps {
  collapsed: boolean;
  children?: React.ReactNode;
}

const Header = ({ collapsed, ...props }: HeaderProps) => {
  const { Header } = Layout;

  return (
    <div className='header-fixed'>
      <Header
        className={classNames(
          'header',
          { 'header-collapsed': collapsed },
          { 'header-expanded': !collapsed }
        )}
        style={{ minWidth: 1060 }}
      >
        <Row align='middle' justify='space-between' style={{ height: 80 }}>
          <Col>
            <Breadcrumb />
          </Col>
          <Col>
            <Space
              size='large'
              split={<Divider type='vertical' style={{ height: 42 }} />}
            >
              <NotificationDropdown />
              <AvatarDropdown name='Tan Yuan Jie' role='Super Admin' />
            </Space>
          </Col>
        </Row>
      </Header>
    </div>
  );
};

export default Header;
