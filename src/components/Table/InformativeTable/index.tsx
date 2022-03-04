import React, { useEffect, useState } from 'react';
import { Col, Row, Typography, Space, TablePaginationConfig } from 'antd';
import './InformativeTable.less';
import { ButtonType } from '@components/Button';
import Table, { TableProps } from '@components/Table';
import { useSearchParams } from 'react-router-dom';
import { addSearchParams, removeSearchparams } from '@utils/urlUtls';

type InformativeTableButtonProps = {
  element: ButtonType;
  key: string;
  fltr?: {
    fld: string;
    value: string | number | undefined;
    rel: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'; //Relational Operator
  }[];
}[];

type InformativeTableProps = TableProps & {
  defPg?: number;
  totalRecord?: number;
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
  onSelectChange = () => '',
  totalRecord,
  ...props
}: InformativeTableProps) => {
  const { Text } = Typography;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>();
  const [btnShow, setBtnShow] = useState<Array<{ key: string; show: boolean }>>(
    []
  );

  useEffect(() => {
    if (pagination !== undefined) {
      if (pagination.current > 1) {
        setSearchParams(
          addSearchParams(searchParams, {
            limit: String(pagination.pageSize),
            offset: (pagination.current - 1) * pagination.pageSize,
          })
        );
      } else {
        setSearchParams(
          removeSearchparams(
            new URLSearchParams(
              addSearchParams(searchParams, {
                limit: String(pagination.pageSize),
              })
            ),
            'offset'
          )
        );
      }
    } else
      setSearchParams(addSearchParams(searchParams, { limit: String(defPg) }));
  }, [defPg, pagination, searchParams, setSearchParams]);

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
            showTotal: showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: defPg,
            pageSizeOptions: ['5', '10', '15', '20'],
            total: totalRecord,
          }}
          onChange={(paginate, _filters, sorter) => {
            setPagination(paginate);
            if (sorter['column'] !== undefined) {
              let currSearchParams = {};
              searchParams.forEach((value, key) => {
                currSearchParams = {
                  ...currSearchParams,
                  [key]: value,
                };
              });
              setSearchParams({
                ...currSearchParams,
                order: `${sorter['order'] === 'descend' ? '-' : ''}${
                  sorter['columnKey']
                }`,
              });
            } else {
              let currSearchParams = {};
              searchParams.forEach((value, key) => {
                currSearchParams = {
                  ...currSearchParams,
                  [key]: value,
                };
              });
              delete currSearchParams['order'];
              setSearchParams(currSearchParams);
            }
          }}
          {...props}
        />
      </Row>
    </Space>
  );
};

export default InformativeTable;
export type { InformativeTableButtonProps };
