import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Input, Image, Row, Space, Typography } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import Button from '@components/Button/Button';
import './Login.less';
import Hashtag from '@assets/Login/Hashtag.svg';
import Inventory from '@assets/Login/LoginBackground.webp';
import Logo from '@assets/logo.webp';
import { Helmet } from 'react-helmet';

const Login = () => {
  let navigate = useNavigate();
  const { Title } = Typography;
  return (
    <div className='login'>
      <Helmet>
        <meta name='viewport' content='width=576'></meta>
      </Helmet>
      {/*Left half screen*/}
      <Row className='login-container'>
        <Col
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 24, order: 2 }}
          lg={{ span: 14, order: 1 }}
          xl={{ span: 14, order: 1 }}
        >
          {/* Top-left image*/}
          <div className='login-hashtag'>
            <Image
              src={Hashtag}
              alt='hashtag'
              width='70%'
              height='auto'
              preview={false}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
          </div>
          {/*Login Form*/}
          <Row className='login-form-container'>
            <Col span={24}>
              <Space direction='vertical' size={10} className='login-form'>
                {/*Title*/}
                <Title level={3} style={{ padding: 20 }}>
                  Login
                </Title>
                <Form name='login'>
                  <Form.Item
                    name='username'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your Username!',
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input
                      size='large'
                      placeholder='Username'
                      allowClear
                      className='login-input'
                    />
                  </Form.Item>
                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your Password!',
                      },
                    ]}
                  >
                    <Input.Password
                      size='large'
                      placeholder='Password'
                      className='login-input'
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type='primary'
                      size='large'
                      htmlType='submit'
                      block
                      onClick={() => {
                        navigate('/dashboard', { replace: true });
                      }}
                    >
                      Login
                    </Button>
                  </Form.Item>
                  <Form.Item style={{ marginTop: -20 }}>
                    <Button
                      type='link'
                      color='info'
                      className='login-right-align'
                    >
                      Forgot Password
                    </Button>
                  </Form.Item>
                  <Form.Item style={{ marginTop: -20, marginBottom: 0 }}>
                    <Button
                      type='link'
                      color='info'
                      icon={
                        <CaretLeftOutlined
                          style={{ position: 'relative', left: 5 }}
                        />
                      }
                      className='login-left-align'
                    >
                      Go to Sharifah Food E-commerce
                    </Button>
                  </Form.Item>
                </Form>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 24, order: 1 }}
          lg={{ span: 10, order: 2 }}
          xl={{ span: 10, order: 2 }}
          className='login-right-panel'
        >
          <Row justify='center' className='login-display-panel'>
            <Col
              xs={{ span: 24, order: 3 }}
              sm={{ span: 24, order: 3 }}
              md={{ span: 24, order: 3 }}
              lg={{ span: 24, order: 1 }}
              xl={{ span: 24, order: 1 }}
              className='login-logo-wrapper'
            >
              <Image
                src={Logo}
                alt='logo'
                width='20%'
                preview={false}
                style={{
                  float: 'right',
                }}
              />
            </Col>
            <Col
              xs={{ span: 24, order: 2 }}
              sm={{ span: 24, order: 2 }}
              md={{ span: 24, order: 2 }}
              lg={{ span: 24, order: 2 }}
              xl={{ span: 24, order: 2 }}
              className='login-responsive-img-wrapper'
            >
              <Image
                src={Inventory}
                alt='inventory'
                preview={false}
                className='login-responsive-img'
              />
            </Col>
            <Col
              xs={{ span: 24, order: 1 }}
              sm={{ span: 24, order: 1 }}
              md={{ span: 24, order: 1 }}
              lg={{ span: 24, order: 3 }}
              xl={{ span: 24, order: 3 }}
            >
              <div className='login-title-container'>
                <Title level={2}>Inventory Management System</Title>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
