import React from 'react';
import { Datum, Line, LineConfig } from '@ant-design/charts';

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
}
const LineChart = ({
  data,
  titleX = '',
  titleY = '',
  tooltipName = titleY !== '' ? titleY : 'value',
  tooltipTitlePrefix = '',
  tooltipTitleSuffix = '',
  tooltipValPrefix = '',
  tooltipValSuffix = '',
  toFixed = 0,
  ...props
}: LineChartProps) => {
  const config = {
    data: data,
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
      fields: [Object.keys(data[0])[0], Object.keys(data[0])[1]],
      formatter: (datum: Datum) => {
        return {
          title:
            tooltipTitlePrefix +
            datum[Object.keys(data[0])[0]] +
            tooltipTitleSuffix,
          name: tooltipName,
          value:
            tooltipValPrefix +
            datum[Object.keys(data[0])[1]].toFixed(toFixed) +
            tooltipValSuffix,
        };
      },
    },
    interactions: [{ type: 'legend-filter', enable: false }],
    theme: { defaultColor: '#0e9f6e' },
  };

  return (
    //@ts-ignore
    <Line {...config} {...props} />
  );
};

export default LineChart;
