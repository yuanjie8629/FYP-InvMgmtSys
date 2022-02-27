import React, { memo } from 'react';
import { Space, Typography } from 'antd';
import Button from '@/components/Button';
import { AuthModalContentProps } from '.';
import EmailSuccess from '@assets/Login/emailSuccess.png';

const CheckEmailModal = memo(
  ({ onOk, onCancel, ...props }: AuthModalContentProps, _ref) => {
    const { Text, Title } = Typography;

    return (
      <Space
        direction='vertical'
        size={20}
        align='center'
        style={{ textAlign: 'center' }}
        className='full-width'
      >
        <img src={EmailSuccess} alt='emailSuccess' width={120} />
        <Title level={5}>Check Your Email</Title>
        <Text>
          We sent you an email with instructions on how to reset your password.
          <br />
          You will only receive our email if your email is registered in our
          system.
        </Text>
        <Button htmlType='submit' type='primary' onClick={onOk}>
          Got it
        </Button>
      </Space>
    );
  }
);

export default CheckEmailModal;
