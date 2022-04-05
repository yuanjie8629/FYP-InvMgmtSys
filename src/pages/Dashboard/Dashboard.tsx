import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import './Dashboard.less';
import ToDoList from './ToDoList';
import Sales from './Sales';
import StatisticsDashboard from './StatisticsDashboard';
import RecentOrder from './RecentOrder';
import TopProducts from './TopProducts';
import InvAnalysis from './InvAnalysis';
export interface DashboardProps {
  data: any;
  loading: boolean;
}

const Dashboard = () => {
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
