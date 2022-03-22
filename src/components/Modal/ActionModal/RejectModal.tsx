import React, { memo } from 'react';
import { HiThumbDown } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const RejectModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content label='Reject' Icon={HiThumbDown} color='error' okText='Reject' {...props}>
        <Text type='secondary' className='text-lg'>
          Do you really want to accept the following {recordType}s?
        </Text>
      </Content>
    );
  }
);
export default RejectModal;
