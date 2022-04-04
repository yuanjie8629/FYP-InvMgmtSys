import { Col, Row, Image, Space, Typography, Popover } from 'antd';
import { getSortOrder } from '@utils/urlUtls';
import MainCard from '@components/Card/MainCard';
import { BoldTitle } from '@components/Title';
import { getDt } from '@utils/dateUtils';
import InformativeTable from '@components/Table/InformativeTable';
import { InvAnalysisProps } from '../..';
import { HiExclamation } from 'react-icons/hi';
import { EditButton } from '@components/Button/ActionButton';

const SsAnalysis = ({
  data,
  loading,
  totalCount,
  currentPg,
  defPg,
  ...props
}: InvAnalysisProps) => {
  const { Text } = Typography;

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
      dataIndex: ['prodNm', 'prodCat', 'prodImg'],
      key: 'prod',
      sorter: true,
      width: 200,
      fixed: 'left',
      render: (_: any, data: { [x: string]: string }) => (
        <Row gutter={5}>
          <Col xs={9} xl={7}>
            <Image
              alt={data.name}
              src={data.thumbnail}
              height={100}
              width={100}
            />
          </Col>
          <Col xs={15} xl={17}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text
                  strong
                  className='text-button'
                  onClick={() => {
                    // navigate(`/product/${data['id']}`);
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
      title: 'Max Demand',
      dataIndex: 'max_demand',
      key: 'max_demand',
      sorter: true,
      defaultSortOrder: getSortOrder('max_demand'),
      width: 100,
      render: (amount: string) => <Text type='secondary'>{amount} / day</Text>,
    },
    {
      title: 'Avg Demand',
      dataIndex: 'avg_demand',
      key: 'avg_demand',
      sorter: true,
      defaultSortOrder: getSortOrder('avg_demand'),
      width: 100,
      render: (amount: string) => <Text type='secondary'>{amount} / day</Text>,
    },
    {
      title: 'Max Lead Time',
      dataIndex: 'max_lead_tm',
      key: 'max_lead_tm',
      sorter: true,
      defaultSortOrder: getSortOrder('max_lead_tm'),
      width: 100,
      render: (day: number) =>
        day !== undefined ? (
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
      title: 'Avg Lead Time',
      dataIndex: 'avg_lead_tm',
      key: 'avg_lead_tm',
      sorter: true,
      defaultSortOrder: getSortOrder('avg_lead_tm'),
      width: 100,
      render: (day: number) =>
        day !== undefined ? (
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
      title: 'Safety Stock',
      dataIndex: 'ss',
      key: 'ss',
      sorter: true,
      defaultSortOrder: getSortOrder('ss'),
      width: 120,
      fixed: 'right',
      render: (amount: number) =>
        amount !== undefined ? (
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
      title: 'Restock Point',
      dataIndex: 'restock_point',
      key: 'restock_point',
      sorter: true,
      defaultSortOrder: getSortOrder('restock_point'),
      width: 120,
      fixed: 'right',
      render: (amount: number) =>
        amount !== undefined ? (
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
      width: 100,
      fixed: 'right',
      render: () => (
        <EditButton type='link' color='info'>
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
            {getDt(undefined, undefined, 'YYYY MMMM')}
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
        />
      </Space>
    </MainCard>
  );
};

export default SsAnalysis;
