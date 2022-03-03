import React, { useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import { Space, Typography, Grid } from 'antd';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
import DescriptionList from '@components/List/DescriptionList';
import { BoldTitle } from '@components/Title';

const AccSettings = () => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [username] = useState('yuanjie');
  const [email] = useState('yuanjie@sharifahfood.com');
  const [phoneNum] = useState('+60 123456789');

  const data: {
    key: string;
    title: string;
    desc?: string;
    content: React.ReactNode;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'username',
      title: 'Username',
      content: username,
      icon: <MdPerson size={25} className='color-grey' />,
    },
    {
      key: 'email',
      title: 'Email',
      content: email,
      icon: <MdEmail size={25} className='color-grey' />,
    },
    {
      key: 'phoneNum',
      title: 'Phone Number',
      content: phoneNum,
      icon: <MdPhone size={25} className='color-grey' />,
    },
    {
      key: 'password',
      title: 'Password',
      content: (
        <Text type='secondary'>
          Password must contains at least 8 characters, including 1 uppercase
          letter, 1 number and 1 symbol
        </Text>
      ),
      icon: <MdLock size={25} className='color-grey' />,
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='acc-settings'>
        <MainCard>
          <Space direction='vertical' size={30} className='full-width'>
            <BoldTitle level={4}>Login Information</BoldTitle>
            <DescriptionList
              size={screens.xl && screens.xxl ? 'large' : 'default'}
              dataSource={data}
              buttons={['Change']}
              buttonProps={{ type: 'primary' }}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default AccSettings;
