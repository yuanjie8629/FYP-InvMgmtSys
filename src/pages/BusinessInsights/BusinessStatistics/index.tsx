import React, { useState, lazy, Suspense, useContext } from 'react';
import ColorCard from '@components/Card/ColorCard';
import MainCardContainer from '@components/Container/MainCardContainer';
import DropdownDate from '@components/Input/DropdownDate';
import Layout from '@components/Layout';
import { Col, Row, Space, Spin, Typography, message, Checkbox } from 'antd';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { formatDt, getDt } from '@utils/dateUtils';
import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import keyMetricsList from './keyMetricsList';
import { splitIntoChunks } from '@utils/arrayUtils';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import Popover from '@components/Popover';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import StatisticsDashboard from './StatisticsDashboard';
import RankingDashboard from './RankingDashboard';

const LineChart = lazy(() => import('@components/Chart/LineChart'));
const CarouselArrow = lazy(() => import('@components/Carousel/CarouselArrow'));

export const DashboardContainer = (props) => (
  <Space direction='vertical' size={25} className='full-width'>
    {props.children}
  </Space>
);

const BusinessStatistics = () => {
  message.config({ duration: 2 });
  const { Text, Title } = Typography;

  const KeyMetricsDashboard = (props) => {
    const [messageApi] = useContext(MessageContext);

    const [keyMetricsDtInfo, setKeyMetricsDtInfo] = useState({
      date: getDt(),
      label: 'Today',
      cat: 'tdy',
    });
    
    const [selectedKeyMetrics, setSelectedKeyMetrics] = useState(['Sales']);

    const minSelectedMetrics = 1;
    const [maxSelectedMetrics, setMaxSelectedMetrics] = useState(5);

    const handleKeyMetricsClick = (keyMetrics) => {
      if (maxSelectedMetrics === 1) {
        setSelectedKeyMetrics([keyMetrics.label]);
        return;
      }

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
        });

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
        });

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
      { key: 'profit', value: 324.5 },
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
                <BoldTitle level={5}>Key Metrics</BoldTitle>
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
                            <Popover content={keyMetrics.desc}>
                              <Text>{keyMetrics.label}</Text>
                              <QuestionCircleOutlined
                                style={{ padding: '0 5px' }}
                                className='color-grey'
                              />
                            </Popover>
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
                              {keyMetrics.cat === 'money' && (
                                <Text strong>RM</Text>
                              )}
                            </Col>
                            <Col>
                              <Title level={4}>
                                {getKeyMetricsVal(keyMetrics)}
                              </Title>
                            </Col>
                            <Col>
                              {keyMetrics.cat === 'percent' && (
                                <Text strong>%</Text>
                              )}
                            </Col>
                          </Row>
                        </ColorCard>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </CarouselArrow>
            <Row justify='space-between' align='middle' gutter={10}>
              <Col>
                <Checkbox
                  className='color-grey'
                  defaultChecked
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMaxSelectedMetrics(5);
                    } else {
                      setMaxSelectedMetrics(1);
                      setSelectedKeyMetrics([selectedKeyMetrics[0]]);
                    }
                  }}
                >
                  Stack Metrics
                </Checkbox>
              </Col>
              <Col>
                <Space>
                  <Text type='secondary' className='text-sm'>
                    Metrics Selected: {selectedKeyMetrics.length}/
                    {maxSelectedMetrics}
                  </Text>
                  <Button
                    type='link'
                    color='info'
                    style={{ fontSize: 12 }}
                    onClick={() => setSelectedKeyMetrics(['Sales'])}
                  >
                    Reset
                  </Button>
                </Space>
              </Col>
            </Row>
            <Suspense
              fallback={
                <div
                  className='center-flex'
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
                yAxis={{
                  label: maxSelectedMetrics !== 1 ? null : undefined,
                }}
              />
            </Suspense>
          </DashboardContainer>
        </MainCard>
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
