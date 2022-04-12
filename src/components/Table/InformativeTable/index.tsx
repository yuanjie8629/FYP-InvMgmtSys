import React, { Key, useEffect, useState } from 'react';
import { Col, Row, Typography, Space } from 'antd';
import './InformativeTable.less';
import { ButtonType } from '@components/Button';
import Table, { TableProps } from '@components/Table';
import { useSearchParams } from 'react-router-dom';
import { addSearchParams, removeSearchParams } from '@utils/urlUtls';

type InformativeTableButtonProps = {
  element: ButtonType;
  key: string;
  fltr?: {
    fld: string;
    value: string | number | boolean | undefined;
    rel: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'; //Relational Operator
  }[];
}[];

export type InformativeTableProps = TableProps & {
  defPg?: number;
  totalRecord?: number;
  currentPg?: number;
} & (
    | {
        buttons: InformativeTableButtonProps;
        rowSelectable?: never | true;
        onSelectChange?: (selectedRowKeys: string[]) => void;
      }
    | { buttons?: never; rowSelectable: false; onSelectChange?: never }
  );

const InformativeTable = ({
  defPg = 10,
  buttons,
  rowSelectable = true,
  onSelectChange = () => null,
  totalRecord,
  currentPg,
  ...props
}: InformativeTableProps) => {
  const { Text } = Typography;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>();
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [btnShow, setBtnShow] = useState<Array<{ key: string; show: boolean }>>(
    []
  );

  useEffect(() => {
    setSelectedRowCount(0);
    setSelectedRowKeys(undefined);
    setBtnShow([]);
  }, [defPg, searchParams, setSearchParams, props.dataSource]);

  const hanldeTableChange = (pagination, _filters, sorter) => {
    let newSearchParams = searchParams;
    if (sorter['order'] !== undefined) {
      let key = sorter['columnKey'];
      let prefix;
      if (key.includes('/')) {
        let split = key.split('/');
        prefix = split[0];
        key = split[1];
      }
      let ordering = 'ordering';
      if (prefix) {
        ordering = `${prefix}_ordering`;
      }
      newSearchParams = new URLSearchParams(
        addSearchParams(
          new URLSearchParams(
            removeSearchParams(newSearchParams, 'ordering', true)
          ),
          {
            [ordering]: `${sorter['order'] === 'descend' ? '-' : ''}${key}`,
          }
        )
      );
    } else {
      newSearchParams = new URLSearchParams(
        removeSearchParams(newSearchParams, 'ordering', true)
      );
    }

    if (pagination !== undefined) {
      if (pagination.current > 1) {
        if (
          Number(newSearchParams.get('limit')) !== pagination.pageSize ||
          Number(newSearchParams.get('offset')) !==
            (pagination.current - 1) * pagination.pageSize
        ) {
          newSearchParams = new URLSearchParams(
            addSearchParams(newSearchParams, {
              limit: String(pagination.pageSize),
              offset: (pagination.current - 1) * pagination.pageSize,
            })
          );
        }
      } else {
        newSearchParams = new URLSearchParams(
          removeSearchParams(
            new URLSearchParams(
              addSearchParams(newSearchParams, {
                limit: String(pagination.pageSize),
              })
            ),
            'offset'
          )
        );
      }
    } else {
      newSearchParams = new URLSearchParams(
        addSearchParams(newSearchParams, { limit: String(defPg) })
      );
    }
    setSearchParams(newSearchParams);
  };

  const handleSelectChange = (selectedRowKeys: any, selectedRows: any) => {
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
    onSelectChange(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
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
      {rowSelectable && (
        <Row align='middle' gutter={20} style={{ height: 36 }}>
          <Col flex='100px'>
            <Text>Selected: {selectedRowCount}</Text>
          </Col>
          <Col>
            <Space size={15}>
              {buttons?.map((btn, index) => {
                const Button = btn.element;
                return (
                  btnShow.map(
                    (btnToShow) => btnToShow.key === btn.key && btnToShow.show
                  )[index] && <Button key={`table-btn-${index}`} />
                );
              })}
            </Space>
          </Col>
        </Row>
      )}
      <Row>
        <Table
          rowSelection={rowSelectable && rowSelection}
          pagination={{
            size: 'small',
            current: currentPg,
            showTotal: showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: defPg,
            pageSizeOptions: ['5', '10', '15', '20'],
            total: totalRecord,
          }}
          onChange={hanldeTableChange}
          {...props}
        />
      </Row>
    </Space>
  );
};

export default InformativeTable;
export type { InformativeTableButtonProps };
