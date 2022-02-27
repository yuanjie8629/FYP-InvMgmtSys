import React, { memo } from 'react';
import { HiTrash } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const DeleteModal = memo(
  ({ multi, recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content
        label='Delete'
        Icon={HiTrash}
        color='error'
        okText='Delete'
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

export default DeleteModal;
