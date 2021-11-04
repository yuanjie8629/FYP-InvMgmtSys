import { Col, Layout, Row } from 'antd';
import Breadcrumb from '@components/BreadCrumb/BreadCrumb';
import AvatarDropdown from '@components/AvatarDropdown/AvatarDropdown';
import './Layout.less';

const CustomHeader = () => {
  const { Header } = Layout;
  return (
    <div className='header-fixed'>
      <Header className='header'>
        <Row align='middle' style={{ height: 'fit-content' }}>
          <Col span={12}>
            <Breadcrumb />
          </Col>
          <Col offset={5}>
            <AvatarDropdown />
          </Col>
        </Row>
      </Header>
    </div>
  );
};

export default CustomHeader;
