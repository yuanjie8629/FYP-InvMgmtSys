import { Col, Row, Image, Space, Typography } from 'antd';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import { tableGradeProps } from '..';
import { getSortOrder } from '@utils/urlUtls';
import MainCard from '@components/Card/MainCard';
import { BoldTitle } from '@components/Title';
import { getMthYr } from '@utils/dateUtils';
import InformativeTable from '@components/Table/InformativeTable';
import { InvAnalysisProps } from '../..';
import { GradeA, GradeB, GradeC, GradeUndefined } from './AbcAnalysisUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AbcAnalysis = ({
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

  const abcColumns: {
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
      dataIndex: ['id','name', 'category', 'thumbnail'],
      key: 'name',
      sorter: true,
      defaultSortOrder: getSortOrder('name'),
      width: 250,
      fixed: 'left',
      render: (_: any, data: { [x: string]: string }) => (
        <Row gutter={20}>
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
      width: 160,
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
      title: 'Demand',
      dataIndex: 'demand',
      key: 'demand',
      sorter: true,
      defaultSortOrder: getSortOrder('demand'),
      width: 100,
    },
    {
      title: 'Consumption Value',
      dataIndex: 'consumption_value',
      key: 'consumption_value',
      sorter: true,
      defaultSortOrder: getSortOrder('consumption_value'),
      width: 160,
      render: (amount: string) => (
        <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Demand (%)',
      dataIndex: 'demand_percent',
      key: 'demand_percent',
      sorter: true,
      width: 120,
      render: (amount: string) => (
        <Text type='secondary'>{percentFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Consumption Value (%)',
      dataIndex: 'consumption_value_percent',
      key: 'consumption_value_percent',
      sorter: true,
      width: 180,
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
      render: (grade: 'A' | 'B' | 'C') => {
        return (
          <div className='center-flex'>
            {grade === 'A' ? (
              <GradeA {...tableGradeProps} />
            ) : grade === 'B' ? (
              <GradeB {...tableGradeProps} />
            ) : grade === 'C' ? (
              <GradeC {...tableGradeProps} />
            ) : (
              <GradeUndefined {...tableGradeProps} />
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
          <BoldTitle level={4}>ABC Analysis</BoldTitle>
          <Text type='secondary'>
            {getMthYr(searchParams.get('month'), 'YYYY-MM')}
          </Text>
        </Space>
        <InformativeTable
          rowKey='id'
          dataSource={data}
          columns={abcColumns}
          rowSelectable={false}
          loading={loading}
          currentPg={currentPg}
          totalRecord={totalCount}
          defPg={defPg}
          scroll={{
            x: 1300,
          }}
        />
      </Space>
    </MainCard>
  );
};

export default AbcAnalysis;
