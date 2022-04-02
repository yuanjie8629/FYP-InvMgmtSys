import React, { Suspense, useEffect, useState } from 'react';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import { LoadingOutlined } from '@ant-design/icons';
import './Dashboard.less';
import { BoldTitle } from '@components/Title';
import { Radio, Spin } from 'antd';
import MainCard from '@components/Card/MainCard';
import MoreButton from '@components/Button/ActionButton/MoreButton';
import { dateRangeOptions } from '@utils/optionUtils';
import LineChart from '@components/Chart/LineChart';
import {
  formatDt,
  getDt,
  getThisMthTilYtd,
  getThisMthYr,
  getThisWeekTilYtd,
  getThisYrTilYtd,
  getWeekOfYear,
  getYr,
} from '@utils/dateUtils';
import { keyMetricsAPI, KeyMetricsDateType } from '@api/services/analysisAPI';
import { useContext } from 'react';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';

const Sales = () => {
  const { Text } = Typography;
  const [salesDateRange, setSalesDateRange] = useState('year');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    setLoading(true);
    let isMounted = true;
    let fromDate = '';
    let toDate = '';
    let salesDateType: KeyMetricsDateType;
    if (salesDateRange === 'month') {
      salesDateType = 'month';
      let date = getThisMthTilYtd().split(' ~ ');
      fromDate = date[0];
      toDate = date[1];
    } else if (salesDateRange === 'week') {
      salesDateType = 'day';
      let date = getThisWeekTilYtd().split(' ~ ');
      fromDate = date[0];
      toDate = date[1];
    } else if (salesDateRange === 'day') {
      salesDateType = 'hour';
      fromDate = getDt();
      toDate = getDt();
    } else {
      salesDateType = 'month';
      let date = getThisYrTilYtd().split(' ~ ');
      fromDate = date[0];
      toDate = date[1];
    }

    keyMetricsAPI({
      fromDate: fromDate,
      toDate: toDate,
      key: 'sales',
      dateType: salesDateType,
    })
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
  }, [salesDateRange]);

  const parseData = () => {
    let newData = [];
    Object.keys(data).forEach((key) => {
      if (key !== 'range') {
        
        data[key].forEach((datum) => {
          console.log(datum);
        });
      }
    });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const getSalesDate =
    salesDateRange === 'month'
      ? `${getThisMthYr()} (${formatDt(
          getThisMthTilYtd(),
          'byMonth',
          'DD-MM-YYYY ~ DD-MM-YYYY',
          'DD-MM-YYYY'
        )})`
      : salesDateRange === 'week'
      ? `${getWeekOfYear()} (${formatDt(
          getThisWeekTilYtd(),
          'byWeek',
          'DD-MM-YYYY ~ DD-MM-YYYY',
          'DD-MM-YYYY'
        )})`
      : salesDateRange === 'day'
      ? `${formatDt(getDt(), 'byDay', 'DD-MM-YYYY', 'DD MMMM YYYY')}`
      : `${getYr()} (${formatDt(
          getThisYrTilYtd(),
          'byMonth',
          'DD-MM-YYYY ~ DD-MM-YYYY',
          'DD-MM-YYYY'
        )})`;

  const getChartTitle = ['month', 'week'].includes(salesDateRange)
    ? 'Day'
    : salesDateRange === 'day'
    ? 'Hour'
    : 'Month';

  const getChartTooltipTitlePrefix = salesDateRange === 'month' ? 'Day ' : '';

  const getChartTooltipTitleSuffix = salesDateRange === 'day' ? ':00' : '';

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
                parseData();
              }}
              value={salesDateRange}
              options={dateRangeOptions}
              optionType='button'
            ></Radio.Group>
          </Col>
        </Row>
        <Row style={{ paddingTop: 15 }}>
          <Suspense
            fallback={
              <div className='center-flex full-height full-width'>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                />
              </div>
            }
          >
            <Space direction='vertical' className='full-width' size={20}>
              <Text strong type='secondary'>
                RM
              </Text>
              {/* <LineChart
                data={[]}
                titleX={getChartTitle}
                tooltipName='Total Sales'
                tooltipTitlePrefix={getChartTooltipTitlePrefix}
                tooltipTitleSuffix={getChartTooltipTitleSuffix}
                tooltipValPrefix='RM '
                toFixed={2}
              /> */}
            </Space>
          </Suspense>
        </Row>
      </Space>
    </MainCard>
  );
};

export default Sales;
