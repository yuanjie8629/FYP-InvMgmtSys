import MainCard from '@components/Card/MainCard';
import { BoldTitle } from '@components/Title';
import { Skeleton, Space, Typography } from 'antd';
import statisticsList from '@components/Statistics/statisticsList';
import Statistics from '@components/Statistics';
import { getDt } from '@utils/dateUtils';
import { useContext, useEffect, useState } from 'react';
import { statisticsAPI } from '@api/services/analysisAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';

const StatisticsDashboard = () => {
  const { Text } = Typography;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    statisticsAPI(getDt(), getDt())
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <MainCard>
      <BoldTitle level={5}>Statistics</BoldTitle>
      <Text className='dashboard-grey-text'>
        {getDt(undefined, undefined, 'DD MMMM YYYY')}
      </Text>
      <Space
        direction='vertical'
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
