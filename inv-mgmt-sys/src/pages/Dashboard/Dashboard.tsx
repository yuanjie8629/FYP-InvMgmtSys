import React, { useState } from 'react';
import { Col, Radio, Row, Space, Typography, Statistic } from 'antd';
import { CaretRightOutlined, RightOutlined } from '@ant-design/icons';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import SmallCard from '@components/SmallCard/SmallCard';
import LineChart from '@components/Chart/LineChart';
import toDoList from './ToDoList';
import routeList from '@routes/RouteList';
import './Dashboard.less';
import { useHistory } from 'react-router';
import Button from '@components/Button/Button';
import { dataYear, dataMonth, dataWeek, dataDay } from './SalesData';
import statisticsData from './StatisticsData';

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
                        width={255}
                        className='dashboard-toDoList-item'
                      >
                        <Title level={5}>{toDoItem.quantity}</Title>
                        <Text className='dashboard-toDoList-text'>
                          {toDoItem.label}{' '}
                        </Text>
                        <CaretRightOutlined
                          className='dashboard-toDoList-text'
                          style={{ margin: 2 }}
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
                  <Button type='link' color='info'>
                    More <RightOutlined style={{ margin: 4 }} />
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
            <Col span={8} style={{ padding: 0 }}>
              <ContainerCard>
                <Row>
                  <Title level={5}>Statistics</Title>
                </Row>
                <Row>
                  <Text className='dashboard-toDoList-text'>
                    {statisticsData.date}
                  </Text>
                </Row>
                <Space direction='vertical'>
                  <Statistic> </Statistic>
                </Space>
              </ContainerCard>
            </Col>
            <Col span={16} style={{ padding: 0 }}>
              <ContainerCard width='100%'></ContainerCard>
            </Col>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default Dashboard;
