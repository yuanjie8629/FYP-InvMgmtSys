import React, { memo } from 'react';
import { HiPause } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const SuspendModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content
        label='Suspend'
        Icon={HiPause}
        color='error'
        okText='Suspend'
        {...props}
      >
        <Text type='secondary' className='text-lg'>
          Do you really want to suspend the following {recordType}s?
        </Text>
      </Content>
    );
  }
);
export default SuspendModal;
