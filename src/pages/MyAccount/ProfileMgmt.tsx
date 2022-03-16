import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Avatar,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import AvatarImg from '@assets/avatar.png';
import Button from '@components/Button';
import moment from 'moment';
import { genderCat } from '@utils/optionUtils';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { useEffect, useState } from 'react';
import { adminDetailsAPI } from '@api/services/adminAPI';
import { useForm } from 'antd/lib/form/Form';

const ProfileMgmt = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const [profileForm] = useForm();
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
            profileForm.setFieldsValue(res.data);
            profileForm.setFieldsValue({
              birthdate: moment(res.data.birthdate, 'DD-MM-YYYY'),
            });
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

  return (
    <Layout>
      <MainCardContainer className='profile-mgmt'>
        <MainCard loading={loading}>
          <Space direction='vertical' size={50} className='full-width'>
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
              >
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
                <Row justify='end' style={{ marginTop: 20 }}>
                  <Button htmlType='submit' type='primary' size='large'>
                    Save
                  </Button>
                </Row>
              </Form>
            </Row>
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default ProfileMgmt;
