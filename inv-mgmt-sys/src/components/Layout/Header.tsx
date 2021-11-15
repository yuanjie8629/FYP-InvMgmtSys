import { Col, Divider, Layout, Row, Space } from 'antd';
import Breadcrumb from '@components/BreadCrumb/BreadCrumb';
import AvatarDropdown from '@components/AvatarDropdown/AvatarDropdown';
import NotificationDropdown from '@components/NotificationDropdown/NotificationDropdown';

const CustomHeader = () => {
  const { Header } = Layout;
  return (
    <div className='header-fixed'>
      <Header className='header'>
        <Row align='middle' justify='space-between' style={{ height: 80 }}>
          <Col>
            <Breadcrumb />
          </Col>
          <Col>
            <Space split={<Divider type='vertical' style={{ height: 42 }} />}>
              <NotificationDropdown />
              <AvatarDropdown />
            </Space>
          </Col>
        </Row>
      </Header>
    </div>
  );
};

export default CustomHeader;
