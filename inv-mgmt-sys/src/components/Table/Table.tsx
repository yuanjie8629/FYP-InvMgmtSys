import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';

interface RecordType {
  key: string;
}

export interface TableProps extends AntdTableProps<RecordType> {}

const Table = (props: TableProps) => {
  return <AntdTable {...props} style={{ width: '100%' }}></AntdTable>;
};

export default Table;
