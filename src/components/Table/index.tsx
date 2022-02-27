import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';

interface RecordType {
  key: string;
}

export interface TableProps extends AntdTableProps<RecordType> {}

const Table = ({ className, ...props }: TableProps) => {
  return (
    <AntdTable
      className={`full-width${className !== undefined ? ` ${className}` : ''}`}
      {...props}
    ></AntdTable>
  );
};

export default Table;
