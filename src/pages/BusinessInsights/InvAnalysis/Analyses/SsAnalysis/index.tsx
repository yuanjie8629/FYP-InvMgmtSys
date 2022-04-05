import { Col, Row, Image, Space, Typography } from 'antd';
import { getSortOrder } from '@utils/urlUtls';
import MainCard from '@components/Card/MainCard';
import { BoldTitle } from '@components/Title';
import { getMthYr } from '@utils/dateUtils';
import InformativeTable from '@components/Table/InformativeTable';
import { InvAnalysisProps } from '../..';
import { HiExclamation } from 'react-icons/hi';
import { EditButton } from '@components/Button/ActionButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Popover from '@components/Popover';

const SsAnalysis = ({
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

  const ssColumns: {
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
      width: 130,
      
    },
    {
      title: 'Avg Demand',
      dataIndex: 'avg_demand',
      key: 'avg_demand',
      sorter: true,
      defaultSortOrder: getSortOrder('avg_demand'),
      width: 120,
      render: (amount: string) => <Text type='secondary'>{amount} / day</Text>,
    },
    {
      title: 'Max Demand',
      dataIndex: 'max_demand',
      key: 'max_demand',
      sorter: true,
      defaultSortOrder: getSortOrder('max_demand'),
      width: 120,
      render: (amount: string) => <Text type='secondary'>{amount} / day</Text>,
    },

    {
      title: 'Avg Lead Time',
      dataIndex: 'avg_lead_tm',
      key: 'avg_lead_tm',
      sorter: true,
      defaultSortOrder: getSortOrder('avg_lead_tm'),
      width: 120,
      render: (day: number) =>
        day !== undefined && day !== null ? (
          <Text type='secondary'>
            {day} {day !== 1 ? 'days' : 'day'}
          </Text>
        ) : (
          <Popover content='Please update the average lead time for this product.'>
            <Space size={5}>
              <HiExclamation size={20} className='color-error' />
              <Text strong className='color-error'>
                Not Found
              </Text>
            </Space>
          </Popover>
        ),
    },
    {
      title: 'Max Lead Time',
      dataIndex: 'max_lead_tm',
      key: 'max_lead_tm',
      sorter: true,
      defaultSortOrder: getSortOrder('max_lead_tm'),
      width: 120,
      render: (day: number) =>
        day !== undefined && day !== null ? (
          <Text type='secondary'>
            {day} {day !== 1 ? 'days' : 'day'}
          </Text>
        ) : (
          <Popover content='Please update the maximum lead time for this product.'>
            <Space size={5}>
              <HiExclamation size={20} className='color-error' />
              <Text strong className='color-error'>
                Not Found
              </Text>
            </Space>
          </Popover>
        ),
    },

    {
      title: 'Safety Stock',
      dataIndex: 'safety_stock',
      key: 'safety_stock',
      sorter: true,
      defaultSortOrder: getSortOrder('ss'),
      width: 120,
      render: (amount: number) =>
        amount !== undefined && amount !== null ? (
          <Text type='secondary'>{amount}</Text>
        ) : (
          <Popover content='Please fill up the maximum and average amount for the demand and lead time.'>
            <Space size={5}>
              <HiExclamation size={20} className='color-error' />
              <Text strong className='color-error'>
                Insufficient Info
              </Text>
            </Space>
          </Popover>
        ),
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorder_point',
      key: 'reorder_point',
      sorter: true,
      defaultSortOrder: getSortOrder('reorder_point'),
      width: 120,
      render: (amount: number) =>
        amount !== undefined && amount !== null ? (
          <Text type='secondary'>{amount}</Text>
        ) : (
          <Popover content='Please fill up the maximum and average amount for the demand and lead time.'>
            <Space size={5}>
              <HiExclamation size={20} className='color-error' />
              <Text strong className='color-error'>
                Insufficient Info
              </Text>
            </Space>
          </Popover>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (data) => (
        <EditButton
          type='link'
          color='info'
          onClick={() => {
            navigate(`/product/${data['id']}`);
          }}
        >
          Edit Lead Time
        </EditButton>
      ),
    },
  ];

  return (
    <MainCard {...props}>
      <Space direction='vertical' size={15} className='full-width'>
        <Space direction='vertical' size={5}>
          <BoldTitle level={4}>Safety Stock Analysis</BoldTitle>
          <Text type='secondary'>
            {getMthYr(searchParams.get('month'), 'YYYY-MM')}
          </Text>
        </Space>
        <InformativeTable
          rowKey='id'
          dataSource={data}
          columns={ssColumns}
          rowSelectable={false}
          loading={loading}
          currentPg={currentPg}
          totalRecord={totalCount}
          defPg={defPg}
          scroll={{ x: 1500 }}
        />
      </Space>
    </MainCard>
  );
};

export default SsAnalysis;
