import { Col, Row, Image, Layout, Typography, Space } from 'antd';
import Button from '@components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/RoutingUtils';
import Img404 from '@assets/404.svg';
import Logo from '@assets/logo.webp';
import './NotFound.less';

const NotFound = () => {
  const { Header } = Layout;
  const { Title, Text } = Typography;
  const navigate = useNavigate();
  return (
    <Layout>
      <div className='header-fixed' />
      <Header className='header' style={{ width: '100%' }}>
        <Row justify='center' align='middle' className='height-100'>
          <Col className='not-found-logo-wrapper'>
            <Image
              src={Logo}
              alt='Logo'
              preview={false}
              height='65px'
              className='not-found-logo'
              onClick={() => navigate(findRoutePath('root'), { replace: true })}
            />
          </Col>
          <Col>
            <Title level={3}>Page Not Found</Title>
          </Col>
        </Row>
      </Header>
      <Row justify='center' align='middle' className='not-found'>
        <Space direction='vertical' size={30}>
          <Row>
            <Image
              src={Img404}
              alt='img404'
              preview={false}
              className='not-found-img'
            />
          </Row>
          <Row>
            <Space
              direction='vertical'
              size={15}
              className='not-found-text-container'
            >
              <Title>Oops!</Title>
              <Text className='not-found-text'>
                Looks like you followed a bad link. If you think this is a
                problem with us, please tell us.
              </Text>
            </Space>
          </Row>
          <Row justify='center'>
            <Button
              type='primary'
              className='not-found-btn'
              onClick={() => navigate(findRoutePath('root'), { replace: true })}
            >
              Go Back
            </Button>
          </Row>
        </Space>
      </Row>
    </Layout>
  );
};

export default NotFound;
