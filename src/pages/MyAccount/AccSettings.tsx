import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import { Space, Typography, Grid } from 'antd';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
import DescriptionList from '@components/List/DescriptionList';
import { BoldTitle } from '@components/Title';
import { adminDetailsAPI } from '@api/services/adminAPI';

const AccSettings = () => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(
    () => {
      let isMounted = true;
      setLoading(true);
      adminDetailsAPI()
        .then((res) => {
          if (isMounted) {
            setData(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setLoading(false);
            // showServerErrMsg();
          }
        });
      return () => {
        isMounted = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const info: {
    key: string;
    title: string;
    desc?: string;
    content: React.ReactNode;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'username',
      title: 'Username',
      content: data['username'],
      icon: <MdPerson size={25} className='color-grey' />,
    },
    {
      key: 'email',
      title: 'Email',
      content: data['email'],
      icon: <MdEmail size={25} className='color-grey' />,
    },
    {
      key: 'phoneNum',
      title: 'Phone Number',
      content: data['phone_num'],
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
        <MainCard loading={loading}>
          <Space direction='vertical' size={30} className='full-width'>
            <BoldTitle level={4}>Login Information</BoldTitle>
            <DescriptionList
              size={screens.xl && screens.xxl ? 'large' : 'default'}
              dataSource={info}
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
