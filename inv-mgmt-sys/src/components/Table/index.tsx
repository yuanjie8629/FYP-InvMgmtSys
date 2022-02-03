import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';

interface RecordType {
  key: string;
}

export interface TableProps extends AntdTableProps<RecordType> {}

const Table = (props: TableProps) => {
  return (
    <AntdTable
      className={`full-width ${
        props.className !== undefined ? props.className : ''
      }`}
      {...props}
    ></AntdTable>
  );
};

export default Table;
