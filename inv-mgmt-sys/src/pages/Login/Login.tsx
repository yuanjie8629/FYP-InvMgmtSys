import * as React from 'react';
import { Col, Form, Input, Image, Row, Space, Typography } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import Button from '../../components/Button';
import './Login.less';
import Hashtag from '../../assets/Hashtag.svg';
import Inventory from '../../assets/LoginBackground.webp';

const Login = () => {
  return (
    <div>
      {/*Left half screen*/}
      <Row>
        <Col span={14}>
          <Space direction='vertical' className='container'>
            {/* Top-left image*/}
            <Image
              src={Hashtag}
              alt='hashtag'
              width='40%'
              height='auto'
              preview={false}
            />
            {/*Login Form*/}
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
          </Space>
        </Col>
        <Col span={10} style={{ height: '100vh' }}>
          <Image
            src={Inventory}
            alt='inventory'
            width='100%'
            height='100%'
            preview={false}
            style={{ objectFit: 'cover' }}
          />

          <Typography.Title level={2} className='title'>
            Inventory Management System
          </Typography.Title>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
