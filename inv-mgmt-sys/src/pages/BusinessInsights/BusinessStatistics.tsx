import React, { Suspense, useState } from 'react';
import SmallCard from '@components/Card/SmallCard';
import MainCardContainer from '@components/Container/MainCardContainer';
import DropdownDate from '@components/Input/DropdownDate';
import Layout from '@components/Layout/Layout';
import Statistics from '@components/Statistics';
import statisticsList from '@components/Statistics/statisticsList';
import { Carousel, Col, Row, Space, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './BusinessInsights.less';
import statisticsData from './statisticsData';
import { formatDt, getDt } from '@utils/dateUtils';
import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import keyMetricsList from './keyMetricsList';
import { splitIntoChunks } from '@utils/arrayUtils';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { HiCheckCircle } from 'react-icons/hi';

const BusinessStatistics = () => {
  const { Text, Title } = Typography;
  const [statisticsDtInfo, setStatisticsDtInfo] = useState({
    date: getDt(),
    label: 'Today',
    cat: 'tdy',
  });

  const [keyMetricsDtInfo, setKeyMetricsDtInfo] = useState({
    date: getDt(),
    label: 'Today',
    cat: 'tdy',
  });

  const keyMetricsValList = [
    { key: 'sales', value: 600 },
    { key: 'revenue', value: 324.5 },
    { key: 'conversionRt', value: 0.2949 },
    { key: 'salesPerOrder', value: 40.0 },
    { key: 'visitors', value: 78 },
    { key: 'buyers', value: 32 },
    { key: 'orders', value: 16 },
    { key: 'avgOrderRev', value: 20.25 },
    { key: 'unitSold', value: 42 },
    { key: 'avgBktSize', value: 2.625 },
  ];

  const generateKeyMetrics = () => {
    let keyMetricsChunks = splitIntoChunks(keyMetricsList, 5);
    return keyMetricsChunks.map((chunks) => (
      <div>
        <Row gutter={20}>
          {chunks.map((keyMetrics) => (
            <Col flex='20%'>
              <SmallCard backgroundColor='grey' bodyStyle={{ padding: 15 }}>
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Text type='secondary'>{keyMetrics.label}</Text>
                    </Col>
                    <Col>
                      <HiCheckCircle size={20} className='color-primary' />
                    </Col>
                  </Row>
                  <Row align='bottom' gutter={10}>
                    <Col>
                      {keyMetrics.prefix !== undefined ? (
                        <Text strong>{keyMetrics.prefix}</Text>
                      ) : null}
                    </Col>
                    <Col>
                      <Title level={3} style={{ fontWeight: 500 }}>
                        {
                          keyMetricsValList.find(
                            (metrics) => metrics.key === keyMetrics.key
                          ).value
                        }
                      </Title>
                    </Col>
                    <Col>
                      {' '}
                      {keyMetrics.suffix !== undefined ? (
                        <Text strong>{keyMetrics.suffix}</Text>
                      ) : null}
                    </Col>
                  </Row>
                </Space>
              </SmallCard>
            </Col>
          ))}
        </Row>
      </div>
    ));
  };

  return (
    <Layout>
      <MainCardContainer className='business-statistics'>
        <DropdownDate
          onChange={(dateInfo) => {
            setStatisticsDtInfo(dateInfo);
          }}
        />
        <Row justify='center' gutter={[20, 20]}>
          {statisticsList.map((statistics, index) => (
            <Col flex='20%'>
              <SmallCard
                bodyStyle={{ padding: '15px 10px 0 14px' }}
                style={{ height: 90 }}
              >
                <Statistics
                  key={statistics.key}
                  value={statisticsData[statistics.key]}
                  title={statistics.title}
                  date={
                    statisticsDtInfo.cat === 'tdy'
                      ? `Until ${getDt(undefined, undefined, 'HH:MM:SS')}`
                      : ''
                  }
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

        <DropdownDate
          onChange={(dateInfo) => {
            setKeyMetricsDtInfo(dateInfo);
          }}
        />
        <MainCard>
          <Space direction='vertical' size={20} className='width-full'>
            <Row justify='space-between' align='middle'>
              <Col>
                <Title level={5}>Key Metrics</Title>

                <Text className='dashboard-grey-text'>
                  {formatDt(
                    keyMetricsDtInfo.date,
                    keyMetricsDtInfo.cat,
                    'DD-MM-YYYY',
                    'MMM DD, YYYY'
                  )}
                </Text>
              </Col>
              <Col>
                <Button type='primary'>Generate Report(s)</Button>
              </Col>
            </Row>

            <Carousel
              dots={false}
              arrows
              prevArrow={<MdChevronLeft />}
              nextArrow={<MdChevronRight />}
            >
              {generateKeyMetrics()}
            </Carousel>
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
            ></Suspense>
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default BusinessStatistics;
