import React, { Suspense, useState } from 'react';
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
import { dataYear, dataMonth, dataWeek, dataDay } from './salesData';
import LineChart from '@components/Chart/LineChart';

const Sales = () => {
  const { Text } = Typography;
  const [salesDateRange, setSalesDateRange] = useState('year');

  const getSalesData =
    salesDateRange === 'month'
      ? dataMonth.data
      : salesDateRange === 'week'
      ? dataWeek.data
      : salesDateRange === 'day'
      ? dataDay.data
      : dataYear.data;

  const getSalesDate =
    salesDateRange === 'month'
      ? dataMonth.month
      : salesDateRange === 'week'
      ? dataWeek.frmDate + ' - ' + dataWeek.toDate
      : salesDateRange === 'day'
      ? dataDay.date
      : dataYear.year;

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
              <LineChart
                data={getSalesData}
                titleX={getChartTitle}
                tooltipName='Total Sales'
                tooltipTitlePrefix={getChartTooltipTitlePrefix}
                tooltipTitleSuffix={getChartTooltipTitleSuffix}
                tooltipValPrefix='RM '
                toFixed={2}
              />
            </Space>
          </Suspense>
        </Row>
      </Space>
    </MainCard>
  );
};

export default Sales;
