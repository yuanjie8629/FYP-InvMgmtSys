import ContainerCard from '@components/Card/ContainerCard';
import DropdownDate from '@components/Input/DropdownDate';
import Layout from '@components/Layout/Layout';
import Statistics from '@components/Statistics';
import statisticsList from '@components/Statistics/statisticsList';
import { Col, Row, Space } from 'antd';

import './BusinessInsights.less';
import statisticsData from './statisticsData';

const BusinessStatistics = () => {
  const DateCard = (props) => (
    <ContainerCard contentStyle={{ padding: 0, textAlign: 'center' }}>
      {props.children}
    </ContainerCard>
  );

  return (
    <Layout>
      <div className='statistics'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <DateCard>
              <DropdownDate />
            </DateCard>
          </Row>
          <Row>
            {statisticsList.map((statistics) => (
              <Col>
                <ContainerCard>
                  <Statistics
                    key={statistics.key}
                    title={statistics.title}
                    icon={statistics.icon}
                    color={statistics.color}
                    value={statisticsData[statistics.key]}
                    prefix={statistics.prefix}
                    suffix={statistics.suffix}
                    toFixed={statistics.toFixed}
                  />
                </ContainerCard>
              </Col>
            ))}
          </Row>
          <Row justify='center'>
            <DateCard>
              <DropdownDate />
            </DateCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default BusinessStatistics;
