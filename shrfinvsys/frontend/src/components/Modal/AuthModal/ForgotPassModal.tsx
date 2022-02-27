import React, { memo, useState } from 'react';
import { Form, Input, Space, Typography } from 'antd';
import Button from '@/components/Button';
import AuthModal, { AuthModalContentProps } from '.';
import { forgotPassAPI } from '@/api/services/authAPI';
import { useForm } from 'antd/lib/form/Form';

const ForgotPassModal = memo(
  ({ onOk, onCancel, ...props }: AuthModalContentProps, _ref) => {
    const { Text, Title } = Typography;
    const [forgotPass] = useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values) => {
      setLoading(true);
      forgotPassAPI(values.email).then(() => {
        setLoading(false);
        AuthModal.show('checkEmail')
      });
    };

    return (
      <Form name='forgotPass' form={forgotPass} layout='vertical' onFinish={handleSubmit}>
        <Space
          direction='vertical'
          size={20}
          align='center'
          style={{ textAlign: 'center' }}
          className='full-width'
        >
          <Title level={4} className='color-primary'>
            Forgot Password
          </Title>
          <Text>
            Please enter your email address below and we will send you further
            insturctions on how to reset your password.
          </Text>
          <Form.Item
            name='email'
            rules={[
              {
                required: true,
                message: 'Please enter valid email address.',
                type: 'email',
              },
            ]}
          >
            <Input placeholder='Email address' style={{ width: 420 }} />
          </Form.Item>
          <Button htmlType='submit' type='primary' loading={loading}>
            Reset Password
          </Button>
        </Space>
      </Form>
    );
  }
);

export default ForgotPassModal;
