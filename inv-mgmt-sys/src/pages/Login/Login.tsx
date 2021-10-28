import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Form, Input, Image, Row, Space, Typography } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import Button from '@components/Button/Button';

import styles from './Login.module.less';
import Hashtag from '@assets/Hashtag.svg';
import Inventory from '@assets/LoginBackground.webp';
import Logo from '@assets/logo.webp';

const Login = () => {
  let history = useHistory();
  const { Title } = Typography;
  return (
    <>
      {/*Left half screen*/}
      <Row className={styles.container}>
        <Col
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 14, order: 1 }}
          lg={{ span: 14, order: 1 }}
          xl={{ span: 14, order: 1 }}
        >
          {/* Top-left image*/}
          <div className={styles.hashtag}>
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
          <Row className={styles.formContainer}>
            <Col span={24}>
              <Space direction='vertical' size={10} className={styles.form}>
                {/*Title*/}
                <Title level={3}> Login</Title>
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
                      className={styles.input}
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
                      className={styles.input}
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
                        history.push('/dashboard');
                      }}
                    >
                      Login
                    </Button>
                  </Form.Item>
                  <Form.Item style={{ marginTop: -20 }}>
                    <Button
                      type='link'
                      color='info'
                      className={styles.rightAlign}
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
                      className={styles.leftAlign}
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
          md={{ span: 10, order: 2 }}
          lg={{ span: 10, order: 2 }}
          xl={{ span: 10, order: 2 }}
          className={styles.rightPanel}
        >
          <Row justify='center' className={styles.displayPanel}>
            <Col
              xs={{ span: 24, order: 3 }}
              sm={{ span: 24, order: 3 }}
              md={{ span: 24, order: 1 }}
              lg={{ span: 24, order: 1 }}
              xl={{ span: 24, order: 1 }}
              className={styles.logoWrapper}
            >
              <Image
                src={Logo}
                alt='logo'
                width='20%'
                preview={false}
                style={{
                  pointerEvents: 'none',
                  userSelect: 'none',
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
              className={styles.responsiveImg}
            >
              <Image src={Inventory} alt='inventory' preview={false} className={styles.invImage} />
            </Col>
            <Col
              xs={{ span: 24, order: 1 }}
              sm={{ span: 24, order: 1 }}
              md={{ span: 24, order: 3 }}
              lg={{ span: 24, order: 3 }}
              xl={{ span: 24, order: 3 }}
            >
              <div className={styles.titleContainer}>
                <Title level={2} className={styles.title}>
                  Inventory Management System
                </Title>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Login;
