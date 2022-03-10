import React, { memo } from 'react';
import { HiCheck } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const ActivateModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content label='Activate' Icon={HiCheck} okText='Activate' {...props}>
        <Text type='secondary' className='text-lg'>
          Do you really want to activate the following {recordType}s?
        </Text>
      </Content>
    );
  }
);
export default ActivateModal;
