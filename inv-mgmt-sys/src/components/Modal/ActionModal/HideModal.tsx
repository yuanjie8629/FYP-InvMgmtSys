import React, { memo } from 'react';
import { HiEyeOff } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const HideModal = memo(
  ({ multi, recordType, ...props }: ActionModalContentProps, ref) => {
    const { Text } = Typography;

    return (
      <Content
        label='Hide'
        Icon={HiEyeOff}
        color='grey'
        okText='Hide'
        multi={multi}
        {...props}
      >
        <Text type='secondary' className='text-lg'>
          This process cannot be undone.
          <br />
          {multi
            ? `Do you really want to delete the following ${recordType}s?`
            : `Do you really want to delete the specific ${recordType}?`}
        </Text>
      </Content>
    );
  }
);
export default HideModal;
