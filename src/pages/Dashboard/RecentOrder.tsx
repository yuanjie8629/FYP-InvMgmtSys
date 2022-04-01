import MoreButton from '@components/Button/ActionButton/MoreButton';
import MainCard from '@components/Card/MainCard';
import StatusTag from '@components/Tag/StatusTag';
import { BoldTitle } from '@components/Title';
import { moneyFormatter } from '@utils/numUtils';
import { orderStatList } from '@utils/optionUtils';
import { Col, Row, Skeleton, Space, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DashboardProps } from './Dashboard';

const RecentOrder = ({ data, loading }: DashboardProps) => {
  const { Text } = Typography;
  const navigate = useNavigate();

  const recentOrderColumns: {
    title: string;
    dataIndex: string | string[];
    key: string;
    width: number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 170,
      render: (data: number) => (
        <div className='text-button-wrapper'>
          <Text
            strong
            className='text-button'
            onClick={() => {
              navigate(`/data/${data}`);
            }}
          >
            #{data}
          </Text>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: ['cust_name', 'email'],
      key: 'email',
      width: 300,
      render: (_: any, data: { [x: string]: string }) => {
        return (
          <Text strong type='secondary' className='text-break'>
            {data?.email}
          </Text>
        );
      },
    },
    {
      title: 'Customer Type',
      dataIndex: 'cust_type',
      key: 'cust_type',
      width: 220,
      render: (type: string) => (
        <Text type='secondary'>
          {type === 'agent'
            ? 'Agent'
            : type === 'drpshpr'
            ? 'Dropshipper'
            : type === 'data'
            ? 'Direct Customer'
            : 'Unregistered Customer'}
        </Text>
      ),
    },
    {
      title: 'Order Time',
      dataIndex: 'order_time',
      key: 'order_time',
      width: 200,
      render: (data: string) => <Text type='secondary'>{data}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'total_amt',
      key: 'total_amt',
      width: 140,
      render: (amount: string) => (
        <Text strong>{moneyFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 170,
      align: 'center' as const,
      render: (status: string) => (
        <StatusTag status={status} statusList={orderStatList} minWidth='90%' />
      ),
    },
  ];

  return (
    <MainCard>
      <Space direction='vertical' size={20} className='full-width'>
        <Row justify='space-between'>
          <Col>
            <Row>
              <BoldTitle level={5}>Recent Orders</BoldTitle>
            </Row>
          </Col>
          <Col>
            <MoreButton route='orderMgmt' />
          </Col>
        </Row>
        <Row>
          {loading || data.length <= 0 ? (
            <Skeleton
              active={loading}
              title={null}
              paragraph={{ rows: 12, width: '100%' }}
            />
          ) : (
            <Table
              dataSource={data.slice(0, 6)}
              columns={recentOrderColumns}
              pagination={false}
              scroll={{ x: 1050 }}
            />
          )}
        </Row>
      </Space>
    </MainCard>
  );
};

export default RecentOrder;
