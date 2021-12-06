import React, { lazy, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAppSelector } from '@hooks/reduxHooks';
import Col from 'antd/es/col';
import Grid from 'antd/es/grid';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Spin from 'antd/es/spin';
import Typography from 'antd/es/typography';
import Radio from 'antd/es/radio';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
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
import Layout from '@components/Layout/Layout';
import SmallCard from '@components/SmallCard/SmallCard';
import Button from '@components/Button/Button';
import StatisticsDashboard from '@components/Statistics/Statistics';
import Table from '@components/Table/Table';
import Tag from '@components/Tag/Tag';
import { findRoutePath } from '@utils/RoutingUtils';
import toDoList from './-toDoList';
import { dataYear, dataMonth, dataWeek, dataDay } from './-salesData';
import statisticsData from './-statisticsData';
import recentOrders from './recentOrders';
import topProduct from './topProducts';
import invAnalysis from './invAnalysis';
import './Dashboard.less';
import RankingList from '@components/List/RankingList';

const LineChart = lazy(() => import('@components/Chart/LineChart'));
const ContainerCard = lazy(
  () => import('@components/ContainerCard/ContainerCard')
);
const Dashboard = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const isSiderCollapsed = useAppSelector((state) => state.sider.collapsed);
  const screens = useBreakpoint();
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

  const salesRadioBtn: {
    defaultValue: string;
    data: {
      value: string;
      label: React.ReactNode;
    }[];
  } = {
    defaultValue: 'year',
    data: [
      { value: 'year', label: 'Year' },
      { value: 'month', label: 'Month' },
      { value: 'week', label: 'Week' },
      { value: 'day', label: 'Day' },
    ],
  };

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
        ) : status === 'shipped' ? (
          <OrderStatusTag color='processing'>Shipped</OrderStatusTag>
        ) : status === 'packed' ? (
          <OrderStatusTag color='warning'>Packed</OrderStatusTag>
        ) : status === 'return' ? (
          <OrderStatusTag color='error'>Refund</OrderStatusTag>
        ) : null;
      },
    },
  ];

  const invAnalysisColumns: {
    title: string;
    dataIndex: string | string[];
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

  const toDoItemPlaceHolder = () => {
    const cols = [];
    const numItemPerRow = screens.xl ? 5 : isSiderCollapsed ? 4 : 3;
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
          <div style={{ width: screens.xl ? 255 : 230 }}></div>
        </Col>
      );
    }
    return cols;
  };

  return (
    <Layout>
      <div className='dashboard'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard>
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
                        width={screens.xl ? 255 : 230}
                        className='dashboard-toDoList-item'
                      >
                        <Space direction='vertical' size={15}>
                          <Title
                            level={5}
                            className={classNames({
                              'color-grey': toDoItem.quantity === 0,
                            })}
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
            </ContainerCard>
          </Row>
          <Row justify='center'>
            <ContainerCard>
              <Space direction='vertical' size={5} className='width-full'>
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
                    <Text className='dashboard-grey-text'>{getSalesDate}</Text>
                  </Col>
                  <Col>
                    <Radio.Group
                      buttonStyle='solid'
                      size='large'
                      style={{ marginRight: 30 }}
                      onChange={(e) => setSalesDateRange(e.target.value)}
                      defaultValue={salesRadioBtn.defaultValue}
                      options={salesRadioBtn.data}
                      optionType='button'
                    ></Radio.Group>
                  </Col>
                </Row>

                <Row style={{ paddingTop: 15 }}>
                  <Suspense
                    fallback={
                      <div className='centerFlex height-full width-full'>
                        <Spin
                          indicator={
                            <LoadingOutlined style={{ fontSize: 30 }} spin />
                          }
                        />
                      </div>
                    }
                  >
                    <Space
                      direction='vertical'
                      className='width-full'
                      size={20}
                    >
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
            </ContainerCard>
          </Row>
          <Row
            justify='center'
            gutter={[30, 20]}
            className='dashboard-multiple-container-card'
          >
            <Col xs={24} sm={24} md={24} lg={24} xl={6} className='padding-0'>
              <ContainerCard width={!screens.xl ? '100%' : '95%'}>
                <Title level={5}>Statistics</Title>

                <Text className='dashboard-grey-text'>
                  {statisticsData.date}
                </Text>

                <Space
                  direction={screens.xl ? 'vertical' : 'horizontal'}
                  size={screens.xl ? 20 : isSiderCollapsed ? 65 : 25}
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
            <Col xs={24} sm={24} md={24} lg={24} xl={18} className='padding-0'>
              <ContainerCard width='100%'>
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
                    ></Table>
                  </Row>
                </Space>
              </ContainerCard>
            </Col>
          </Row>
          <Row
            justify='center'
            gutter={[30, 20]}
            className='dashboard-multiple-container-card'
          >
            <Col xs={24} sm={24} md={24} lg={24} xl={9} className='padding-0'>
              <ContainerCard width={!screens.xl ? '100%' : '95%'}>
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
                    <Row
                      className={classNames(
                        { 'float-left': !screens.xl },
                        { 'float-right': screens.xl }
                      )}
                    >
                      <Text className='dashboard-grey-text'>
                        {topProduct.date}
                      </Text>
                    </Row>
                  </div>
                  <RankingList itemList={topProduct} />
                </Space>
              </ContainerCard>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={15} className='padding-0'>
              <ContainerCard width='100%'>
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
