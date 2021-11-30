import React, { useState } from 'react';
import Table, { TableProps } from '@components/Table/Table';
import { Row, Typography, Space } from 'antd';
import './Table.less';

interface InformativeTableProps extends TableProps {
  buttons?: JSX.Element;
}

const InformativeTable = (props: InformativeTableProps) => {
  const { Text } = Typography;
  let [selectedRowKeys, setSelectedRowKeys] = useState();
  let [selectedRowCount, setSelectedRowCount] = useState(0);
  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRowCount(selectedRowKeys.length);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showTotal = (total: number) => {
    return `Total ${total} items`;
  };

  return (
    <Space
      direction='vertical'
      size={20}
      className='informative-table width-full'
    >
      <Row>
        <Text>Selected: {selectedRowCount}</Text>
      </Row>
      <Row>
        <Table
          rowSelection={rowSelection}
          pagination={{
            size: 'small',
            showTotal: showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          {...props}
        ></Table>
      </Row>
    </Space>
  );
};

export default InformativeTable;
