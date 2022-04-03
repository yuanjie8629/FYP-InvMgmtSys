import React from 'react';
import { Datum, Line, LineConfig } from '@ant-design/charts';
import keyMetricsList from '@pages/BusinessInsights/BusinessStatistics/KeyMetricsDashboard/keyMetricsList';

export interface LineChartProps extends LineConfig {
  data: any;
  titleX?: string;
  titleY?: string;
  tooltipName?: string;
  tooltipTitlePrefix?: string;
  tooltipTitleSuffix?: string;
  tooltipValPrefix?: string;
  tooltipValSuffix?: string;
  toFixed?: number;
  ratioData?: any;
}

const LineChart = ({
  data,
  titleX = '',
  titleY = '',
  tooltipName,
  tooltipTitlePrefix = '',
  tooltipTitleSuffix = '',
  tooltipValPrefix = '',
  tooltipValSuffix = '',
  toFixed = 0,
  ratioData,
  ...props
}: LineChartProps) => {
  const config = {
    appendPadding: 5,
    data: ratioData
      ? data.map((datum) => {
          let total =
            ratioData[
              keyMetricsList.find((metrics) => metrics.label === datum.category)
                ?.key
            ];

          let newValue = datum.value;
          if (datum.value !== null && total !== 0) {
            newValue = datum.value / total;
          }
          return {
            ...datum,
            value: newValue,
          };
        })
      : data,
    meta: {
      value: {
        nice: true,
      },
    },
    xField: Object.keys(data[0])[0],
    yField: Object.keys(data[0])[1],
    xAxis: {
      title:
        titleX === ''
          ? null
          : {
              text: titleX,
              style: {
                fontSize: 14,
                fontWeight: 600,
              },
            },
    },
    yAxis: {
      title:
        titleY === ''
          ? null
          : {
              text: titleY,
              style: {
                fontSize: 14,
                fontWeight: 600,
              },
            },
    },
    smooth: true,
    legend: { position: 'bottom' },
    lineStyle: {
      stroke: props.seriesField === undefined ? '#0e9f6e' : undefined,
      lineWidth: 4,
    },
    color: ['#0e9f6e', '#138bd0', '#f05252', '#ffc107', '#ff6f00'],

    tooltip: {
      fields: Object.keys(data[0]).map((key) => key),
      customItems: (originalItems) => {
        return originalItems[0].data.value === null ? null : originalItems;
      },
      formatter: (datum: Datum) => {
        let matchedMetrics = keyMetricsList.find(
          (metrics) => metrics.label === datum?.category
        );
        return {
          title:
            tooltipTitlePrefix +
            datum[Object.keys(data[0])[0]] +
            tooltipTitleSuffix,
          name: tooltipName !== undefined ? tooltipName : datum?.category,
          value:
            datum[Object.keys(data[0])[1]] !== null
              ? (tooltipValPrefix || matchedMetrics?.cat === 'money'
                  ? 'RM '
                  : '') +
                (ratioData
                  ? (
                      datum[Object.keys(data[0])[1]] *
                      ratioData[matchedMetrics?.key]
                    )?.toFixed(matchedMetrics?.toFixed || toFixed)
                  : datum[Object.keys(data[0])[1]]?.toFixed(
                      matchedMetrics?.toFixed || toFixed
                    )) +
                (tooltipValSuffix || matchedMetrics?.cat === 'percent'
                  ? '%'
                  : '')
              : 'Invalid',
        };
      },
    },
    interactions: [{ type: 'legend-filter', enable: false }],
    theme: {
      defaultColor: '#0e9f6e',
      styleSheet: { backgroundColor: 'white' },
    },
  };

  return (
    //@ts-ignore
    <Line {...config} {...props} />
  );
};

export default LineChart;
