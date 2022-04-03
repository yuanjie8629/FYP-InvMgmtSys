import React, { lazy } from 'react';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import Layout from '@components/Layout';
import Table from '@components/Table';
import MainCardContainer from '@components/Container/MainCardContainer';
import invAnalysis from './invAnalysis';
import './Dashboard.less';
import { BoldTitle } from '@components/Title';
import ToDoList from './ToDoList';
import Sales from './Sales';
import MoreButton from '@components/Button/ActionButton/MoreButton';
import StatisticsDashboard from './StatisticsDashboard';
import RecentOrder from './RecentOrder';
import TopProducts from './TopProducts';
const MainCard = lazy(() => import('@components/Card/MainCard'));

export interface DashboardProps {
  data: any;
  loading: boolean;
}

const Dashboard = () => {
  const { Text } = Typography;

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
