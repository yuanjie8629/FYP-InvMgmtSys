import React, { useEffect, useState, Suspense } from 'react';
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
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import LineChart from '@components/Chart/LineChart';

const BusinessStatistics = () => {
  const { Text, Title } = Typography;
  const [statisticsDtInfo, setStatisticsDtInfo] = useState({
    date: getDt(),
    label: 'Today',
    cat: 'tdy',
  });

  const [statisticsTdy, setStatisticsTdy] = useState(
    getDt(undefined, undefined, 'HH:mm:ss')
  );

  const [keyMetricsDtInfo, setKeyMetricsDtInfo] = useState({
    date: getDt(),
    label: 'Today',
    cat: 'tdy',
  });

  const [carouselPrev, setCarouselPrev] = useState(false);
  const [carouselNext, setCarouselNext] = useState(true);

  useEffect(() => {
    const updateStatistics = setInterval(
      () => setStatisticsTdy(getDt(undefined, undefined, 'HH:mm:ss')),
      600000
    );

    return () => clearInterval(updateStatistics);
  });

  const data = [
    { Day: '1', Sales: 300 },
    { Day: '2', Sales: 356 },
    { Day: '3', Sales: 481 },
    { Day: '4', Sales: 237 },
    { Day: '5', Sales: 285 },
    { Day: '6', Sales: 300 },
    { Day: '7', Sales: 107 },
    { Day: '8', Sales: 402 },
    { Day: '9', Sales: 266 },
    { Day: '10', Sales: 470 },
    { Day: '11', Sales: 391 },
    { Day: '12', Sales: 379 },
    { Day: '13', Sales: 418 },
    { Day: '14', Sales: 301 },
    { Day: '15', Sales: 317 },
    { Day: '16', Sales: 30 },
    { Day: '17', Sales: 391 },
    { Day: '18', Sales: 106 },
    { Day: '19', Sales: 465 },
    { Day: '20', Sales: 50 },
    { Day: '21', Sales: 321 },
    { Day: '22', Sales: 279 },
    { Day: '23', Sales: 186 },
    { Day: '24', Sales: 500 },
    { Day: '25', Sales: 223 },
    { Day: '26', Sales: 447 },
    { Day: '27', Sales: 70 },
    { Day: '28', Sales: 58 },
    { Day: '29', Sales: 400 },
    { Day: '30', Sales: 600 },
  ];

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

  const getKeyMetricsVal = (keyMetrics) => {
    let value = keyMetricsValList.find(
      (metrics) => metrics.key === keyMetrics.key
    ).value;

    return keyMetrics.cat === 'money'
      ? moneyFormatter(value, true)
      : keyMetrics.cat === 'percent'
      ? percentFormatter(value, true)
      : value;
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
          <Space direction='vertical' size={20} className='full-width'>
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
              prevArrow={carouselPrev ? <MdChevronLeft /> : <></>}
              nextArrow={carouselNext ? <MdChevronRight /> : <></>}
              afterChange={(current) => {
                if (current > 0) setCarouselPrev(true);
                else setCarouselPrev(false);
                if (
                  current !== splitIntoChunks(keyMetricsList, 5).length - 1 ||
                  current === 0
                )
                  setCarouselNext(true);
                else setCarouselNext(false);
              }}
            >
              {splitIntoChunks(keyMetricsList, 5).map((chunks, index) => (
                <div key={`keyMetricsChunk-${index}`}>
                  <Row gutter={20}>
                    {chunks.map((keyMetrics) => (
                      <Col key={keyMetrics.key} flex='20%'>
                        <SmallCard
                          backgroundColor='grey'
                          bodyStyle={{ padding: 15 }}
                        >
                          <Space
                            direction='vertical'
                            size={10}
                            className='full-width'
                          >
                            <Row justify='space-between' style={{ height: 35 }}>
                              <Col span={20}>
                                <Text type='secondary'>{keyMetrics.label}</Text>
                              </Col>
                              <Col span={4}>
                                <HiCheckCircle
                                  size={20}
                                  className='color-primary'
                                />
                              </Col>
                            </Row>
                            <Row gutter={5} style={{ height: 40 }}>
                              <Col>
                                {keyMetrics.cat === 'money' ? (
                                  <Text strong>RM</Text>
                                ) : null}
                              </Col>
                              <Col>
                                <Title level={4} style={{ fontWeight: 500 }}>
                                  {getKeyMetricsVal(keyMetrics)}
                                </Title>
                              </Col>
                              <Col>
                                {keyMetrics.cat === 'percent' ? (
                                  <Text strong>%</Text>
                                ) : null}
                              </Col>
                            </Row>
                          </Space>
                        </SmallCard>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Carousel>

            <Suspense
              fallback={
                <div className='centerFlex full-height full-width'>
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 30 }} spin />
                    }
                  />
                </div>
              }
            >
              <LineChart
                data={data}
                tooltipValPrefix='RM '
                tooltipName='Total Sales'
              />
            </Suspense>
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default BusinessStatistics;
