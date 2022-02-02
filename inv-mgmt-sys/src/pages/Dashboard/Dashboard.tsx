import React, { lazy, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Spin from 'antd/es/spin';
import Typography from 'antd/es/typography';
import Radio from 'antd/es/radio';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { MdArrowRight, MdChevronRight } from 'react-icons/md';
import Layout from '@components/Layout/Layout';
import SmallCard from '@components/Card/SmallCard';
import Button from '@components/Button';
import Table from '@components/Table';
import Statistics from '@components/Statistics';
import Tag from '@components/Tag';
import MainCardContainer from '@components/Container/MainCardContainer';
import { findRoutePath } from '@utils/routingUtils';
import toDoList from './toDoList';
import { dataYear, dataMonth, dataWeek, dataDay } from './salesData';
import statisticsData from './statisticsData';
import recentOrders from './recentOrders';
import topProduct from './topProducts';
import invAnalysis from './invAnalysis';
import './Dashboard.less';
import RankingList from '@components/List/RankingList';
import statisticsList from '@components/Statistics/statisticsList';
import { dateRangeOptions } from '@utils/optionUtils';

const LineChart = lazy(() => import('@components/Chart/LineChart'));
const MainCard = lazy(() => import('@components/Card/MainCard'));
const Dashboard = () => {
  const { Text, Title } = Typography;

  const navigate = useNavigate();
  const [salesDateRange, setSalesDateRange] = useState('year');

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

  const getChartTitle =
    salesDateRange === 'month' || salesDateRange === 'week'
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
      onClick={() =>
        navigate(findRoutePath(route), {
          replace: true,
        })
      }
      className='dashboard-more-btn'
    >
      More
      <MdChevronRight size={22} className='dashboard-right-arrow' />
    </Button>
  );

  const recentOrderColumns: {
    title: string;
    dataIndex: string | string[];
    key: string;
    width: number;
    align?: 'left' | 'center' | 'right';
    render?: (status: string) => any;
  }[] = [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
      width: 120,
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: 'Customer Name',
      dataIndex: 'custName',
      key: 'custName',
      width: 300,
    },
    {
      title: 'Customer Type',
      dataIndex: 'custType',
      key: 'custType',
      width: 140,
    },
    {
      title: 'Order Time',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 160,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      render: (amount: string) => (
        <Text strong>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 170,
      align: 'center' as const,
      render: (status: string) => {
        type OrderStatusTagProps = {
          color: string;
          children: React.ReactNode;
        };
        const OrderStatusTag = ({ color, children }: OrderStatusTagProps) => (
          <Tag minWidth='80%' maxWidth='100%' color={color}>
            {children}
          </Tag>
        );
        return status === 'completed' ? (
          <OrderStatusTag color='success'>Completed</OrderStatusTag>
        ) : status === 'shipping' ? (
          <OrderStatusTag color='processing'>Shipping</OrderStatusTag>
        ) : status === 'toShip' ? (
          <OrderStatusTag color='warning'>To Ship</OrderStatusTag>
        ) : status === 'cancel' ? (
          <OrderStatusTag color='error'>Cancelled</OrderStatusTag>
        ) : null;
      },
    },
  ];

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

  const toDoItemPlaceHolder = () => {
    const cols = [];
    const numItemPerRow = 6;

    for (
      let i = 0;
      i < numItemPerRow - (toDoList.length % numItemPerRow);
      i++
    ) {
      cols.push(
        <Col
          key={'toDoList-col-placeholder-' + i}
          className='dashboard-toDoList-col'
        >
          <div style={{ width: 255 }}></div>
        </Col>
      );
    }
    return cols;
  };

  const ToDoList = () => (
    <MainCard bodyStyle={{ padding: '35px 35px 0' }}>
      <Space direction='vertical' size={15}>
        <Title level={5}>To Do List</Title>
        <Row gutter={[30, 30]}>
          {toDoList.map((toDoItem) => (
            <Col
              key={toDoItem.label}
              onClick={() =>
                navigate(findRoutePath(toDoItem.link), {
                  replace: true,
                })
              }
              className='dashboard-toDoList-col'
            >
              <SmallCard
                backgroundColor='grey'
                bodyStyle={{
                  width: '255px',
                  padding: '25px 12px 15px',
                }}
                className='dashboard-toDoList-item'
              >
                <Space direction='vertical' size={15}>
                  <Title
                    level={5}
                    type={toDoItem.quantity === 0 ? 'secondary' : undefined}
                  >
                    {toDoItem.quantity}
                  </Title>
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
              </SmallCard>
            </Col>
          ))}
          {toDoItemPlaceHolder()}
        </Row>
      </Space>
    </MainCard>
  );

  const Sales = () => (
    <MainCard>
      <Space direction='vertical' size={5} className='width-full'>
        <Row justify='space-between'>
          <Col>
            <Title level={5}>Sales</Title>
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
              onChange={(e) => setSalesDateRange(e.target.value)}
              value={salesDateRange}
              options={dateRangeOptions}
              optionType='button'
            ></Radio.Group>
          </Col>
        </Row>
        <Row style={{ paddingTop: 15 }}>
          <Suspense
            fallback={
              <div className='centerFlex height-full width-full'>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                />
              </div>
            }
          >
            <Space direction='vertical' className='width-full' size={20}>
              <Text strong>RM</Text>
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

  const StatisticsDashboard = () => (
    <MainCard>
      <Title level={5}>Statistics</Title>

      <Text className='dashboard-grey-text'>{statisticsData.date}</Text>

      <Space
        direction={'vertical'}
        size={20}
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

  const RecentOrder = () => (
    <MainCard>
      <Space direction='vertical' size={15} className='width-full'>
        <Row justify='space-between'>
          <Col>
            <Row>
              <Title level={5}>Recent Orders</Title>
            </Row>
          </Col>
          <Col>
            <More route='orderMgmt' />
          </Col>
        </Row>
        <Row>
          <Table
            dataSource={recentOrders}
            columns={recentOrderColumns}
            pagination={false}
            scroll={{ x: 1000 }}
          ></Table>
        </Row>
      </Space>
    </MainCard>
  );

  const TopProducts = () => (
    <MainCard>
      <Space direction='vertical' size={5} className='width-full'>
        <div>
          <Row justify='space-between'>
            <Col>
              <Title level={5}>Top Products</Title>
            </Col>
            <Col>
              <More route='statistics' />
            </Col>
          </Row>
          <Row>
            <Text className='dashboard-grey-text'>{topProduct.date}</Text>
          </Row>
        </div>
        <RankingList itemList={topProduct} />
      </Space>
    </MainCard>
  );

  const InvAnalysis = () => (
    <MainCard>
      <Space direction='vertical' size={30} className='width-full'>
        <Row justify='space-between'>
          <Col>
            <Row>
              <Title level={5}>Inventory Analysis</Title>
            </Row>
          </Col>
          <Col>
            <More route='orderMgmt' />
          </Col>
        </Row>
        <Row>
          <Table
            dataSource={invAnalysis}
            columns={invAnalysisColumns}
            pagination={false}
            scroll={{ x: 800 }}
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
