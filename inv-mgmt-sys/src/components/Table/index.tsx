import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';

interface RecordType {
  key: string;
}

export interface TableProps extends AntdTableProps<RecordType> {}

const Table = (props: TableProps) => {
  return (
    <AntdTable
      className={`width-full ${props.className}`}
      {...props}
    ></AntdTable>
  );
};

export default Table;
