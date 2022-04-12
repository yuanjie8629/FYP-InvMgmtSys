import React, { Suspense, useEffect, useState } from 'react';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import './Dashboard.less';
import { BoldTitle } from '@components/Title';
import { Radio } from 'antd';
import MainCard from '@components/Card/MainCard';
import MoreButton from '@components/Button/ActionButton/MoreButton';
import { dateRangeOptions } from '@utils/optionUtils';
import LineChart from '@components/Chart/LineChart';
import {
  formatDt,
  getDayOfWeek,
  getDt,
  getMth,
  getMthDt,
  getMthYr,
  getWeekDt,
  getWeekOfYear,
  getYr,
  getYrDt,
  parseDateTime,
  getThisMthTilTdy,
  getThisWeekTilTdy,
  getThisYrTilTdy,
} from '@utils/dateUtils';
import { keyMetricsAPI, KeyMetricsDateType } from '@api/services/analysisAPI';
import { useContext } from 'react';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import LoadChart from '@components/Spin/LoadChart';

const Sales = () => {
  const { Text } = Typography;
  const [salesDateRange, setSalesDateRange] = useState('day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    setLoading(true);
    let isMounted = true;
    let fromDate = '';
    let toDate = '';
    let dateRange: KeyMetricsDateType;
    if (salesDateRange === 'month') {
      dateRange = 'day';
      let date = getMthDt().split(' ~ ');
      fromDate = date[0];
      toDate = date[1];
    } else if (salesDateRange === 'week') {
      dateRange = 'day';
      let date = getWeekDt().split(' ~ ');
      fromDate = date[0];
      toDate = date[1];
    } else if (salesDateRange === 'day') {
      dateRange = 'hour';
      fromDate = getDt();
      toDate = getDt();
    } else {
      dateRange = 'month';
      let date = getYrDt().split(' ~ ');
      fromDate = date[0];
      toDate = date[1];
    }

    keyMetricsAPI({
      fromDate: fromDate,
      toDate: toDate,
      key: ['sales'],
      dateType: dateRange,
    })
      .then((res) => {
        if (isMounted) {
          let newData = res.data?.map((datum) => {
            let newRange;
            if (salesDateRange === 'week') {
              let dateRange = `${getDt(
                datum.day,
                'YYYY-MM-DD',
                'DD MMM'
              )} (${getDayOfWeek(datum.day, 'YYYY-MM-DD', 'ddd')})`;

              return { ...datum, day: dateRange };
            } else if (salesDateRange === 'month') {
              let dateRange = getDt(datum.day, 'YYYY-MM-DD', 'DD MMM');
              newRange = dateRange;
              return { ...datum, day: newRange };
            } else if (salesDateRange === 'day') {
              let dateRange = parseDateTime(datum.hour);
              newRange = dateRange.hour();
              return { ...datum, hour: `${String(newRange)}:00` };
            } else {
              let dateRange = getMth(datum.month, 'YYYY-MM-DD', 'MMM');
              return { ...datum, month: dateRange };
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

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesDateRange]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const getSalesDate =
    salesDateRange === 'month'
      ? `${getMthYr()} (${formatDt(
          getThisMthTilTdy(),
          'month',
          'DD-MM-YYYY ~ DD-MM-YYYY',
          'DD-MM-YYYY'
        )})`
      : salesDateRange === 'week'
      ? `${getWeekOfYear()} (${formatDt(
          getThisWeekTilTdy(),
          'week',
          'DD-MM-YYYY ~ DD-MM-YYYY',
          'DD-MM-YYYY'
        )})`
      : salesDateRange === 'day'
      ? `${formatDt(getDt(), 'byDay', 'DD-MM-YYYY', 'DD MMMM YYYY')}`
      : `${getYr()} (${formatDt(
          getThisYrTilTdy(),
          'month',
          'DD-MM-YYYY ~ DD-MM-YYYY',
          'DD-MM-YYYY'
        )})`;

  const getChartTitle = ['month', 'week'].includes(salesDateRange)
    ? 'Day'
    : salesDateRange === 'day'
    ? 'Hour'
    : 'Month';

  return (
    <MainCard>
      <Space direction='vertical' size={5} className='full-width'>
        <Row justify='space-between'>
          <Col>
            <BoldTitle level={5}>Sales</BoldTitle>
          </Col>
          <Col>
            <MoreButton route='bizStatistics' />
          </Col>
        </Row>

        <Row justify='space-between'>
          <Col>
            <Text className='dashboard-grey-text'>{getSalesDate}</Text>
          </Col>
          <Col>
            <Radio.Group
              buttonStyle='solid'
              size='large'
              style={{ marginRight: 30 }}
              onChange={(e) => {
                setSalesDateRange(e.target.value);
              }}
              value={salesDateRange}
              options={dateRangeOptions}
              optionType='button'
            ></Radio.Group>
          </Col>
        </Row>
        <Row style={{ paddingTop: 15 }}>
          <Suspense fallback={<LoadChart />}>
            {loading ? (
              <LoadChart />
            ) : data.length > 0 ? (
              <Space direction='vertical' className='full-width' size={20}>
                <Text strong type='secondary'>
                  RM
                </Text>
                <LineChart
                  data={data}
                  titleX={getChartTitle}
                  tooltipName='Total Sales'
                  tooltipValPrefix='RM '
                  toFixed={2}
                />
              </Space>
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
        </Row>
      </Space>
    </MainCard>
  );
};

export default Sales;
