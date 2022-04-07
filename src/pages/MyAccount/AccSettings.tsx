import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Space,
  Typography,
  Grid,
  Skeleton,
  ModalProps,
  List,
  Row,
  Col,
} from 'antd';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
import DescriptionList from '@components/List/DescriptionList';
import { BoldTitle } from '@components/Title';
import { adminDetailsAPI } from '@api/services/adminAPI';
import ChangePassModal from './ChangePassModal';
import ChangePhoneNumModal from './ChangePhoneNumModal';
import ChangeEmailModal from './ChangeEmailModal';
import ChangeUsernameModal from './ChangeUsernameModal';

export interface AccSettingsModalProps extends ModalProps {
  onUpdate?: () => void;
}

const AccSettings = () => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showChangePhoneNum, setShowChangePhoneNum] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);

  const getAdminDetails = (isMounted = true) => {
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
  };

  useEffect(
    () => {
      let isMounted = true;

      getAdminDetails(isMounted);
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
        <MainCard>
          <Space direction='vertical' size={30} className='full-width'>
            <BoldTitle level={4}>Login Information</BoldTitle>
            {loading || Object.keys(data).length <= 0  ? (
              <List
                dataSource={Array.from(Array(4).keys())}
                renderItem={(item) => (
                  <List.Item>
                    <Row
                      justify='space-between'
                      align='middle'
                      className='full-width'
                    >
                      <Col span={21}>
                        <Skeleton active={loading} paragraph={null} />
                      </Col>
                      <Col pull={1}>
                        <Skeleton.Button active={loading} />
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            ) : (
              <DescriptionList
                size={screens.xl && screens.xxl ? 'large' : 'default'}
                dataSource={info}
                buttons={['Change']}
                buttonProps={{ type: 'primary' }}
                onButtonClick={(key) => {
                  if (key === 'password') {
                    setShowChangePass(true);
                  } else if (key === 'phoneNum') {
                    setShowChangePhoneNum(true);
                  } else if (key === 'email') {
                    setShowChangeEmail(true);
                  } else if (key === 'username') {
                    setShowChangeUsername(true);
                  }
                }}
              />
            )}
          </Space>
        </MainCard>
      </MainCardContainer>
      <ChangePassModal
        visible={showChangePass}
        onCancel={() => {
          setShowChangePass(false);
        }}
        onUpdate={() => {
          getAdminDetails();
        }}
      />
      <ChangePhoneNumModal
        visible={showChangePhoneNum}
        onCancel={() => {
          setShowChangePhoneNum(false);
        }}
        onUpdate={() => {
          getAdminDetails();
        }}
      />
      <ChangeEmailModal
        visible={showChangeEmail}
        onCancel={() => {
          setShowChangeEmail(false);
        }}
        onUpdate={() => {
          getAdminDetails();
        }}
      />
      <ChangeUsernameModal
        visible={showChangeUsername}
        onCancel={() => {
          setShowChangeUsername(false);
        }}
        onUpdate={() => {
          getAdminDetails();
        }}
      />
    </Layout>
  );
};

export default AccSettings;
