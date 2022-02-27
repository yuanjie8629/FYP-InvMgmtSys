import { GradeIcon } from '../Icons';
import NasiBriyaniBukhari from '@assets/Product/NasiBukhari.png';
import hashtag from '@assets/Login/Hashtag.svg';
import { Col, Row, Image, Space, Typography } from 'antd';
import { moneyFormatter, percentFormatter } from '@/utils/numUtils';
import { GradeIconProps } from '../Icons/GradeIcon';
import { tableGradeProps } from '.';

const { Text } = Typography;

const GradeH = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='H' className='bg-green-400' {...props} />
);
const GradeM = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='M' className='bg-blue-400' {...props} />
);
const GradeL = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='L' className='bg-red-400' {...props} />
);

const hmlDesc = {
  header: 'HML analysis grades the products based on sales per month.',
  content: [
    {
      key: 'gradeH',
      title: 'Grade H',
      desc: 'Grade H products make up 75% of the total unit price ratio. These products are costly. Make sure you have strict control on these high-unit-value products.',
      icon: <GradeH />,
    },
    {
      key: 'gradeM',
      title: 'Grade M',
      desc: 'Grade M products make up 15% of the total unit price ratio. These products do not cost too much. Moderate control on these products is sufficient.',
      icon: <GradeM />,
    },
    {
      key: 'gradeL',
      title: 'Grade L',
      desc: 'Grade L products make up 10% of the total unit price ratio. These products are low in unit price. Less control is required for the products.',
      icon: <GradeL />,
    },
  ],
};

const hmlColumns: {
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
    title: 'Stock',
    dataIndex: 'prodStock',
    key: 'prodStock',
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
    title: 'Cost per Unit (%)',
    dataIndex: 'costPerUnitPct',
    key: 'costPerUnitPct',
    sorter: true,
    width: 120,
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
    render: (grade: 'h' | 'm' | 'l') => {
      return (
        <div className='center-flex'>
          {grade === 'h' ? (
            <GradeH {...tableGradeProps} />
          ) : grade === 'm' ? (
            <GradeM {...tableGradeProps} />
          ) : (
            <GradeL {...tableGradeProps} />
          )}
        </div>
      );
    },
  },
];

const hmlData = [
  {
    key: '1',
    prodNm: 'Nasi Briyani Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: NasiBriyaniBukhari,
    prodStock: 47,
    costPerUnit: 17.6,
    costPerUnitPct: 0.3333,
    grade: 'h',
  },
  {
    key: '2',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: hashtag,
    prodStock: 120,
    costPerUnit: 17.6,
    costPerUnitPct: 0.3333,
    grade: 'm',
  },
  {
    key: '3',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: NasiBriyaniBukhari,
    prodStock: 25,
    costPerUnit: 20.8,
    costPerUnitPct: 0.3333,
    grade: 'l',
  },
];

const hmlAnalysis = {
  desc: hmlDesc,
  columns: hmlColumns,
  data: hmlData,
};

export default hmlAnalysis;
