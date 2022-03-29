import React, { memo, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import Content from './Content';
import { Row, Typography, Col, InputNumber } from 'antd';
import { ActionModalContentProps } from '.';

const InvBulkUpdateModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;
    const [updateData, setUpdateData] = useState([]);

    const ListContent = (item) => (
      <InputNumber
        defaultValue={item.content}
        min={0}
        style={{
          width: '32%',
        }}
        onChange={(value) => {
          let newData = updateData.filter((datum) => datum.id !== item.key);
          setUpdateData([...newData, { id: item.key, stock: value }]);
        }}
      />
    );

    const handleOk = () => {
      updateData.length > 0 && props.onUpdate(updateData);
    };

    return (
      <Content
        label='Bulk Update'
        Icon={HiPencilAlt}
        okText='Update'
        {...props}
        listProps={{ bordered: false }}
        contentSpace={false}
        listContent={ListContent}
        onOk={handleOk}
      >
        <Row justify='end'>
          <Col pull={4}>
            <Text strong>Stock</Text>
          </Col>
        </Row>
      </Content>
    );
  }
);

export default InvBulkUpdateModal;
