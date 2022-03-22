import React, { memo } from 'react';
import { HiThumbUp } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const AcceptModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content label='Accept' Icon={HiThumbUp} okText='Accept' {...props}>
        <Text type='secondary' className='text-lg'>
          Do you really want to accept the following {recordType}s?
        </Text>
      </Content>
    );
  }
);
export default AcceptModal;
