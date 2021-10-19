import * as React from 'react';
import { Col, Form, Input, Image, Row, Space, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { CaretLeftOutlined } from '@ant-design/icons';
import Button from '../../components/Button/Button';
import './Login.less';
import Hashtag from '../../assets/Hashtag.svg';
import Inventory from '../../assets/LoginBackground.webp';
import Logo from '../../assets/logo.webp';


const Login = () => {
  const screen = useBreakpoint();
  return (
    <>
      {/*Left half screen*/}
      <Row className='container'>
        <Col
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 14, order: 1 }}
          lg={{ span: 14, order: 1 }}
          xl={{ span: 14, order: 1 }}
        >
          {/* Top-left image*/}
          <div className='hashtag'>
            <Image
              src={Hashtag}
              alt='hashtag'
              width='70%'
              height='auto'
              preview={false}
            />
          </div>
          {/*Login Form*/}
          <Row className='formContainer'>
            <Col span={24}>
              <Space direction='vertical' size={10} className='form'>
                {/*Title*/}
                <Typography.Title level={3}> Login</Typography.Title>
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
                      className='input'
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
                      className='input'
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type='primary' size='large' htmlType='submit' block>
                      Login
                    </Button>
                  </Form.Item>
                  <Form.Item style={{ marginTop: -20 }}>
                    <Button type='link' color='info' className='rightAlign'>
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
                      className='leftAlign'
                    >
                      Go back to Sharifah Food E-commerce
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
          md={{ span: 10, order: 2 }}
          lg={{ span: 10, order: 2 }}
          xl={{ span: 10, order: 2 }}
          className='rightPanel'
        >
          <Row justify='center' className='displayPanel'>
            <Col
              xs={{ span: 24, order: 3 }}
              sm={{ span: 24, order: 3 }}
              md={{ span: 24, order: 1 }}
              lg={{ span: 24, order: 1 }}
              xl={{ span: 24, order: 1 }}
              className='logoWrapper'
            >
              <Image src={Logo} alt='logo' width='20%' preview={false} />
            </Col>
            <Col
              xs={{ span: 24, order: 2 }}
              sm={{ span: 24, order: 2 }}
              md={{ span: 24, order: 2 }}
              lg={{ span: 24, order: 2 }}
              xl={{ span: 24, order: 2 }}
              className='responsiveImg'
            >
              <Image
                src={Inventory}
                alt='inventory'
                preview={false}
                className='responsiveImg'
              />
            </Col>
            <Col
              xs={{ span: 24, order: 1 }}
              sm={{ span: 24, order: 1 }}
              md={{ span: 24, order: 3 }}
              lg={{ span: 24, order: 3 }}
              xl={{ span: 24, order: 3 }}
            >
              <Typography.Title level={2} className='title'>
                Inventory Management System
              </Typography.Title>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Login;
