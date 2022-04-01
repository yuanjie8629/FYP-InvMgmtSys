import MainCard from '@components/Card/MainCard';
import { BoldTitle } from '@components/Title';
import { Skeleton, Space, Typography } from 'antd';
import statisticsList from '@components/Statistics/statisticsList';
import { DashboardProps } from './Dashboard';
import Statistics from '@components/Statistics';

const StatisticsDashboard = ({ data, loading }: DashboardProps) => {
  const { Text } = Typography;
  return (
    <MainCard>
      <BoldTitle level={5}>Statistics</BoldTitle>
      {loading || Object.keys(data).length <= 0 ? (
        <Skeleton active={loading} paragraph={null} title={{ width: '50%' }} />
      ) : (
        <Text className='dashboard-grey-text'>{data['date']}</Text>
      )}
      <Space
        direction={'vertical'}
        size={40}
        style={{ width: '100%', paddingTop: 25 }}
      >
        {statisticsList.map((statistics) =>
          loading || Object.keys(data).length <= 0 ? (
            <Skeleton
              active={loading}
              avatar={{ size: 50 }}
              title={null}
              paragraph={{ rows: 2, width: ['50%', '100%'] }}
            />
          ) : (
            <Statistics
              key={statistics.key}
              title={statistics.title}
              icon={statistics.icon}
              color={statistics.color}
              value={data[statistics.key]}
              prefix={statistics.prefix}
              suffix={statistics.suffix}
              toFixed={statistics.toFixed}
            />
          )
        )}
      </Space>
    </MainCard>
  );
};

export default StatisticsDashboard;
