import React, { memo } from 'react';
import { HiEyeOff } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const HideModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content
        label='Hide'
        Icon={HiEyeOff}
        color='grey'
        okText='Hide'
        {...props}
      >
        <Text type='secondary' className='text-lg'>
          Do you really want to hide the following {recordType}s?
        </Text>
      </Content>
    );
  }
);
export default HideModal;
