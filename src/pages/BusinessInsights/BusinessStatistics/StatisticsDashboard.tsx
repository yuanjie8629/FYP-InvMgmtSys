import { statisticsAPI } from '@api/services/analysisAPI';
import MainCard from '@components/Card/MainCard';
import DropdownDate from '@components/Input/DropdownDate';
import Statistics from '@components/Statistics';
import statisticsList from '@components/Statistics/statisticsList';
import { MessageContext } from '@contexts/MessageContext';
import { getDt } from '@utils/dateUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { Col, Row, Skeleton } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { DashboardContainer } from '.';

const StatisticsDashboard = (props) => {
  const [statisticsDtInfo, setStatisticsDtInfo] = useState({
    date: getDt(),
    label: 'Today',
    cat: 'tdy',
  });

  const [statisticsTdy, setStatisticsTdy] = useState(
    getDt(undefined, undefined, 'HH:mm:ss')
  );
  const [statisticsData, setStatisticsData] = useState({});
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    const updateStatistics = setInterval(() => {
      if (statisticsDtInfo.cat === 'tdy') {
        setStatisticsTdy(getDt(undefined, undefined, 'HH:mm:ss'));
      }
    }, 600000);

    return () => {
      clearInterval(updateStatistics);
    };
  }, [statisticsDtInfo.cat]);

  const getStatisticsData = (isMounted = true) => {
    setStatisticsLoading(true);
    statisticsAPI(
      statisticsDtInfo.date.includes(' ~ ')
        ? statisticsDtInfo.date.split(' ~ ')[0]
        : statisticsDtInfo.date,
      statisticsDtInfo.date.includes(' ~ ')
        ? statisticsDtInfo.date.split(' ~ ')[1]
        : statisticsDtInfo.date
    )
      .then((res) => {
        if (isMounted) {
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

  useEffect(() => {
    let isMounted = true;
    getStatisticsData(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statisticsDtInfo]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <DashboardContainer>
      <DropdownDate
        onChange={(dateInfo) => {
          setStatisticsDtInfo(dateInfo);
        }}
        className='main-card'
      />
      <Row justify='center' gutter={[20, 20]}>
        {statisticsList.map((statistics, index) => (
          <Col key={`col-${statistics.key}`} flex='25%'>
            <MainCard bodyStyle={{ padding: 15 }} style={{ height: 105 }}>
              {statisticsLoading || Object.keys(statisticsData).length <= 0 ? (
                <Skeleton
                  active={statisticsLoading}
                  avatar={{ size: 50 }}
                  title={null}
                  paragraph={{ rows: 3, width: '100%' }}
                />
              ) : (
                <Statistics
                  key={statistics.key}
                  value={statisticsData[statistics.key]}
                  title={statistics.title}
                  date={statisticsDtInfo.date}
                  untilTm={
                    statisticsDtInfo.cat === 'tdy'
                      ? `Until ${statisticsTdy}`
                      : ''
                  }
                  icon={statistics.icon}
                  color={statistics.color}
                  prefix={statistics.prefix}
                  suffix={statistics.suffix}
                  toFixed={statistics.toFixed}
                  space={15}
                  valueSize={16}
                  avatarSize={55}
                />
              )}
            </MainCard>
          </Col>
        ))}
      </Row>
    </DashboardContainer>
  );
};

export default StatisticsDashboard;
