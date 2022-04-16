import { Col, Row, Image, Space, Typography } from 'antd';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import { tableGradeProps } from '..';
import { GradeH, GradeL, GradeM } from './HmlAnalysisUtils';
import MainCard from '@components/Card/MainCard';
import { InvAnalysisProps } from '../..';
import { BoldTitle } from '@components/Title';
import { getMthYr } from '@utils/dateUtils';
import InformativeTable from '@components/Table/InformativeTable';
import { getSortOrder } from '@utils/urlUtls';
import { useNavigate, useSearchParams } from 'react-router-dom';

const HmlAnalysis = ({
  data,
  loading,
  totalCount,
  currentPg,
  defPg,
  ...props
}: InvAnalysisProps) => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hmlColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    fixed?: 'left' | 'right';
    defaultSortOrder?: 'ascend' | 'descend';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['id', 'name', 'category', 'thumbnail'],
      key: 'name',
      sorter: true,
      width: 250,
      fixed: 'left',
      render: (_: any, data: { [x: string]: string }) => (
        <Row gutter={5}>
          <Col span={8}>
            <Image src={data.thumbnail} height={80} width={80} />
          </Col>
          <Col span={16}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text
                  strong
                  className='text-button'
                  onClick={() => {
                    navigate(`/product/${data['id']}`);
                  }}
                >
                  {data.name}
                </Text>
              </div>
              <Text type='secondary' className='text-sm text-break'>
                {data.category}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: true,
      defaultSortOrder: getSortOrder('sku'),
      width: 120,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      defaultSortOrder: getSortOrder('stock'),
      width: 120,
    },
    {
      title: 'Cost per Unit',
      dataIndex: 'cost_per_unit',
      key: 'cost_per_unit',
      sorter: true,
      defaultSortOrder: getSortOrder('cost_per_unit'),
      width: 120,
      render: (amount: string) => (
        <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Cost per Unit (%)',
      dataIndex: 'cost_per_unit_percent',
      key: 'cost_per_unit_percent',
      sorter: true,
      defaultSortOrder: getSortOrder('cost_per_unit_percent'),
      width: 120,
      render: (amount: string) => (
        <Text type='secondary'>{percentFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      sorter: true,
      width: 100,
      align: 'center' as const,
      fixed: 'right',
      render: (grade: 'H' | 'M' | 'L') => {
        return (
          <div className='center-flex'>
            {grade === 'H' ? (
              <GradeH {...tableGradeProps} />
            ) : grade === 'M' ? (
              <GradeM {...tableGradeProps} />
            ) : (
              <GradeL {...tableGradeProps} />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <MainCard {...props}>
      <Space direction='vertical' size={15} className='full-width'>
        <Space direction='vertical' size={5}>
          <BoldTitle level={4}>HML Analysis</BoldTitle>
          <Text type='secondary'>
            {getMthYr(searchParams.get('month'), 'YYYY-MM')}
          </Text>
        </Space>
        <InformativeTable
          rowKey='id'
          dataSource={data}
          columns={hmlColumns}
          rowSelectable={false}
          loading={loading}
          currentPg={currentPg}
          totalRecord={totalCount}
          defPg={defPg}
          scroll={{
            x: 1000,
          }}
        />
      </Space>
    </MainCard>
  );
};

export default HmlAnalysis;
