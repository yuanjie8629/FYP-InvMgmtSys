import React, { memo } from 'react';
import { HiPrinter } from 'react-icons/hi';
import Content from './Content';
import { Typography } from 'antd';
import { ActionModalContentProps } from '.';

const InvoiceModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;

    return (
      <Content
        label='Generate Invoices'
        Icon={HiPrinter}
        okText='Generate'
        {...props}
      >
        <Text type='secondary' className='text-lg'>
          Do you really want to generate the following {recordType} invoices?
        </Text>
      </Content>
    );
  }
);
export default InvoiceModal;
