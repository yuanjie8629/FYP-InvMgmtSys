import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Alert,
  Avatar,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import AvatarImg from '@assets/avatar.png';
import Button from '@components/Button';
import moment from 'moment';
import { genderCat } from '@utils/optionUtils';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { useContext, useEffect, useState } from 'react';
import { adminDetailsAPI, adminUpdateAPI } from '@api/services/adminAPI';
import { useForm } from 'antd/lib/form/Form';
import { getDt } from '@utils/dateUtils';
import { removeInvalidData } from '@utils/arrayUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { MessageContext } from '@contexts/MessageContext';

const ProfileMgmt = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const [profileForm] = useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  const getAdminDetails = (isMounted = true) => {
    setLoading(true);
    adminDetailsAPI()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          profileForm.setFieldsValue(res.data);
          if (res.data.birthdate) {
            profileForm.setFieldsValue({
              birthdate: moment(res.data.birthdate, 'DD-MM-YYYY'),
            });
          }
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

  const ChangeBtn = (props) => (
    <Button type='link' color='info' {...props}>
      <Text
        underline
        className='color-info'
        onClick={() => {
          navigate(findRoutePath('accSettings'));
        }}
      >
        Change
      </Text>
    </Button>
  );

  const InputText = (props) => (
    <Text style={{ marginRight: 30 }}>{props.children}</Text>
  );

  const handleEditProfile = (values) => {
    if (values.birthdate) {
      values.birthdate = getDt(values.birthdate);
    }

    values = removeInvalidData(values);
    setSubmitLoading(true);
    adminUpdateAPI(values)
      .then((res) => {
        messageApi.open({
          type: 'success',
          content: 'Your account information is updated.',
        });
        setSubmitLoading(false);
        profileForm.resetFields();
        getAdminDetails();
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.data?.error === 'invalid_password') {
            setErrMsg('The password entered is invalid');
            setSubmitLoading(false);
            return;
          }
          setSubmitLoading(false);
          showServerErrMsg();
        }
      });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Layout>
      <MainCardContainer className='profile-mgmt'>
        <MainCard>
          <Space direction='vertical' size={50} className='full-width'>
            {loading || Object.keys(data).length <= 0 ? (
              <>
                <Row justify='center' align='middle' gutter={50}>
                  <Col>
                    <Skeleton.Avatar active={loading} size={170} />
                  </Col>
                  <Col span={4}>
                    <Skeleton active={loading} paragraph={{ rows: 1 }} />
                  </Col>
                </Row>
                <Row justify='center' className='center-flex'>
                  <Col span={12}>
                    <Skeleton
                      active={loading}
                      title={null}
                      paragraph={{ rows: 10, width: '100%' }}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row justify='center' align='middle' gutter={50}>
                  <Col pull={1}>
                    <Avatar
                      src={AvatarImg}
                      alt='avatar'
                      size={170}
                      className='avatarDropdown-avatar'
                      style={{
                        filter: 'drop-shadow(2px 4px 10px rgba(0, 0, 0, 0.25))',
                      }}
                    />
                  </Col>
                  <Col pull={1}>
                    <Space direction='vertical'>
                      <Title level={4}>{data['name']}</Title>
                      <Title type='secondary' level={5}>
                        {data['is_superuser'] ? 'Super Admin' : 'Admin'}
                      </Title>
                    </Space>
                  </Col>
                </Row>
                <Row justify='center'>
                  <Form
                    name='profileForm'
                    form={profileForm}
                    size='small'
                    labelCol={{ span: 6 }}
                    wrapperCol={{ offset: 2 }}
                    style={{ width: '50%' }}
                    onFinish={handleEditProfile}
                  >
                    {errMsg && (
                      <Alert
                        message={<Text type='danger'>{errMsg}</Text>}
                        type='error'
                        showIcon
                        style={{ marginBottom: 20 }}
                      />
                    )}
                    <Form.Item label='Username' name='username'>
                      <InputText>{data['username']}</InputText>
                      <ChangeBtn />
                    </Form.Item>

                    <Form.Item label='Name' name='name'>
                      <Input />
                    </Form.Item>

                    <Form.Item label='Email Address' name='email'>
                      <InputText>{data['email']}</InputText>
                      <ChangeBtn />
                    </Form.Item>

                    <Form.Item label='Phone Number' name='phone_num'>
                      <InputText>{data['phone_num']}</InputText>
                      <ChangeBtn />
                    </Form.Item>
                    <Form.Item label='Gender' name='gender'>
                      <Radio.Group options={genderCat} />
                    </Form.Item>
                    <Form.Item label='Birthdate' name='birthdate'>
                      <DatePicker className='full-width' />
                    </Form.Item>
                    <Form.Item
                      label='Password'
                      name='password'
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your password.',
                        },
                      ]}
                    >
                      <Input.Password
                        onChange={() => {
                          setErrMsg('');
                        }}
                      />
                    </Form.Item>
                    <Row justify='end' style={{ marginTop: 20 }}>
                      <Button
                        htmlType='submit'
                        type='primary'
                        size='large'
                        loading={submitLoading}
                      >
                        Save
                      </Button>
                    </Row>
                  </Form>
                </Row>
              </>
            )}
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default ProfileMgmt;
