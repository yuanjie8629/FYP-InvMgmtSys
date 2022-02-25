import React, { useState } from 'react';
import { Col, Form, Input, Image, Row, Space, Alert, Typography } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import Button from '@components/Button';
import './Login.less';
import Hashtag from '@assets/Login/Hashtag.svg';
import Inventory from '@assets/Login/LoginBackground.webp';
import Logo from '@assets/logo.webp';
import { Helmet } from 'react-helmet';
import { BoldTitle } from '@/components/Title';
import { loginAPI } from '@/api/services/authAPI';

const Login = () => {
  const { Text } = Typography;
  const [loginErr, setLoginErr] = useState();
  const [loading, setLoading] = useState(false);
  const handleLogin = async (values) => {
    setLoading(true);
    await loginAPI({
      username: values.username,
      password: values.password,
    })
      .then((res) => {
        setLoading(false);
      })
      .catch((e) => {
        setLoginErr(e.response?.status);
        setLoading(false);
      });
  };

  const getErrMsg = loginErr && (
    <Alert
      message={
        <Text type='danger'>
          {loginErr === 401 ? (
            <>
              Invalid username or password.
              <br />
              Please try again.
            </>
          ) : (
            <>
              Your account has been locked.
              <br />
              Please retry after an hour.
            </>
          )}
        </Text>
      }
      type='error'
      showIcon
    />
  );

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
              draggable='false'
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
          </div>
          {/*Login Form*/}
          <Row className='login-form-container'>
            <Col span={24}>
              <div className='login-form'>
                {/*Title*/}
                <BoldTitle level={3} style={{ padding: 20 }}>
                  Login
                </BoldTitle>
                {getErrMsg}
                <Form name='loginForm' layout='vertical' onFinish={handleLogin}>
                  <Space direction='vertical' className='full-width'>
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
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type='primary'
                        size='large'
                        htmlType='submit'
                        block
                        loading={loading}
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
                  </Space>
                </Form>
              </div>
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
                draggable='false'
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
                draggable='false'
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
                <BoldTitle level={2}>Inventory Management System</BoldTitle>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
