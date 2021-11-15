import React from 'react';
import { Datum, Line } from '@ant-design/charts';

const LineChart = () => {
  const data = [
    { Month: 'Jan', Sales: 4000 },
    { Month: 'Feb', Sales: 4500 },
    { Month: 'Mar', Sales: 5500 },
    { Month: 'Apr', Sales: 4300 },
    { Month: 'May', Sales: 4100 },
    { Month: 'Jun', Sales: 6000 },
    { Month: 'July', Sales: 4700 },
    { Month: 'Aug', Sales: 4200 },
    { Month: 'Sep', Sales: 6100 },
    { Month: 'Oct', Sales: 5030 },
    { Month: 'Nov', Sales: 4954 },
    { Month: 'Dec', Sales: 5310 },
  ];
  const config = {
    data,
    height: 400,
    xField: 'Month',
    yField: 'Sales',
    smooth: true,
    lineStyle: {
      stroke: '#0e9f6e',
      lineWidth: 4,
    },
    color: '#0e9f6e',
    tooltip: {
      fields: ['Month', 'Sales'],
      formatter: (datum: Datum) => {
        return { name: 'Total Sales', value: 'RM' + datum.Sales.toFixed(2) };
      },
    },
  };
  return <Line {...config} />;
};

export default LineChart;
