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

const ProfileMgmt = () => {
  const { Text, Title } = Typography;
  const ChangeBtn = (props) => (
    <Button type='link' color='info' {...props}>
      <Text underline className='color-info'>
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
        <MainCard>
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
                  <Title level={4} style={{ fontWeight: 500 }}>
                    Tan Yuan Jie
                  </Title>
                  <Title type='secondary' level={5} style={{ fontWeight: 500 }}>
                    Super Admin
                  </Title>
                </Space>
              </Col>
            </Row>
            <Row justify='center'>
              <Form
                name='profileForm'
                size='small'
                labelCol={{ span: 6 }}
                wrapperCol={{ offset: 2 }}
                style={{ width: '50%' }}
              >
                <Form.Item label='Username' name='username'>
                  <InputText>yuanjie</InputText>
                  <ChangeBtn />
                </Form.Item>

                <Form.Item label='Name' name='name' initialValue='Tan Yuan Jie'>
                  <Input />
                </Form.Item>

                <Form.Item label='Email Address' name='email'>
                  <InputText>yuanjie@sharifahfood.com</InputText>
                  <ChangeBtn />
                </Form.Item>

                <Form.Item label='Phone Number' name='phoneNum'>
                  <InputText>+60 123456789</InputText>
                  <ChangeBtn />
                </Form.Item>
                <Form.Item label='Gender' name='gender' initialValue='m'>
                  <Radio.Group options={genderCat} />
                </Form.Item>
                <Form.Item
                  label='Birthdate'
                  name='birthdate'
                  initialValue={moment('2000-08-17')}
                >
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
