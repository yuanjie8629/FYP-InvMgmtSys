import React, { useState } from 'react';
import { Col, Row, Table, TableProps, Typography, Space } from 'antd';
import './InformativeTable.less';
import { ButtonType } from '@components/Button';

interface RecordType {
  key: string;
}

type InformativeTableButtonProps = {
  element: ButtonType;
  key: string;
  fltr?: {
    fld: string;
    value: string | number | undefined;
    rel: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'; //Relational Operator
  }[];
}[];

interface InformativeTableProps extends TableProps<RecordType> {
  defPg?: number;
  buttons: InformativeTableButtonProps;
}

const InformativeTable = ({ defPg = 10, ...props }: InformativeTableProps) => {
  const { Text } = Typography;
  let [selectedRowKeys, setSelectedRowKeys] = useState();
  let [selectedRowCount, setSelectedRowCount] = useState(0);
  let [btnShow, setBtnShow] = useState<Array<{ key: string; show: boolean }>>(
    []
  );

  const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    if (props.buttons !== undefined) {
      let buttonShow: { key: string; show: boolean }[] = [];

      props.buttons.forEach((btn: any) =>
        selectedRows.forEach((selected: any) => {
          const btnShowCondition = !buttonShow.find(
            (btnToShow) => btnToShow.key === btn.key && !btnToShow.show
          );
          if (
            btn.fltr !== undefined &&
            btn.fltr
              .map(
                (filter: any) =>
                  (filter.rel === 'eq' &&
                    selected[filter.fld] === filter.value) ||
                  (filter.rel === 'neq' &&
                    selected[filter.fld] !== filter.value) ||
                  (filter.rel === 'gt' &&
                    selected[filter.fld] > filter.value) ||
                  (filter.rel === 'gte' &&
                    selected[filter.fld] >= filter.value) ||
                  (filter.rel === 'lt' &&
                    selected[filter.fld] < filter.value) ||
                  (filter.rel === 'lte' && selected[filter.fld] <= filter.value)
              )
              .includes(false)
          ) {
            if (btnShowCondition)
              buttonShow = [
                ...buttonShow.filter((btnToShow) => btnToShow.key !== btn.key),
                { key: btn.key, show: false },
              ];
          } else {
            if (btnShowCondition)
              buttonShow = [
                ...buttonShow.filter((btnToShow) => btnToShow.key !== btn.key),
                { key: btn.key, show: true },
              ];
          }
        })
      );
      setBtnShow([...buttonShow]);
    }
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
      <Row align='middle' gutter={20} style={{ height: 36 }}>
        <Col flex='100px'>
          <Text>Selected: {selectedRowCount}</Text>
        </Col>
        <Col>
          <Space size={15}>
            {props.buttons?.map((btn, index) => {
              const Button = btn.element;
              return btnShow.map(
                (btnToShow) => btnToShow.key === btn.key && btnToShow.show
              )[index] ? (
                <Button />
              ) : null;
            })}
          </Space>
        </Col>
      </Row>
      <Row>
        <Table
          rowSelection={rowSelection}
          pagination={{
            size: 'small',
            showTotal: showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: defPg,
            pageSizeOptions: ['5', '10', '15', '20'],
          }}
          className={'width-full ' + props.className}
          {...props}
        ></Table>
      </Row>
    </Space>
  );
};

export default InformativeTable;
export type { InformativeTableButtonProps };
