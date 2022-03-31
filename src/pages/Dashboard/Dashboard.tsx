import React, { lazy, useState, Suspense, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Spin from 'antd/es/spin';
import Typography from 'antd/es/typography';
import Radio from 'antd/es/radio';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { MdArrowRight, MdChevronRight } from 'react-icons/md';
import Layout from '@components/Layout';
import ColorCard from '@components/Card/ColorCard';
import Button from '@components/Button';
import Table from '@components/Table';
import Statistics from '@components/Statistics';
import MainCardContainer from '@components/Container/MainCardContainer';
import { findRoutePath } from '@utils/routingUtils';
import toDoList from './toDoList';
import { dataYear, dataMonth, dataWeek, dataDay } from './salesData';
import topProduct from './topProducts';
import invAnalysis from './invAnalysis';
import './Dashboard.less';
import RankingList from '@components/List/RankingList';
import statisticsList from '@components/Statistics/statisticsList';
import { dateRangeOptions, orderStatList } from '@utils/optionUtils';
import { BoldTitle } from '@components/Title';
import axios from '@api/axiosInstance';
import { statisticsAPI, toDoListAPI } from '@api/services/dashboardAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { Skeleton } from 'antd';
import { orderListAPI } from '@api/services/orderAPI';
import StatusTag from '@components/Tag/StatusTag';
import { moneyFormatter } from '@utils/numUtils';
import { getDt } from '@utils/dateUtils';

const LineChart = lazy(() => import('@components/Chart/LineChart'));
const MainCard = lazy(() => import('@components/Card/MainCard'));
const Dashboard = () => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const [messageApi] = useContext(MessageContext);
  const [salesDateRange, setSalesDateRange] = useState('year');

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const getSalesData =
    salesDateRange === 'month'
      ? dataMonth.data
      : salesDateRange === 'week'
      ? dataWeek.data
      : salesDateRange === 'day'
      ? dataDay.data
      : dataYear.data;

  const getSalesDate =
    salesDateRange === 'month'
      ? dataMonth.month
      : salesDateRange === 'week'
      ? dataWeek.frmDate + ' - ' + dataWeek.toDate
      : salesDateRange === 'day'
      ? dataDay.date
      : dataYear.year;

  const getChartTitle = ['month', 'week'].includes(salesDateRange)
    ? 'Day'
    : salesDateRange === 'day'
    ? 'Hour'
    : 'Month';

  const getChartTooltipTitlePrefix = salesDateRange === 'month' ? 'Day ' : '';

  const getChartTooltipTitleSuffix = salesDateRange === 'day' ? ':00' : '';

  const More = ({ route }: { route: string }) => (
    <Button
      type='link'
      color='info'
      onClick={() => navigate(findRoutePath(route))}
      className='dashboard-more-btn center-flex'
    >
      More
      <MdChevronRight size={23} style={{ position: 'relative', right: 3 }} />
    </Button>
  );

  const invAnalysisColumns: {
    title: string;
    dataIndex: string | string[];
    key: string;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    width?: string | number;
    render?: (status: string) => any;
  }[] = [
    {
      title: 'Product',
      dataIndex: 'prodNm',
      key: 'prodNm',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center' as const,
    },
    {
      title: 'ABC Grade',
      dataIndex: 'ABC',
      key: 'ABC',
      align: 'center' as const,
    },
    {
      title: 'HML Grade',
      dataIndex: 'HML',
      key: 'HML',
      align: 'center' as const,
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorderPt',
      key: 'reorderPt',
      align: 'center' as const,
    },
    {
      title: 'Optimal Order Quantity',
      dataIndex: 'optimalOrderQty',
      key: 'optimalOrderQty',
      align: 'center' as const,
    },
  ];

  const ToDoList = () => {
    const [toDoListData, setToDoListData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      let isMounted = true;
      setLoading(true);
      toDoListAPI()
        .then((res) => {
          if (isMounted) {
            console.log(res.data);
            setToDoListData(res.data);
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
    }, []);

    return (
      <MainCard bodyStyle={{ padding: '35px 35px' }}>
        <Space direction='vertical' size={15} className='full-width'>
          <BoldTitle level={5}>To Do List</BoldTitle>
          <Row gutter={[30, 30]}>
            {toDoList.map((toDoItem) => {
              let value: any =
                toDoListData[
                  Object.keys(toDoListData).find(
                    (key) => key === toDoItem.value
                  )
                ];

              return (
                <Col
                  key={toDoItem.label}
                  flex='25%'
                  onClick={!loading ? () => navigate(toDoItem.link) : undefined}
                  className='dashboard-toDoList-col'
                >
                  <ColorCard
                    backgroundColor='grey'
                    hover={!loading ? 'success' : undefined}
                    bodyStyle={{
                      padding: '25px 12px 15px',
                    }}
                  >
                    {loading ? (
                      <Skeleton
                        title={null}
                        paragraph={{ rows: 2, width: ['50%', '100%'] }}
                        active={loading}
                      />
                    ) : (
                      <Space direction='vertical' size={15}>
                        <BoldTitle
                          level={5}
                          type={value <= 0 ? 'secondary' : undefined}
                        >
                          {value}
                        </BoldTitle>
                        <div>
                          <Text className='dashboard-grey-text'>
                            {toDoItem.label}
                          </Text>
                          <MdArrowRight
                            size={19}
                            className='dashboard-grey-text dashboard-right-arrow'
                          />
                        </div>
                      </Space>
                    )}
                  </ColorCard>
                </Col>
              );
            })}
          </Row>
        </Space>
      </MainCard>
    );
  };

  const Sales = () => (
    <MainCard>
      <Space direction='vertical' size={5} className='full-width'>
        <Row justify='space-between'>
          <Col>
            <BoldTitle level={5}>Sales</BoldTitle>
          </Col>
          <Col>
            <More route='bizStatistics' />
          </Col>
        </Row>

        <Row justify='space-between'>
          <Col>
            <Text className='dashboard-grey-text'>{getSalesDate}</Text>
          </Col>
          <Col>
            <Radio.Group
              buttonStyle='solid'
              size='large'
              style={{ marginRight: 30 }}
              onChange={(e) => {
                setSalesDateRange(e.target.value);
                axios.get('admin/');
              }}
              value={salesDateRange}
              options={dateRangeOptions}
              optionType='button'
            ></Radio.Group>
          </Col>
        </Row>
        <Row style={{ paddingTop: 15 }}>
          <Suspense
            fallback={
              <div className='center-flex full-height full-width'>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                />
              </div>
            }
          >
            <Space direction='vertical' className='full-width' size={20}>
              <Text strong type='secondary'>
                RM
              </Text>
              <LineChart
                data={getSalesData}
                titleX={getChartTitle}
                tooltipName='Total Sales'
                tooltipTitlePrefix={getChartTooltipTitlePrefix}
                tooltipTitleSuffix={getChartTooltipTitleSuffix}
                tooltipValPrefix='RM '
                toFixed={2}
              />
            </Space>
          </Suspense>
        </Row>
      </Space>
    </MainCard>
  );

  const StatisticsDashboard = () => {
    const [statisticsData, setStatisticsData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      let isMounted = true;
      setLoading(true);
      statisticsAPI()
        .then((res) => {
          if (isMounted) {
            console.log(res.data);
            setStatisticsData(res.data);
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
    }, []);

    return (
      <MainCard>
        <BoldTitle level={5}>Statistics</BoldTitle>
        <Text className='dashboard-grey-text'>{getDt()}</Text>
        <Space
          direction={'vertical'}
          size={40}
          style={{ width: '100%', paddingTop: 25 }}
        >
          {statisticsList.map((statistics) => (
            <Statistics
              key={statistics.key}
              title={statistics.title}
              icon={statistics.icon}
              color={statistics.color}
              value={statisticsData[statistics.key]}
              prefix={statistics.prefix}
              suffix={statistics.suffix}
              toFixed={statistics.toFixed}
            />
          ))}
        </Space>
      </MainCard>
    );
  };

  const RecentOrder = () => {
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      let isMounted = true;
      setLoading(true);
      orderListAPI(`?limit=6`)
        .then((res) => {
          if (isMounted) {
            setOrder(res.data?.results);
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
    }, []);

    const recentOrderColumns: {
      title: string;
      dataIndex: string | string[];
      key: string;
      width: number;
      align?: 'left' | 'center' | 'right';
      render?: any;
    }[] = [
      {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
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
            <Space direction='vertical'>
              {data?.cust_name && (
                <Text strong type='secondary' className='text-break'>
                  {data?.cust_name}
                </Text>
              )}
              <Text type='secondary' className='text-break'>
                {data?.email}
              </Text>
            </Space>
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
              : type === 'order'
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
          <StatusTag
            status={status}
            statusList={orderStatList}
            minWidth='90%'
          />
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
              <More route='orderMgmt' />
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
                dataSource={order}
                columns={recentOrderColumns}
                pagination={false}
                scroll={{ x: 1000 }}
              />
            )}
          </Row>
        </Space>
      </MainCard>
    );
  };

  const TopProducts = () => (
    <MainCard>
      <Space direction='vertical' size={5} className='full-width'>
        <div>
          <Row justify='space-between'>
            <Col>
              <BoldTitle level={5}>Top Products</BoldTitle>
            </Col>
            <Col>
              <More route='bizStatistics' />
            </Col>
          </Row>
          <Row>
            <Text className='dashboard-grey-text'>{topProduct.date}</Text>
          </Row>
        </div>
        <RankingList dataSource={topProduct} />
      </Space>
    </MainCard>
  );

  const InvAnalysis = () => (
    <MainCard>
      <Space direction='vertical' size={30} className='full-width'>
        <Row justify='space-between'>
          <Col>
            <Row>
              <BoldTitle level={5}>Inventory Analysis</BoldTitle>
            </Row>
          </Col>
          <Col>
            <More route='invAnalysis' />
          </Col>
        </Row>
        <Row>
          <Table
            dataSource={invAnalysis}
            columns={invAnalysisColumns}
            pagination={false}
            scroll={{ x: 1100 }}
          ></Table>
        </Row>
      </Space>
    </MainCard>
  );

  return (
    <Layout>
      <MainCardContainer className='dashboard'>
        <ToDoList />
        <Sales />
        <Row justify='center' gutter={[30, 20]}>
          <Col span={7}>
            <StatisticsDashboard />
          </Col>
          <Col span={17}>
            <RecentOrder />
          </Col>
        </Row>
        <Row justify='center' gutter={[30, 20]}>
          <Col span={9}>
            <TopProducts />
          </Col>
          <Col span={15}>
            <InvAnalysis />
          </Col>
        </Row>
      </MainCardContainer>
    </Layout>
  );
};

export default Dashboard;
