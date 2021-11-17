import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Col, Radio, Row, Space, Typography } from 'antd';
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
import StatisticsDashboard from '@components/Statistics/StatisticsDashboard';
import Table from '@components/Table/Table';
import toDoList from './ToDoList';
import routeList from '@routes/RouteList';
import { dataYear, dataMonth, dataWeek, dataDay } from './SalesData';
import statisticsData from './StatisticsData';
import recentOrders from './RecentOrders';
import './Dashboard.less';

const Dashboard = () => {
  const { Text, Title } = Typography;
  const history = useHistory();
  const [salesDateRange, setSalesDateRange] = useState('year');
  const salesRadioBtn: { value: string; label: string }[] = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
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

  const findRoutePath = (label: string) => {
    let route = routeList.find((route) => route.label === label);
    return route?.path === undefined ? '404' : route.path;
  };
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
  return (
    <Layout>
      <div className='dashboard'>
        <Space direction='vertical' size={20} className='container-card'>
          <Row justify='center'>
            <ContainerCard>
              <Space direction='vertical'>
                <Title level={5}>To Do List</Title>
                <Row justify='start' gutter={[30, 20]}>
                  {toDoList.map((toDoItem) => (
                    <Col
                      key={toDoItem.label}
                      onClick={() => history.push(findRoutePath(toDoItem.link))}
                    >
                      <SmallCard
                        width={260}
                        className='dashboard-toDoList-item'
                      >
                        <Title level={5}>{toDoItem.quantity}</Title>
                        <Text className='dashboard-toDoList-text'>
                          {toDoItem.label}
                        </Text>
                        <MdArrowRight
                          size={19}
                          className='dashboard-toDoList-text'
                          style={{ verticalAlign: 'bottom' }}
                        />
                      </SmallCard>
                    </Col>
                  ))}
                </Row>
              </Space>
            </ContainerCard>
          </Row>
          <Row justify='center'>
            <ContainerCard>
              <Row justify='space-between'>
                <Col>
                  <Row>
                    <Title level={5}>Sales</Title>
                  </Row>
                </Col>
                <Col>
                  <Button
                    type='link'
                    color='info'
                    onClick={() =>
                      history.push(findRoutePath('businessInsights'))
                    }
                  >
                    More
                    <MdChevronRight
                      size={22}
                      style={{ verticalAlign: 'bottom' }}
                    />
                  </Button>
                </Col>
              </Row>
              <Row justify='space-between'>
                <Col>
                  <Text className='dashboard-toDoList-text'>
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
              <Row style={{ paddingTop: 30 }}>
                <Space direction='vertical' style={{ width: '100%' }} size={20}>
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
            </ContainerCard>
          </Row>
          <Row justify='center' gutter={[30, 0]} style={{ margin: '0 2.5%' }}>
            <Col span={7} style={{ padding: 0 }}>
              <ContainerCard>
                <Row>
                  <Title level={5}>Statistics</Title>
                </Row>
                <Row>
                  <Text className='dashboard-toDoList-text'>
                    {statisticsData.date}
                  </Text>
                </Row>
                <Space
                  direction='vertical'
                  size={20}
                  style={{ marginTop: 20, width: '100%' }}
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
            <Col span={17} style={{ padding: 0 }}>
              <ContainerCard width='100%'>
                <Row justify='space-between'>
                  <Col>
                    <Row>
                      <Title level={5}>Recent Orders</Title>
                    </Row>
                  </Col>
                  <Col>
                    <Button
                      type='link'
                      color='info'
                      onClick={() => history.push(findRoutePath('order'))}
                    >
                      More{' '}
                      <MdChevronRight
                        size={22}
                        style={{ verticalAlign: 'bottom' }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Table
                    dataSource={recentOrders.data}
                    columns={recentOrders.columns}
                    pagination={false}
                  ></Table>
                </Row>
              </ContainerCard>
            </Col>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default Dashboard;
