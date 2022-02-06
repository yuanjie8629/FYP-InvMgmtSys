import React, { useEffect, useState, lazy, Suspense } from 'react';
import ColorCard from '@components/Card/ColorCard';
import MainCardContainer from '@components/Container/MainCardContainer';
import DropdownDate from '@components/Input/DropdownDate';
import Layout from '@components/Layout';
import Statistics from '@components/Statistics';
import statisticsList from '@components/Statistics/statisticsList';
import { Col, Popover, Row, Space, Spin, Typography, message } from 'antd';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './BusinessInsights.less';
import statisticsData from './statisticsData';
import { formatDt, getDt } from '@utils/dateUtils';
import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import keyMetricsList from './keyMetricsList';
import { splitIntoChunks } from '@utils/arrayUtils';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import { useAppSelector } from '@hooks/reduxHooks';
import RankingList from '@components/List/RankingList';
import topProduct from './topProducts';
import { prodCat } from '@utils/optionUtils';

const LineChart = lazy(() => import('@components/Chart/LineChart'));
const CarouselArrow = lazy(() => import('@components/Carousel/CarouselArrow'));

const BusinessStatistics = () => {
  message.config({ duration: 2 });
  const { Text, Title } = Typography;

  const DashboardContainer = (props) => (
    <Space direction='vertical' size={20} className='full-width'>
      {props.children}
    </Space>
  );

  const StatisticsDashboard = (props) => {
    const [statisticsDtInfo, setStatisticsDtInfo] = useState({
      date: getDt(),
      label: 'Today',
      cat: 'tdy',
    });
    const [statisticsTdy, setStatisticsTdy] = useState(
      getDt(undefined, undefined, 'HH:mm:ss')
    );

    useEffect(() => {
      const updateStatistics = setInterval(
        () => setStatisticsTdy(getDt(undefined, undefined, 'HH:mm:ss')),
        600000
      );
      return () => {
        clearInterval(updateStatistics);
      };
    });

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
            <Col key={`col-${statistics.key}`} flex='20%'>
              <MainCard bodyStyle={{ padding: 15 }} style={{ height: 105 }}>
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
              </MainCard>
            </Col>
          ))}
        </Row>
      </DashboardContainer>
    );
  };

  const KeyMetricsDashboard = (props) => {
    const [messageApi, contextHolder] = message.useMessage();

    const [keyMetricsDtInfo, setKeyMetricsDtInfo] = useState({
      date: getDt(),
      label: 'Today',
      cat: 'tdy',
    });

    const [selectedKeyMetrics, setSelectedKeyMetrics] = useState(['Sales']);
    const isSiderCollapsed = useAppSelector((state) => state.sider.collapsed);

    const minSelectedMetrics = 1;
    const maxSelectedMetrics = 5;

    const handleKeyMetricsClick = (keyMetrics) => {
      if (
        selectedKeyMetrics.length === minSelectedMetrics &&
        selectedKeyMetrics.includes(keyMetrics.label)
      ) {
        messageApi.open({
          key: 'minSelectedMetrics',
          type: 'warning',
          content: (
            <span>
              You should select at least <strong>{minSelectedMetrics}</strong>{' '}
              Key Metrics.
            </span>
          ),
          style: { marginLeft: isSiderCollapsed ? 80 : 220 },
        });
        setTimeout(() => message.destroy('minSelectedMetrics'), 2000);
        return;
      }

      if (
        selectedKeyMetrics.length >= maxSelectedMetrics &&
        !selectedKeyMetrics.includes(keyMetrics.label)
      ) {
        messageApi.open({
          key: 'maxSelectedMetrics',
          type: 'warning',
          content: (
            <span>
              You can only select up to <strong>{maxSelectedMetrics}</strong>{' '}
              Key Metrics.
            </span>
          ),
          style: { marginLeft: isSiderCollapsed ? 80 : 220 },
        });

        setTimeout(() => message.destroy('maxSelectedMetrics'), 2000);

        return;
      }
      !selectedKeyMetrics.includes(keyMetrics.label)
        ? setSelectedKeyMetrics([...selectedKeyMetrics, keyMetrics.label])
        : setSelectedKeyMetrics([
            ...selectedKeyMetrics.filter(
              (selected) => selected !== keyMetrics.label
            ),
          ]);
    };

    const data = [
      { Day: '1', Sales: 300, cat: '1' },
      { Day: '2', Sales: 356, cat: '1' },
      { Day: '3', Sales: 481, cat: '1' },
      { Day: '4', Sales: 237, cat: '1' },
      { Day: '5', Sales: 285, cat: '1' },
      { Day: '6', Sales: 300, cat: '1' },
      { Day: '1', Sales: 107, cat: '2' },
      { Day: '2', Sales: 402, cat: '2' },
      { Day: '3', Sales: 266, cat: '2' },
      { Day: '4', Sales: 470, cat: '2' },
      { Day: '5', Sales: 391, cat: '2' },
      { Day: '6', Sales: 379, cat: '2' },
      { Day: '7', Sales: 107, cat: '2' },
      { Day: '8', Sales: 402, cat: '2' },
      { Day: '9', Sales: 266, cat: '2' },
      { Day: '10', Sales: 470, cat: '2' },
      { Day: '11', Sales: 391, cat: '2' },
      { Day: '12', Sales: 379, cat: '2' },
      { Day: '13', Sales: 418, cat: '3' },
      { Day: '14', Sales: 301, cat: '3' },
      { Day: '15', Sales: 317, cat: '3' },
      { Day: '16', Sales: 30, cat: '3' },
      { Day: '17', Sales: 391, cat: '3' },
      { Day: '18', Sales: 106, cat: '3' },
      { Day: '19', Sales: 465, cat: '4' },
      { Day: '20', Sales: 50, cat: '4' },
      { Day: '21', Sales: 321, cat: '4' },
      { Day: '22', Sales: 279, cat: '4' },
      { Day: '23', Sales: 186, cat: '4' },
      { Day: '24', Sales: 500, cat: '4' },
      { Day: '25', Sales: 223, cat: '5' },
      { Day: '26', Sales: 447, cat: '5' },
      { Day: '27', Sales: 70, cat: '5' },
      { Day: '28', Sales: 58, cat: '5' },
      { Day: '29', Sales: 400, cat: '5' },
      { Day: '30', Sales: 600, cat: '5' },
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
      <DashboardContainer>
        {contextHolder}
        <DropdownDate
          onChange={(dateInfo) => {
            setKeyMetricsDtInfo(dateInfo);
          }}
          className='main-card'
        />
        <MainCard>
          <DashboardContainer>
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
            <CarouselArrow>
              {splitIntoChunks(keyMetricsList, 5).map((chunks, index) => (
                <div key={`keyMetricsChunk-${index}`}>
                  <Row gutter={10}>
                    {chunks.map((keyMetrics) => (
                      <Col key={keyMetrics.key} flex='20%'>
                        <ColorCard
                          backgroundColor={
                            !selectedKeyMetrics.includes(keyMetrics.label)
                              ? 'grey'
                              : 'success'
                          }
                          hover='success'
                          label={
                            <>
                              <Text className='text-break'>
                                {keyMetrics.label}
                              </Text>
                              <Popover
                                content={keyMetrics.desc}
                                overlayStyle={{
                                  width: 300,
                                  textAlign: 'justify',
                                }}
                              >
                                <QuestionCircleOutlined
                                  style={{ padding: '0 5px' }}
                                  className='color-grey'
                                />
                              </Popover>
                            </>
                          }
                          indicator={
                            selectedKeyMetrics.includes(keyMetrics.label)
                              ? 'true'
                              : null
                          }
                          bodyStyle={{ padding: 15 }}
                          onClick={() => handleKeyMetricsClick(keyMetrics)}
                        >
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
                        </ColorCard>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </CarouselArrow>
            <Row justify='end' align='middle' gutter={10}>
              <Col>
                <Text type='secondary' className='text-sm'>
                  Metrics Selected: {selectedKeyMetrics.length}/
                  {maxSelectedMetrics}
                </Text>
              </Col>
              <Col>
                <Button
                  type='link'
                  color='info'
                  style={{ fontSize: 12 }}
                  onClick={() => setSelectedKeyMetrics(['Sales'])}
                >
                  Reset
                </Button>
              </Col>
            </Row>
            <Suspense
              fallback={
                <div
                  className='centerFlex'
                  style={{ width: 1176, height: 400 }}
                >
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
                seriesField='cat'
              />
            </Suspense>
          </DashboardContainer>
        </MainCard>
      </DashboardContainer>
    );
  };

  const RankingDashboard = (props) => {
    const [rankingDtInfo, setRankingDtInfo] = useState({
      date: getDt(),
      label: 'Today',
      cat: 'tdy',
    });

    return (
      <DashboardContainer>
        <DropdownDate
          onChange={(dateInfo) => {
            setRankingDtInfo(dateInfo);
          }}
          className='main-card'
        />
        <Row justify='center' gutter={[30, 20]}>
          <Col span={12}>
            <MainCard>
              <Space direction='vertical' size={5} className='full-width'>
                <div>
                  <Title level={5}>Product Rankings</Title>

                  <Text className='dashboard-grey-text'>
                    {formatDt(
                      rankingDtInfo.date,
                      rankingDtInfo.cat,
                      'DD-MM-YYYY',
                      'MMM DD, YYYY'
                    )}
                  </Text>
                </div>
                <RankingList
                  dataSource={topProduct}
                  cardSelections={[
                    { key: 'bySales', label: 'By Sales', desc: '2323' },
                    { key: 'byUnits', label: 'By Units', desc: '123213' },
                  ]}
                  selectOptions={{
                    placeholder: 'Category',
                    options: prodCat,
                    allowClear: true,
                  }}
                />
              </Space>
            </MainCard>
          </Col>
          <Col span={12}>
            <MainCard>
              <Space direction='vertical' size={5} className='full-width'>
                <div>
                  <Title level={5}>Promotion Rankings</Title>

                  <Text className='dashboard-grey-text'>
                    {formatDt(
                      rankingDtInfo.date,
                      rankingDtInfo.cat,
                      'DD-MM-YYYY',
                      'MMM DD, YYYY'
                    )}
                  </Text>
                </div>
                <RankingList
                  dataSource={topProduct}
                  cardSelections={[
                    { key: 'bySales', label: 'By Sales', desc: '2323' },
                    { key: 'byUnits', label: 'By Units', desc: '123213' },
                  ]}
                />
              </Space>
            </MainCard>
          </Col>
        </Row>
      </DashboardContainer>
    );
  };

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
