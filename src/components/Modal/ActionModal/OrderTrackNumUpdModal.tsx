import React, { memo, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import Content from './Content';
import { Row, Typography, Col, Input } from 'antd';
import { ActionModalContentProps } from '.';

const OrderTrackNumUpdModal = memo(
  ({ recordType, ...props }: ActionModalContentProps, _ref) => {
    const { Text } = Typography;
    const [updateData, setUpdateData] = useState([]);

    const ListContent = (item) => (
      <Input
        defaultValue={item.content}
        onChange={(e) => {
          let newData = updateData.filter((datum) => datum.id !== item.key);
          setUpdateData([
            ...newData,
            { id: item.key, track_num: e.target.value },
          ]);
        }}
        style={{ margin: 5 }}
      />
    );

    const handleOk = () => {
      updateData.length > 0 && props.onUpdate(updateData);
    };

    return (
      <Content
        label='Tracking Number Update'
        Icon={HiPencilAlt}
        okText='Update'
        {...props}
        listProps={{ bordered: false }}
        contentSpace={false}
        listContent={ListContent}
        onOk={handleOk}
      >
        <Row justify='end'>
          <Col pull={6}>
            <Text strong>Tracking Number</Text>
          </Col>
        </Row>
      </Content>
    );
  }
);

export default OrderTrackNumUpdModal;
