import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';
import { DefaultRecordType } from 'rc-table/lib/interface';

export interface TableProps extends AntdTableProps<DefaultRecordType> {}

const Table = ({ className, ...props }: TableProps) => {
  return (
    <AntdTable
      className={`full-width${className !== undefined ? ` ${className}` : ''}`}
      {...props}
    ></AntdTable>
  );
};

export default Table;
