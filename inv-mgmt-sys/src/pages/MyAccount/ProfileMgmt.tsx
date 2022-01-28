import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
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
      <div className='profile-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard>
              <Space direction='vertical' size={50} className='width-full'>
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
                      <Title
                        type='secondary'
                        level={5}
                        style={{ fontWeight: 500 }}
                      >
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

                    <Form.Item
                      label='Name'
                      name='name'
                      initialValue='Tan Yuan Jie'
                    >
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
                      <DatePicker className='width-full' />
                    </Form.Item>
                    <Row justify='end' style={{ marginTop: 20 }}>
                      <Button htmlType='submit' type='primary' size='large'>
                        Save
                      </Button>
                    </Row>
                  </Form>
                </Row>
              </Space>
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default ProfileMgmt;
