import React, { memo } from 'react';
import { Space, Typography } from 'antd';
import Button from '@components/Button';
import { AuthModalContentProps } from '.';
import EmailSuccess from '@assets/Login/emailSuccess.png';

const CheckEmailModal = memo(
  ({ args, onOk, onCancel, ...props }: AuthModalContentProps, _ref) => {
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
          An email has been sent to the email address
          {args?.email && (
            <>
              , <Text className='color-primary'>{args?.email}</Text>
            </>
          )}
          .
          <br />
          Please check and verify it.
        </Text>
        <Button htmlType='submit' type='primary' onClick={onOk}>
          Got it
        </Button>
      </Space>
    );
  }
);

export default CheckEmailModal;
