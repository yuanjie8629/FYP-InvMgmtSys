import React, { memo } from 'react';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';
import { MdStore } from 'react-icons/md';

const PickupModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content
        label='Confirm Pickup'
        Icon={MdStore}
        okText='Confirm'
        {...props}
      >
        <Text type='secondary' className='text-lg'>
          Do you really want to confirm pickup the following {recordType}s?
        </Text>
      </Content>
    );
  }
);
export default PickupModal;
