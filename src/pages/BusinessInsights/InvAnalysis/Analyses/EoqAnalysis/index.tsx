import { Col, Row, Image, Space, Typography } from 'antd';
import { moneyFormatter } from '@utils/numUtils';
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

const EoqAnalysis = ({
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

  const eoqColumns: {
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
      width: 160,
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
      title: 'Ordering Cost',
      dataIndex: 'ordering_cost',
      key: 'ordering_cost',
      sorter: true,
      defaultSortOrder: getSortOrder('ordering_cost'),
      width: 130,
      render: (amount: string) =>
        amount !== undefined && amount !== null ? (
          <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
        ) : (
          <Popover content='Please update the holding cost for this product.'>
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
      title: 'Holding Cost',
      dataIndex: 'holding_cost',
      key: 'holding_cost',
      sorter: true,
      defaultSortOrder: getSortOrder('holding_cost'),
      width: 130,
      render: (amount: string) =>
        amount !== undefined && amount !== null ? (
          <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
        ) : (
          <Popover content='Please update the holding cost for this product.'>
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
      title: 'Optimal Order Quantity',
      dataIndex: 'optimal_order_qty',
      key: 'optimal_order_qty',
      sorter: true,
      defaultSortOrder: getSortOrder('optimal_order_qty'),
      width: 200,
      fixed: 'right',
      render: (amount: string) =>
        amount !== undefined && amount !== null ? (
          <Text type='secondary'>{amount}</Text>
        ) : (
          <Popover content='Please fill up the ordering and holding costs.'>
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
      render: (data) => (
        <EditButton
          type='link'
          color='info'
          onClick={() => {
            navigate(`/product/${data['id']}`);
          }}
        >
          Edit Costs
        </EditButton>
      ),
    },
  ];

  return (
    <MainCard {...props}>
      <Space direction='vertical' size={15} className='full-width'>
        <Space direction='vertical' size={5}>
          <BoldTitle level={4}>EOQ Analysis</BoldTitle>
          <Text type='secondary'>
            {getMthYr(searchParams.get('month'), 'YYYY-MM')}
          </Text>
        </Space>
        <InformativeTable
          rowKey='id'
          dataSource={data}
          columns={eoqColumns}
          rowSelectable={false}
          loading={loading}
          currentPg={currentPg}
          totalRecord={totalCount}
          defPg={defPg}
          scroll={{ x: 1000 }}
        />
      </Space>
    </MainCard>
  );
};

export default EoqAnalysis;
