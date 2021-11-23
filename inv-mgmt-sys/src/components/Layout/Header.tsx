import { useAppSelector } from '@hooks/reduxHooks';
import { Col, Divider, Layout, Row, Space } from 'antd';
import Breadcrumb from '@components/BreadCrumb/BreadCrump';
import AvatarDropdown from '@components/AvatarDropdown/AvatarDropdown';
import NotificationDropdown from '@components/NotificationDropdown/NotificationDropdown';
import classNames from 'classnames';
const Header = () => {
  const { Header } = Layout;
  const isSiderCollapsed = useAppSelector((state) => state.sider.value);
  return (
    <div className='header-fixed'>
      <Header
        className={classNames(
          'header',
          { 'header-collapsed': isSiderCollapsed },
          { 'header-expanded': !isSiderCollapsed }
        )}
      >
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

export default Header;
