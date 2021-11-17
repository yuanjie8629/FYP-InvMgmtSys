import { Table, TableProps } from 'antd';

interface RecordType {
  key: string;
}

interface CustomTableProps extends TableProps<RecordType> {}

const CustomTable = (props: CustomTableProps) => {
  return <Table {...props} style={{ width: '100%' }}></Table>;
};

export default CustomTable;
