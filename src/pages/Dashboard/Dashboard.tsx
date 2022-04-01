import React, { lazy, useState, useEffect, useContext } from 'react';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import Layout from '@components/Layout';
import Table from '@components/Table';
import MainCardContainer from '@components/Container/MainCardContainer';
import topProduct from './topProducts';
import invAnalysis from './invAnalysis';
import './Dashboard.less';
import RankingList from '@components/List/RankingList';
import { BoldTitle } from '@components/Title';
import { statisticsAPI, toDoListAPI } from '@api/services/dashboardAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { orderListAPI } from '@api/services/orderAPI';
import ToDoList from './ToDoList';
import Sales from './Sales';
import MoreButton from '@components/Button/ActionButton/MoreButton';
import StatisticsDashboard from './StatisticsDashboard';
import RecentOrder from './RecentOrder';
const MainCard = lazy(() => import('@components/Card/MainCard'));

export interface DashboardProps {
  data: any;
  loading: boolean;
}

const Dashboard = () => {
  const { Text } = Typography;
  const [messageApi] = useContext(MessageContext);

  const [toDoListData, setToDoListData] = useState({});
  const [toDoListLoading, setToDoListLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState({});
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  const getToDoListData = (isMounted = true) => {
    setToDoListLoading(true);
    toDoListAPI()
      .then((res) => {
        if (isMounted) {
          console.log(res.data);
          setToDoListData(res.data);
          setToDoListLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setToDoListLoading(false);
          showServerErrMsg();
        }
      });
  };

  const getStatisticsData = (isMounted = true) => {
    setStatisticsLoading(true);
    statisticsAPI()
      .then((res) => {
        if (isMounted) {
          console.log(res.data);
          setStatisticsData(res.data);
          setStatisticsLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setStatisticsLoading(false);
          showServerErrMsg();
        }
      });
  };

  const getOrderData = (isMounted = true) => {
    setOrderLoading(true);
    orderListAPI(`?limit=6`)
      .then((res) => {
        if (isMounted) {
          setOrderData(res.data?.results);
          setOrderLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setOrderLoading(false);
          showServerErrMsg();
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    getToDoListData(isMounted);
    getStatisticsData(isMounted);
    getOrderData(isMounted);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

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

  const TopProducts = () => (
    <MainCard>
      <Space direction='vertical' size={5} className='full-width'>
        <div>
          <Row justify='space-between'>
            <Col>
              <BoldTitle level={5}>Top Products</BoldTitle>
            </Col>
            <Col>
              <MoreButton route='bizStatistics' />
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
            <MoreButton route='invAnalysis' />
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
        <ToDoList data={toDoListData} loading={toDoListLoading} />
        <Sales />
        <Row justify='center' gutter={[30, 20]}>
          <Col span={7}>
            <StatisticsDashboard
              data={statisticsData}
              loading={statisticsLoading}
            />
          </Col>
          <Col span={17}>
            <RecentOrder data={orderData} loading={orderLoading} />
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
