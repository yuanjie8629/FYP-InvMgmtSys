import { useAppSelector } from '@/hooks/useRedux';
import { Col, Divider, Layout, Row, Space } from 'antd';
import Breadcrumb from '@components/BreadCrumb';
import AvatarDropdown from '@components/AvatarDropdown';
import NotificationDropdown from '@components/NotificationDropdown';
import classNames from 'classnames';

const Header = () => {
  const { Header } = Layout;
  const isSiderCollapsed = useAppSelector((state) => state.sider.collapsed);
  return (
    <div className='header-fixed'>
      <Header
        className={classNames(
          'header',
          { 'header-collapsed': isSiderCollapsed },
          { 'header-expanded': !isSiderCollapsed }
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