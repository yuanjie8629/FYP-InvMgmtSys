import { orderListAPI } from '@api/services/orderAPI';
import MoreButton from '@components/Button/ActionButton/MoreButton';
import MainCard from '@components/Card/MainCard';
import StatusTag from '@components/Tag/StatusTag';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { moneyFormatter } from '@utils/numUtils';
import { orderStatList } from '@utils/optionUtils';
import { Col, Row, Skeleton, Space, Table, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentOrder = () => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    orderListAPI(`?limit=6`)
      .then((res) => {
        if (isMounted) {
          setData(res.data?.results);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

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
      title: 'Order Number',
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
              navigate(`/order/${data}`);
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
            : type === 'cust'
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
          {loading ? (
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
