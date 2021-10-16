import * as React from 'react';
import { Col, Form, Input, Image, Row, Space, Typography } from 'antd';
import Button from '../../components/Button';
import './Login.less';
import Hashtag from '../../assets/Hashtag.svg';
import Inventory from '../../assets/LoginBackground.jpg';

const Login = () => {
  return (
    <>
      {/*Left half screen*/}
      <Row>
        <Col span={14}>
          {/* Top-left image*/}
          <Image
            src={Hashtag}
            alt='inventory'
            width='40%'
            height='auto'
            preview={false}
          />
          {/*Login Form*/}
          <div className='container'>
            <Space direction='vertical' size={10}>
              {/*Title*/}
              <Typography.Title level={3}> Login</Typography.Title>
              <Form name='login'>
                <Form.Item
                  name='username'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your Username!',
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
              </Form>
              <Button type='link' color='info'>
                Forgot Password
              </Button>
            </Space>
          </div>
        </Col>
        <Col span={10} style={{ height: '100vh' }}>
          <Image
            src={Inventory}
            alt='inventory'
            width='100%'
            height='100vh'
            preview={false}
            style={{ objectFit: 'cover' }}
          />
        </Col>
      </Row>
    </>
  );
};

export default Login;
