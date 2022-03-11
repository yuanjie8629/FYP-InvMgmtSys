import { Col, Row, Image, Typography, Space } from 'antd';
import { DescIcon } from '../Icons';
import hashtag from '@assets/Login/Hashtag.svg';
import { EditButton } from '@components/Button/ActionButton';
import { HiExclamation } from 'react-icons/hi';
import Popover from '@components/Popover';

const { Text } = Typography;

const ssDesc = {
  header:
    'Safety Stock analysis evaluates the products based on sales per month.',
  content: [
    {
      key: 'info',
      title: 'Info',
      desc: 'Safety stock is the additional quantity of a product to be stored in the inventory.',
      icon: <DescIcon type='info' />,
    },
    {
      key: 'purpose',
      title: 'Purpose',
      desc: 'The purpose of Safety Stock analysis to prevent an out-of-stock situation. ',
      icon: <DescIcon type='purpose' />,
    },
    {
      key: 'benefits',
      title: 'Benefits',
      desc: 'By using Safety Stock analysis, we can identify the number of reserved stock and reorder point.',
      icon: <DescIcon type='benefits' />,
    },
  ],
};

const ssComponent = {
  header: 'Components of Safety Stock Analysis',
  content: [
    {
      key: 'maxLeadTm',
      label: 'Maximum Lead Time',
      desc: 'Maximum Lead Time',
      prodList: [],
    },
    {
      key: 'AvgLeadTm',
      label: 'Average Lead Time',
      desc: 'Average Lead Time',
      prodList: [],
    },
  ],
};

const ssColumns: {
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
    width: 200,
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
    width: 100,
  },
  {
    title: 'Max Demand',
    dataIndex: 'maxDemand',
    key: 'maxDemand',
    sorter: true,
    width: 100,
    render: (amount: number) => <Text type='secondary'>{amount} / day</Text>,
  },
  {
    title: 'Avg Demand',
    dataIndex: 'avgDemand',
    key: 'avgDemand',
    sorter: true,
    width: 100,
    render: (amount: number) => <Text type='secondary'>{amount} / day</Text>,
  },
  {
    title: 'Max Lead Time',
    dataIndex: 'maxLeadTm',
    key: 'maxLeadTm',
    sorter: true,
    width: 100,
    render: (day: number) =>
      day !== undefined ? (
        <Text type='secondary'>
          {day} {day !== 1 ? 'days' : 'day'}
        </Text>
      ) : (
        <Popover content='Please update the maximum lead time for this product.'>
          <Space size={5}>
            <HiExclamation size={20} className='color-error' />
            <Text strong className='color-error'>
              Not Found
            </Text>
          </Space>
        </Popover>
      ),
  },
  {
    title: 'Avg Lead Time',
    dataIndex: 'avgLeadTm',
    key: 'avgLeadTm',
    sorter: true,
    width: 100,
    render: (day: number) =>
      day !== undefined ? (
        <Text type='secondary'>
          {day} {day !== 1 ? 'days' : 'day'}
        </Text>
      ) : (
        <Popover content='Please update the average lead time for this product.'>
          <Space size={5}>
            <HiExclamation size={20} className='color-error' />
            <Text strong className='color-error'>
              Not Found
            </Text>
          </Space>
        </Popover>
      ),
  },
  {
    title: 'Safety Stock',
    dataIndex: 'safetyStock',
    key: 'safetyStock',
    sorter: true,
    width: 120,
    fixed: 'right',
    render: (amount: number) =>
      amount !== undefined ? (
        <Text type='secondary'>{amount}</Text>
      ) : (
        <Popover content='Please fill up the maximum and average amount for the demand and lead time.'>
          <Space size={5}>
            <HiExclamation size={20} className='color-error' />
            <Text strong className='color-error'>
              Insufficient Info
            </Text>
          </Space>
        </Popover>
      ),
  },
  {
    title: 'Restock Point',
    dataIndex: 'restockPt',
    key: 'restockPt',
    sorter: true,
    width: 120,
    fixed: 'right',
    render: (amount: number) =>
      amount !== undefined ? (
        <Text type='secondary'>{amount}</Text>
      ) : (
        <Popover content='Please fill up the maximum and average amount for the demand and lead time.'>
          <Space size={5}>
            <HiExclamation size={20} className='color-error' />
            <Text strong className='color-error'>
              Insufficient Info
            </Text>
          </Space>
        </Popover>
      ),
  },
  {
    title: 'Action',
    key: 'action',
    width: 100,
    fixed: 'right',
    render: () => (
      <EditButton type='link' color='info'>
        Edit Lead Time
      </EditButton>
    ),
  },
];

const ssData = [
  {
    key: '1',
    prodNm: 'Nasi Briyani Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    maxDemand: 20,
    avgDemand: 15,
    maxLeadTm: 10,
    avgLeadTm: 7,
    safetyStock: 95,
    restockPt: 200,
  },
  {
    key: '2',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: hashtag,
    maxDemand: 25,
    avgDemand: 20,
    maxLeadTm: 12,
    avgLeadTm: 10,
    safetyStock: 100,
    restockPt: 300,
  },
  {
    key: '3',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    maxDemand: 6,
    avgDemand: 5,
    maxLeadTm: 10,
    avgLeadTm: 7,
    safetyStock: 25,
    restockPt: 60,
  },
];

const ssAnalysis = {
  desc: ssDesc,
  component: ssComponent,
  columns: ssColumns,
  tableScroll: 1500,
  data: ssData,
};

export default ssAnalysis;
