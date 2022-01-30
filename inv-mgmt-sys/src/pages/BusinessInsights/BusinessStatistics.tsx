import SmallCard from '@components/Card/SmallCard';
import MainCardContainer from '@components/Container/MainCardContainer';
import DropdownDate from '@components/Input/DropdownDate';
import Layout from '@components/Layout/Layout';
import Statistics from '@components/Statistics';
import statisticsList from '@components/Statistics/statisticsList';
import { getDt } from '@utils/dateUtils';
import { Card, Col, Row } from 'antd';

import './BusinessInsights.less';
import statisticsData from './statisticsData';

const BusinessStatistics = () => {
  const DateCard = (props) => (
    <Card bodyStyle={{ padding: 0, textAlign: 'center' }}>
      {props.children}
    </Card>
  );

  return (
    <Layout>
      <MainCardContainer className='business-statistics'>
        <DateCard>
          <DropdownDate />
        </DateCard>

        <Row justify='center' gutter={[20, 20]}>
          {statisticsList.map((statistics, index) => (
            <Col flex='20%'>
              <SmallCard bodyStyle={{ padding: '20px 10px 20px 14px' }}>
                <Statistics
                  key={statistics.key}
                  value={statisticsData[statistics.key]}
                  title={statistics.title}
                  date={getDt(undefined, undefined, 'MMMM DD, YYYY')}
                  icon={statistics.icon}
                  color={statistics.color}
                  prefix={statistics.prefix}
                  suffix={statistics.suffix}
                  toFixed={statistics.toFixed}
                  space={15}
                  valueSize={16}
                />
              </SmallCard>
            </Col>
          ))}
        </Row>

        <DateCard>
          <DropdownDate />
        </DateCard>
      </MainCardContainer>
    </Layout>
  );
};

export default BusinessStatistics;
