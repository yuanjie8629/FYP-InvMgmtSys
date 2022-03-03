import { GradeIcon } from '../Icons';
import NasiBriyaniBukhari from '@assets/Product/NasiBukhari.png';
import hashtag from '@assets/Login/Hashtag.svg';
import { Col, Row, Image, Space, Typography } from 'antd';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import { GradeIconProps } from '../Icons/GradeIcon';
import { tableGradeProps } from '.';

const { Text } = Typography;

const GradeA = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='A' className='bg-green-400' {...props} />
);
const GradeB = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='B' className='bg-blue-400' {...props} />
);
const GradeC = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='C' className='bg-red-400' {...props} />
);

const abcDesc = {
  header: 'ABC analysis grades the products based on sales per month.',
  content: [
    {
      key: 'gradeA',
      title: 'Grade A',
      desc: 'Grade A contribute to 80% of revenue. Make sure to keep enough stocks since these products produce the most revenue.',
      icon: <GradeA />,
    },
    {
      key: 'gradeB',
      title: 'Grade B',
      desc: 'Grade B contribute to 15% of revenue. Do not keep too many stocks on hand since these products produce lower revenue.',
      icon: <GradeB />,
    },
    {
      key: 'gradeC',
      title: 'Grade C',
      desc: 'Grade C contribute to 5% of revenue. These products are low in demand. Consider ways to promote these products.',
      icon: <GradeC />,
    },
  ],
};

const abcColumns: {
  title: string;
  dataIndex?: string | string[];
  key: string;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  fixed?: 'left' | 'right';
  render?: any;
}[] = [
  {
    title: 'Product',
    dataIndex: ['prodNm', 'prodCat', 'prodImg'],
    key: 'prod',
    sorter: true,
    width: 250,
    fixed: 'left',
    render: (_: any, data: { [x: string]: string }) => (
      <Row gutter={5}>
        <Col span={8}>
          <Image src={data['prodImg']} height={80} width={80} />
        </Col>
        <Col span={16}>
          <Space direction='vertical' size={5}>
            <div className='text-button-wrapper'>
              <Text strong className='text-button'>
                {data['prodNm']}
              </Text>
            </div>
            <Text type='secondary' className='text-sm text-break'>
              {data['prodCat']}
            </Text>
          </Space>
        </Col>
      </Row>
    ),
  },
  {
    title: 'SKU',
    dataIndex: 'prodSKU',
    key: 'prodSKU',
    sorter: true,
    width: 120,
  },
  {
    title: 'Cost per Unit',
    dataIndex: 'costPerUnit',
    key: 'costPerUnit',
    sorter: true,
    width: 120,
    render: (amount: number) => (
      <Text type='secondary'>{moneyFormatter(amount)}</Text>
    ),
  },
  {
    title: 'Demand',
    dataIndex: 'demand',
    key: 'demand',
    sorter: true,
    width: 100,
  },
  {
    title: 'Consumption Value',
    dataIndex: 'consumpVal',
    key: 'consumpVal',
    sorter: true,
    width: 160,
    render: (amount: number) => (
      <Text type='secondary'>{moneyFormatter(amount)}</Text>
    ),
  },
  {
    title: 'Demand (%)',
    dataIndex: 'demandPct',
    key: 'demandPct',
    sorter: true,
    width: 120,
    render: (amount: number) => (
      <Text type='secondary'>{percentFormatter(amount)}</Text>
    ),
  },
  {
    title: 'Consumption Value (%)',
    dataIndex: 'consumpValPct',
    key: 'consumpValPct',
    sorter: true,
    width: 180,
    render: (amount: number) => (
      <Text type='secondary'>{percentFormatter(amount)}</Text>
    ),
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade',
    sorter: true,
    width: 100,
    align: 'center' as const,
    fixed: 'right',
    render: (grade: 'a' | 'b' | 'c') => {
      return (
        <div className='center-flex'>
          {grade === 'a' ? (
            <GradeA {...tableGradeProps} />
          ) : grade === 'b' ? (
            <GradeB {...tableGradeProps} />
          ) : (
            <GradeC {...tableGradeProps} />
          )}
        </div>
      );
    },
  },
];

const abcData = [
  {
    key: '1',
    prodNm: 'Nasi Briyani Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: NasiBriyaniBukhari,
    costPerUnit: 17.6,
    demand: 30,
    demandPct: 0.1395,
    consumpVal: 528,
    consumpValPct: 0.2834,
    grade: 'a',
  },
  {
    key: '2',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: hashtag,
    costPerUnit: 17.6,
    demand: 70,
    demandPct: 0.3256,
    consumpVal: 455,
    consumpValPct: 0.2442,
    grade: 'b',
  },
  {
    key: '3',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: NasiBriyaniBukhari,
    costPerUnit: 20.8,
    demand: 20,
    demandPct: 0.093,
    consumpVal: 416,
    consumpValPct: 0.2233,
    grade: 'b',
  },
];

const abcAnalysis = {
  desc: abcDesc,
  columns: abcColumns,
  tableScroll: 1300,
  data: abcData,
};

export default abcAnalysis;
