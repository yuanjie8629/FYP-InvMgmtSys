import React, { useState } from 'react';
import Button from '@components/Button/Button';
import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
import { Col, List, Row, Space, Typography, Grid } from 'antd';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';

const AccSettings = () => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [username] = useState('yuanjie');
  const [email] = useState('yuanjie@sharifahfood.com');
  const [phoneNum] = useState('+60 123456789');

  const data = [
    {
      label: 'Username',
      val: username,
      icon: MdPerson,
    },
    {
      label: 'Email',
      val: email,
      icon: MdEmail,
    },
    {
      label: 'Phone Number',
      val: phoneNum,
      icon: MdPhone,
    },
    {
      label: 'Password',
      val: (
        <Text type='secondary'>
          Password must contains at least 8 characters, including 1 uppercase
          letter, 1 number and 1 symbol
        </Text>
      ),
      icon: MdLock,
    },
  ];

  const LoginInfo = (item) => (
    <List.Item actions={[<Button type='primary'>Change</Button>]}>
      <Row className='width-full' align='middle'>
        <Col span={5}>
          <List.Item.Meta
            avatar={<item.icon size={25} className='color-grey' />}
            title={<Text className='text-lg'>{item.label}</Text>}
          />
        </Col>
        <Col>
          {' '}
          <div>{item.val}</div>
        </Col>
      </Row>
    </List.Item>
  );

  return (
    <Layout>
      <div className='acc-settings'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard>
              <Space direction='vertical' size={30} className='width-full'>
                <Title level={4}>Login Information</Title>
                <List
                  size={screens.xl ? 'large' : 'default'}
                  dataSource={data}
                  renderItem={LoginInfo}
                />
              </Space>
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default AccSettings;
