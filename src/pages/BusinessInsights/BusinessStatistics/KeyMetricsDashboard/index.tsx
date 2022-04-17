import MainCard from '@components/Card/MainCard';
import { MessageContext } from '@contexts/MessageContext';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  formatDt,
  getDayOfWeek,
  getDt,
  getEndMthDt,
  getEndYrDt,
  getMth,
  parseDateTime,
} from '@utils/dateUtils';
import { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react';
import { DashboardContainer } from '..';
import DropdownDate from '@components/Input/DropdownDate';
import { Checkbox, Col, Row, Skeleton, Space, Typography } from 'antd';
import { BoldTitle } from '@components/Title';
import Button from '@components/Button';
import { splitIntoChunks } from '@utils/arrayUtils';
import keyMetricsList from './keyMetricsList';
import ColorCard from '@components/Card/ColorCard';
import {
  generateKeyMetricsReportAPI,
  keyMetricsAPI,
  KeyMetricsDateType,
  keyMetricsSummaryAPI,
  KeyMetricsType,
} from '@api/services/analysisAPI';
import { serverErrMsg } from '@utils/messageUtils';
import Popover from '@components/Popover';
import LoadChart from '@components/Spin/LoadChart';
import { PrintButton } from '@components/Button/ActionButton';
import ExportButton from '@components/Button/ActionButton/ExportButton';

const LineChart = lazy(() => import('@components/Chart/LineChart'));
const CarouselArrow = lazy(() => import('@components/Carousel/CarouselArrow'));

const KeyMetricsDashboard = (props) => {
  const { Text, Title } = Typography;
  const [messageApi] = useContext(MessageContext);
  const chartRef = useRef<any>();
  const [keyMetricsDtInfo, setKeyMetricsDtInfo] = useState({
    date: getDt(),
    label: 'Today',
    cat: 'tdy',
  });
  const [selectedKeyMetrics, setSelectedKeyMetrics] = useState<
    KeyMetricsType[]
  >(['sales']);
  const minSelectedMetrics = 1;
  const [maxSelectedMetrics, setMaxSelectedMetrics] = useState(5);
  const [summaryData, setSummaryData] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const getKeymetricsSummary = (isMounted = true) => {
    setSummaryLoading(true);
    setSummaryData({});
    let formattedDate = parseAPIDate(
      keyMetricsDtInfo.date.includes(' ~ ')
        ? keyMetricsDtInfo.date.split(' ~ ')[0]
        : keyMetricsDtInfo.date,
      keyMetricsDtInfo.date.includes(' ~ ')
        ? keyMetricsDtInfo.date.split(' ~ ')[1]
        : keyMetricsDtInfo.date
    );
    keyMetricsSummaryAPI(formattedDate.fromDate, formattedDate.toDate)
      .then((res) => {
        if (isMounted) {
          setSummaryData(res?.data);
          setSummaryLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setSummaryLoading(false);
          showServerErrMsg();
        }
      });
  };

  const parseAPIDate = (fromDate: string, toDate: string) => {
    let type: KeyMetricsDateType;
    if (['byDay', 'tdy', 'ytd'].includes(keyMetricsDtInfo.cat)) {
      type = 'hour';
      toDate = fromDate;
    } else if (
      ['byWeek', 'byMonth', 'past7d', 'past30d'].includes(keyMetricsDtInfo.cat)
    ) {
      type = 'day';

      if (keyMetricsDtInfo.cat === 'byMonth') {
        toDate = getEndMthDt(toDate, 'DD-MM-YYYY');
      }
    } else if (keyMetricsDtInfo.cat === 'byYear') {
      type = 'month';
      toDate = getEndYrDt(toDate, 'DD-MM-YYYY');
    }
    return { fromDate: fromDate, toDate: toDate, dateType: type };
  };

  const getKeyMetricsData = (isMounted = true) => {
    setLoading(true);
    let { fromDate, toDate, dateType } = parseAPIDate(
      keyMetricsDtInfo.date.split(' ~ ')[0],
      keyMetricsDtInfo.date.split(' ~ ')[1]
    );

    keyMetricsAPI({
      fromDate: fromDate,
      toDate: toDate,
      key: selectedKeyMetrics.map((key) => key),
      dateType: dateType,
    })
      .then((res) => {
        if (isMounted) {
          let newData = res.data?.map((datum) => {
            let newRange;
            if (keyMetricsDtInfo.cat === 'byWeek') {
              let dateRange = `${getDt(
                datum.day,
                'YYYY-MM-DD',
                'DD MMM'
              )} (${getDayOfWeek(datum.day, 'YYYY-MM-DD', 'ddd')})`;

              return {
                ...datum,
                day: dateRange,
                category: keyMetricsList.find(
                  (metrics) => metrics.key === datum?.category
                )?.label,
              };
            } else if (
              ['byMonth', 'past7d', 'past30d'].includes(keyMetricsDtInfo.cat)
            ) {
              if (keyMetricsDtInfo.cat === 'byMonth') {
                newRange = getDt(datum.day, 'YYYY-MM-DD', 'DD MMM');
              } else if (['past7d', 'past30d'].includes(keyMetricsDtInfo.cat)) {
                newRange = getDt(datum.day, 'YYYY-MM-DD', 'DD MMM');
              }
              return {
                ...datum,
                day: newRange,
                category: keyMetricsList.find(
                  (metrics) => metrics.key === datum?.category
                )?.label,
              };
            } else if (['byDay', 'tdy', 'ytd'].includes(keyMetricsDtInfo.cat)) {
              let dateRange = parseDateTime(datum.hour);
              newRange = dateRange.hour();
              return {
                ...datum,
                hour: `${String(newRange)}:00`,
                category: keyMetricsList.find(
                  (metrics) => metrics.key === datum?.category
                )?.label,
              };
            } else {
              let dateRange = getMth(datum.month, 'YYYY-MM-DD', 'MMM');
              return {
                ...datum,
                month: dateRange,
                category: keyMetricsList.find(
                  (metrics) => metrics.key === datum?.category
                )?.label,
              };
            }
          });
          setData(newData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
  };

  const handleGenerateReport = () => {
    setReportLoading(true);
    generateKeyMetricsReportAPI(
      parseAPIDate(
        keyMetricsDtInfo.date.split(' ~ ')[0],
        keyMetricsDtInfo.date.split(' ~ ')[1]
      )
    )
      .then((res) => {
        setReportLoading(false);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setReportLoading(false);
          showServerErrMsg();
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    getKeyMetricsData(isMounted);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeyMetrics, keyMetricsDtInfo]);

  useEffect(() => {
    let isMounted = true;
    getKeymetricsSummary(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyMetricsDtInfo]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const handleKeyMetricsClick = (keyMetrics) => {
    if (maxSelectedMetrics === 1) {
      setSelectedKeyMetrics([keyMetrics.key]);
      return;
    }

    if (
      selectedKeyMetrics.length === minSelectedMetrics &&
      selectedKeyMetrics.includes(keyMetrics.key)
    ) {
      messageApi.open({
        type: 'warning',
        content: (
          <span>
            You should select at least <strong>{minSelectedMetrics}</strong> Key
            Metrics.
          </span>
        ),
      });

      return;
    }

    if (
      selectedKeyMetrics.length >= maxSelectedMetrics &&
      !selectedKeyMetrics.includes(keyMetrics.key)
    ) {
      messageApi.open({
        type: 'warning',
        content: (
          <span>
            You can only select up to <strong>{maxSelectedMetrics}</strong> Key
            Metrics.
          </span>
        ),
      });

      return;
    }
    !selectedKeyMetrics.includes(keyMetrics.key)
      ? setSelectedKeyMetrics([...selectedKeyMetrics, keyMetrics.key])
      : setSelectedKeyMetrics([
          ...selectedKeyMetrics.filter(
            (selected) => selected !== keyMetrics.key
          ),
        ]);
  };

  const getKeyMetricsVal = (keyMetrics) => {
    let value =
      summaryData[
        Object.keys(summaryData).find((key) => key === keyMetrics.key)
      ];

    return value?.toFixed(keyMetrics.toFixed);
  };

  const getChartTitle = ['byDay', 'tdy', 'ytd'].includes(keyMetricsDtInfo.cat)
    ? 'Hour'
    : ['byWeek', 'byMonth', 'past7d', 'past30d'].includes(keyMetricsDtInfo.cat)
    ? 'Day'
    : 'Month';

  const downloadImage = () => {
    chartRef.current?.downloadImage(
      `${selectedKeyMetrics.map((key) => key)}_${keyMetricsDtInfo.date}`,
      'image/jpg',
      1
    );
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
              <Space size={20}>
                <ExportButton
                  onClick={downloadImage}
                  disabled={loading || summaryLoading}
                >
                  Export Chart
                </ExportButton>
                <PrintButton
                  disabled={loading || summaryLoading}
                  onClick={handleGenerateReport}
                  loading={reportLoading}
                >
                  Generate Report
                </PrintButton>
              </Space>
            </Col>
          </Row>

          <CarouselArrow>
            {splitIntoChunks(keyMetricsList, 5).map((chunks, index) => (
              <div key={`keyMetricsChunk-${index}`}>
                <Row gutter={10}>
                  {chunks.map((keyMetrics) => (
                    <Col key={keyMetrics.key} flex='20%'>
                      {summaryLoading ||
                      Object.keys(summaryData).length <= 0 ? (
                        <ColorCard
                          backgroundColor='grey'
                          bodyStyle={{ padding: 15 }}
                        >
                          <Skeleton
                            active={summaryLoading}
                            paragraph={{ rows: 1, width: '50%' }}
                          />
                        </ColorCard>
                      ) : (
                        <ColorCard
                          backgroundColor={
                            !selectedKeyMetrics.includes(keyMetrics.key)
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
                            selectedKeyMetrics.includes(keyMetrics.key)
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
                      )}
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
                  onClick={() => setSelectedKeyMetrics(['sales'])}
                >
                  Reset
                </Button>
              </Space>
            </Col>
          </Row>
          <Suspense fallback={<LoadChart />}>
            {loading || summaryLoading ? (
              <LoadChart />
            ) : data.length > 0 ? (
              <LineChart
                data={data}
                ratioData={maxSelectedMetrics !== 1 && summaryData}
                titleX={getChartTitle}
                seriesField='category'
                yAxis={{
                  label: maxSelectedMetrics !== 1 ? null : undefined,
                }}
                onReady={(plot) => {
                  chartRef.current = plot;
                }}
              />
            ) : (
              <div
                className='center-flex full-height full-width'
                style={{ height: 400 }}
              >
                <Text type='secondary' strong>
                  Failed to load data, please refresh and try again.
                </Text>
              </div>
            )}
          </Suspense>
        </DashboardContainer>
      </MainCard>
    </DashboardContainer>
  );
};

export default KeyMetricsDashboard;
