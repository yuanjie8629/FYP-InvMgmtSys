import React, { useState } from 'react';
import Button from '@components/Button';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
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
      value: username,
      icon: MdPerson,
    },
    {
      label: 'Email',
      value: email,
      icon: MdEmail,
    },
    {
      label: 'Phone Number',
      value: phoneNum,
      icon: MdPhone,
    },
    {
      label: 'Password',
      value: (
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
      <Row className='full-width' align='middle'>
        <Col span={5}>
          <List.Item.Meta
            avatar={<item.icon size={25} className='color-grey' />}
            title={<Text className='text-lg'>{item.label}</Text>}
          />
        </Col>
        <Col>
          {' '}
          <div>{item.value}</div>
        </Col>
      </Row>
    </List.Item>
  );

  return (
    <Layout>
      <MainCardContainer className='acc-settings'>
        <MainCard>
          <Space direction='vertical' size={30} className='full-width'>
            <Title level={4}>Login Information</Title>
            <List
              size={screens.xl && screens.xxl ? 'large' : 'default'}
              dataSource={data}
              renderItem={LoginInfo}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default AccSettings;
