import React from 'react';
import { Datum, Line, LineConfig } from '@ant-design/charts';

interface LineChartProps extends LineConfig {
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
  toFixed = 0,
  titleX = '',
  titleY = '',
  tooltipName = titleY !== '' ? titleY : 'value',
  tooltipTitlePrefix = '',
  tooltipTitleSuffix = '',
  tooltipValPrefix = '',
  tooltipValSuffix = '',
  ...props
}: LineChartProps) => {
  const config = {
    data: props.data,
    xField: Object.keys(props.data[0])[0],
    yField: Object.keys(props.data[0])[1],
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
      fields: [Object.keys(props.data[0])[0], Object.keys(props.data[0])[1]],
      formatter: (datum: Datum) => {
        return {
          title:
            tooltipTitlePrefix +
            datum[Object.keys(props.data[0])[0]] +
            tooltipTitleSuffix,
          name: tooltipName,
          value:
            tooltipValPrefix +
            datum[Object.keys(props.data[0])[1]].toFixed(toFixed) +
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
