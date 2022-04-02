import MainCardContainer from '@components/Container/MainCardContainer';
import Layout from '@components/Layout';
import { Space, message } from 'antd';
import StatisticsDashboard from './StatisticsDashboard';
import RankingDashboard from './RankingDashboard';
import KeyMetricsDashboard from './KeyMetricsDashboard';

export const DashboardContainer = (props) => (
  <Space direction='vertical' size={25} className='full-width'>
    {props.children}
  </Space>
);

const BusinessStatistics = () => {
  message.config({ duration: 2 });

  return (
    <Layout>
      <MainCardContainer className='business-statistics'>
        <StatisticsDashboard />
        <KeyMetricsDashboard />
        <RankingDashboard />
      </MainCardContainer>
    </Layout>
  );
};

export default BusinessStatistics;
