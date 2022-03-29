import React, { memo } from 'react';
import { HiXCircle } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const CancelModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content
        label='Cancellation'
        Icon={HiXCircle}
        color='error'
        okText='Confirm'
        {...props}
      >
        <Text type='secondary' className='text-lg'>
          This process cannot be undone.
          <br />
          Do you really want to cancel the following {recordType}s?
        </Text>
      </Content>
    );
  }
);

export default CancelModal;
