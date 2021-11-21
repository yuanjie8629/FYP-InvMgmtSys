import { Table as AntdTable, TableProps } from 'antd';

interface RecordType {
  key: string;
}

interface CustomTableProps extends TableProps<RecordType> {}

const Table = (props: CustomTableProps) => {
  return <AntdTable {...props} style={{ width: '100%' }}></AntdTable>;
};

export default Table;
