import React, { useState } from 'react';
import { Col, Row, Typography, Space } from 'antd';
import './InformativeTable.less';
import { ButtonType } from '@components/Button';
import Table, { TableProps } from '@components/Table';

type InformativeTableButtonProps = {
  element: ButtonType;
  key: string;
  fltr?: {
    fld: string;
    value: string | number | undefined;
    rel: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'; //Relational Operator
  }[];
}[];

type InformativeTableProps = TableProps & { defPg?: number } & (
    | {
        buttons: InformativeTableButtonProps;
        rowSelectable?: never | true;
      }
    | { buttons?: never; rowSelectable: false }
  );

const InformativeTable = ({
  defPg = 10,
  buttons,
  rowSelectable = true,
  ...props
}: InformativeTableProps) => {
  const { Text } = Typography;
  let [selectedRowKeys, setSelectedRowKeys] = useState();
  let [selectedRowCount, setSelectedRowCount] = useState(0);
  let [btnShow, setBtnShow] = useState<Array<{ key: string; show: boolean }>>(
    []
  );

  const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    if (buttons !== undefined) {
      let buttonShow: { key: string; show: boolean }[] = [];

      buttons.forEach((btn: any) =>
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
      className='informative-table full-width'
    >
      {rowSelectable ? (
        <Row align='middle' gutter={20} style={{ height: 36 }}>
          <Col flex='100px'>
            <Text>Selected: {selectedRowCount}</Text>
          </Col>
          <Col>
            <Space size={15}>
              {buttons?.map((btn, index) => {
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
      ) : null}
      <Row>
        <Table
          rowSelection={rowSelectable ? rowSelection : null}
          pagination={{
            size: 'small',
            showTotal: showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: defPg,
            pageSizeOptions: ['5', '10', '15', '20'],
          }}
          {...props}
        />
      </Row>
    </Space>
  );
};

export default InformativeTable;
export type { InformativeTableButtonProps };