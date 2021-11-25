import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Grid, List, Radio, Row, Skeleton, Space, Typography } from 'antd';
import {
  MdArrowRight,
  MdChevronRight,
  MdOutlineTrendingUp,
  MdOutlineAttachMoney,
  MdOutlineVisibility,
  MdPersonOutline,
  MdOutlineAssignment,
} from 'react-icons/md';
import { IconType } from 'react-icons';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import SmallCard from '@components/SmallCard/SmallCard';
import LineChart from '@components/Chart/LineChart';
import Button from '@components/Button/Button';
import StatisticsDashboard from '@components/Statistics/Statistics';
import Table from '@components/Table/Table';
import Tag from '@components/Tag/Tag';
import { findRoutePath } from '@utils/RoutingUtils';
import toDoList from './toDoList';
import { dataYear, dataMonth, dataWeek, dataDay } from './salesData';
import statisticsData from './statisticsData';
import recentOrders from './recentOrders';
import topProduct from './topProducts';
import invAnalysis from './invAnalysis';
import './Dashboard.less';

const Dashboard = () => {
  const { Text, Title } = Typography;

  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [salesDateRange, setSalesDateRange] = useState('year');

  const getSalesData = () =>
    salesDateRange === 'month'
      ? dataMonth.data
      : salesDateRange === 'week'
      ? dataWeek.data
      : salesDateRange === 'day'
      ? dataDay.data
      : dataYear.data;

  const getSalesDate = () =>
    salesDateRange === 'month'
      ? dataMonth.month
      : salesDateRange === 'week'
      ? dataWeek.frmDate + ' - ' + dataWeek.toDate
      : salesDateRange === 'day'
      ? dataDay.date
      : dataYear.year;

  const getChartTitle = () =>
    salesDateRange === 'month' || salesDateRange === 'week'
      ? 'Day'
      : salesDateRange === 'day'
      ? 'Hour'
      : 'Month';

  const getChartTooltipTitlePrefix = () =>
    salesDateRange === 'month' ? 'Day ' : '';

  const getChartTooltipTitleSuffix = () =>
    salesDateRange === 'day' ? ':00' : '';

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
  const salesRadioBtn: { value: string; label: string }[] = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];

  const recentOrderColumns: {
    title: string;
    dataIndex: string;
    key: string;
    align?: 'left' | 'center' | 'right';
    render?: (status: string) => any;
    hidden: boolean;
  }[] = [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
      render: (text: string) => (
        <Button
          type='link'
          color='info'
          onClick={() =>
            navigate(findRoutePath('orderMgmt'), { replace: true })
          }
        >
          {text}
        </Button>
      ),
      hidden: false,
    },
    {
      title: 'Customer Name',
      dataIndex: 'custName',
      key: 'custName',
      hidden: false,
    },
    {
      title: 'Customer Type',
      dataIndex: 'custType',
      key: 'custType',
      hidden: screens.xl ? true : false,
    },
    {
      title: 'Order Time',
      dataIndex: 'orderTime',
      key: 'orderTime',
      hidden: screens.xl ? true : false,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <Text strong>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
      hidden: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        type OrderStatusTagProps = {
          color: string;
          children: React.ReactNode;
        };
        const OrderStatusTag = ({ color, children }: OrderStatusTagProps) => (
          <Tag minWidth='70%' maxWidth='100%' color={color}>
            {children}
          </Tag>
        );
        return status === 'completed' ? (
          <OrderStatusTag color='success'>Completed</OrderStatusTag>
        ) : status === 'shipped' ? (
          <OrderStatusTag color='processing'>Shipped</OrderStatusTag>
        ) : status === 'packed' ? (
          <OrderStatusTag color='warning'>Packed</OrderStatusTag>
        ) : status === 'return' ? (
          <OrderStatusTag color='error'>Refund</OrderStatusTag>
        ) : null;
      },
      hidden: false,
    },
  ].filter((item) => !item.hidden);

  const invAnalysisColumns: {
    title: string;
    dataIndex: string;
    key: string;
    align?: 'left' | 'center' | 'right';
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

  const statisticsList: {
    key: string;
    title: string;
    icon: IconType;
    color: string;
    prefix?: string;
    suffix?: string;
    toFixed?: number;
  }[] = [
    {
      key: 'sales',
      title: 'Sales',
      icon: MdOutlineTrendingUp,
      color: '#7367F0',
      prefix: 'RM ',
      toFixed: 2,
    },
    {
      key: 'profit',
      title: 'Profit',
      icon: MdOutlineAttachMoney,
      color: '#28C76F',
      prefix: 'RM ',
      toFixed: 2,
    },
    {
      key: 'visitors',
      title: 'Visitors',
      icon: MdOutlineVisibility,
      color: '#FDBA39',
    },
    {
      key: 'newCust',
      title: 'New Customers',
      icon: MdPersonOutline,
      color: '#00CFE8',
    },
    {
      key: 'newOrder',
      title: 'New Orders',
      icon: MdOutlineAssignment,
      color: '#EA5455',
    },
  ];

  return (
    <Layout>
      <div className='dashboard'>
        <Space direction='vertical' size={20} className='container-card'>
          <Row justify='center'>
            <ContainerCard>
              <Space direction='vertical' size={15}>
                <Title level={5}>To Do List</Title>
                <Row justify='start' gutter={[30, 20]}>
                  {toDoList.map((toDoItem) => (
                    <Col
                      key={toDoItem.label}
                      onClick={() =>
                        navigate(findRoutePath(toDoItem.link), {
                          replace: true,
                        })
                      }
                    >
                      <SmallCard
                        width={255}
                        className='dashboard-toDoList-item'
                      >
                        <Space direction='vertical' size={15}>
                          <Title level={5}>{toDoItem.quantity}</Title>
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
                </Row>
              </Space>
            </ContainerCard>
          </Row>
          <Row justify='center'>
            <ContainerCard>
              <Space direction='vertical' size={5} className='width-100'>
                <Row justify='space-between'>
                  <Col>
                    <Title level={5}>Sales</Title>
                  </Col>
                  <Col>
                    <More route='statistics' />
                  </Col>
                </Row>
                <Row justify='space-between'>
                  <Col>
                    <Text className='dashboard-grey-text'>
                      {getSalesDate()}
                    </Text>
                  </Col>
                  <Col>
                    <Radio.Group
                      buttonStyle='solid'
                      size='large'
                      style={{ marginRight: 30 }}
                      defaultValue='year'
                    >
                      {salesRadioBtn.map((radioBtn) => (
                        <Radio.Button
                          key={radioBtn.value}
                          value={radioBtn.value}
                          onClick={() => setSalesDateRange(radioBtn.value)}
                        >
                          {radioBtn.label}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Col>
                </Row>
                <Row style={{ paddingTop: 15 }}>
                  <Space direction='vertical' className='width-100' size={20}>
                    <Text strong>RM</Text>
                    <LineChart
                      data={getSalesData()}
                      titleX={getChartTitle()}
                      tooltipName='Total Sales'
                      tooltipTitlePrefix={getChartTooltipTitlePrefix()}
                      tooltipTitleSuffix={getChartTooltipTitleSuffix()}
                      tooltipValPrefix='RM '
                      toFixed={2}
                    />
                  </Space>
                </Row>
              </Space>
            </ContainerCard>
          </Row>
          <Row justify='center' gutter={[30, 20]} style={{ margin: '0 2.5%' }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={7} style={{ padding: 0 }}>
              <ContainerCard width={!screens.xl ? '100%' : '95%'}>
                <Title level={5}>Statistics</Title>

                <Text className='dashboard-grey-text'>
                  {statisticsData.date}
                </Text>

                <Space
                  direction={screens.xl ? 'vertical' : 'horizontal'}
                  size={20}
                  style={{ width: '100%', paddingTop: 25 }}
                >
                  {statisticsList.map((statistics) => (
                    <StatisticsDashboard
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
              </ContainerCard>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={17} style={{ padding: 0 }}>
              <ContainerCard width='100%'>
                <Space direction='vertical' size={15} className='width-100'>
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
                    ></Table>
                  </Row>
                </Space>
              </ContainerCard>
            </Col>
          </Row>
          <Row justify='center' gutter={[30, 20]} style={{ margin: '0 2.5%' }}>
            <Col xs={8} sm={8} md={9} lg={7} xl={9} style={{ padding: 0 }}>
              <ContainerCard>
                <Space direction='vertical' size={5} className='width-100'>
                  <div>
                    <Row justify='space-between'>
                      <Col>
                        <Title level={5}>Top Products</Title>
                      </Col>
                      <Col>
                        <More route='statistics' />
                      </Col>
                    </Row>
                    <Row style={{ float: 'right' }}>
                      <Text className='dashboard-grey-text'>
                        {topProduct.date}
                      </Text>
                    </Row>
                  </div>
                  <List
                    dataSource={topProduct.products}
                    renderItem={(item) => (
                      <List.Item key={item.prodNm}>
                        <Skeleton title={false} active loading={false}>
                          <List.Item.Meta
                            key={item.prodNm}
                            title={
                              <Text className='dashboard-top-product-title'>
                                {item.prodNm}
                              </Text>
                            }
                            description={
                              <Text className='dashboard-top-product-cat'>
                                {item.prodCat}
                              </Text>
                            }
                          ></List.Item.Meta>
                          <Row align='middle' gutter={[5, 0]}>
                            <Col>
                              <Title level={5}>{item.sales}</Title>
                            </Col>
                            <Col>
                              <Text className='dashboard-top-product-sales'>
                                sales
                              </Text>
                            </Col>
                          </Row>
                        </Skeleton>
                      </List.Item>
                    )}
                  ></List>
                </Space>
              </ContainerCard>
            </Col>
            <Col xs={16} sm={16} md={15} lg={17} xl={15} style={{ padding: 0 }}>
              <ContainerCard width='100%'>
                <Space direction='vertical' size={30} className='width-100'>
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
                    ></Table>
                  </Row>
                </Space>
              </ContainerCard>
            </Col>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default Dashboard;
