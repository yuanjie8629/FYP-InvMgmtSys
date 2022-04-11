import { Col, Row, Image, Layout, Typography, Space } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import Img404 from '@assets/404.svg';
import './NotFound.less';
import { BoldTitle } from '@components/Title';

const NotFound = () => {
  const { Header } = Layout;
  const { Text } = Typography;
  const navigate = useNavigate();
  return (
    <Layout className='not-found-layout'>
      <div className='header-fixed' />
      <Header className='header' style={{ width: '100%' }}>
        <Row justify='center' align='middle' className='full-height'>
          <Col className='not-found-logo-wrapper'>
            <Image
              src='https://res.cloudinary.com/yuanjie/image/upload/v1645908976/Shrf/logo_mvamgs.png'
              alt='Logo'
              preview={false}
              height='65px'
              className='not-found-logo'
              onClick={() => navigate(findRoutePath('root'))}
            />
          </Col>
          <Col>
            <BoldTitle level={3}>Page Not Found</BoldTitle>
          </Col>
        </Row>
      </Header>
      <Row justify='center' align='middle' className='not-found'>
        <Space direction='vertical' size={30}>
          <Row className='not-found-img-container'>
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
              <BoldTitle className='not-found-title'>Oops!</BoldTitle>
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
              onClick={() => navigate(findRoutePath('root'))}
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
