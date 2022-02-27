import { Col, Row, Form, Layout, Typography, Space, Input } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import Img404 from '@assets/404.svg';
import Logo from '@assets/logo.webp';
import { BoldTitle } from '@/components/Title';
import MainCard from '@/components/Card/MainCard';
import ColorCard from '@/components/Card/ColorCard';
import { useState } from 'react';
import { MdCancel, MdCheck } from 'react-icons/md';
import { IconBaseProps } from 'react-icons';

const ResetPass = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const [hasNumberic, setHasNumeric] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);

  const Icon = ({ match, ...props }: IconBaseProps & { match: boolean }) =>
    !match ? (
      <MdCancel className='color-error' />
    ) : (
      <MdCheck className='color-success' />
    );
  return (
    <Form name='resetPass' layout='vertical'>
      <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
        <Col style={{ width: 450 }}>
          <MainCard>
            <Space direction='vertical' size={20} className='full-width'>
              <Title level={4} className='centerFlex'>
                Reset Password
              </Title>
              <ColorCard backgroundColor='grey'>
                <Space direction='vertical' size={0}>
                  <Text>
                    Your password must fulfill the following criteria:
                  </Text>
                  <Icon match={hasNumberic} /> Must contain at least 1 number
                </Space>
              </ColorCard>
              <Space direction='vertical' size={10} className='full-width'>
                <Form.Item
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter new password.',
                    },
                  ]}
                >
                  <Input placeholder='Password' />
                </Form.Item>
                <Form.Item
                  name='confirmPass'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter again the password.',
                    },
                  ]}
                >
                  <Input placeholder='Confirm Password' />
                </Form.Item>
                <Button htmlType='submit' type='primary' block>
                  Reset Password
                </Button>
              </Space>
            </Space>
          </MainCard>
        </Col>
      </Row>
    </Form>
  );
};

export default ResetPass;
