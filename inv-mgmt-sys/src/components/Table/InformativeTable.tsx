import Table, { TableProps } from '@components/Table/Table';
import { Row, Col, Typography, Space } from 'antd';

interface InformativeTableProps extends TableProps {
  buttons?: JSX.Element;
}

const InformativeTable = (props: InformativeTableProps) => {
  const { Text } = Typography;
  return (
      <Space direction='vertical' size={20} className='width-full'>
      <Row>
        <Text>Selected: 0</Text>
      </Row>
      <Row>
        <Table></Table>
      </Row>
    </Space>
  );
};

export default InformativeTable;
