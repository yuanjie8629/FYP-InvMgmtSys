import { moneyFormatter } from '@utils/numUtils';
import { Col, Row, Image, Typography, Space } from 'antd';
import { DescIcon } from '../Icons';
import hashtag from '@assets/Login/Hashtag.svg';
import { EditButton } from '@components/Button/ActionButton';
import { HiExclamation } from 'react-icons/hi';
import Popover from '@components/Popover';

const { Text } = Typography;

const eoqDesc = {
  header: 'EOQ analysis evaluates the products based on sales per month.',
  content: [
    {
      key: 'info',
      title: 'Info',
      desc: 'EOQ stands for Economic Order Quantity. It is the ideal order quantity a company should purchase to minimize inventory costs.',
      icon: <DescIcon type='info' />,
    },
    {
      key: 'purpose',
      title: 'Purpose',
      desc: 'The purpose of EOQ analysis to minimise the ordering and carrying costs incurred in inventory.',
      icon: <DescIcon type='purpose' />,
    },
    {
      key: 'benefits',
      title: 'Benefits',
      desc: 'By using EOQ analysis, we can identify the optimum amount of items to be ordered.',
      icon: <DescIcon type='benefits' />,
    },
  ],
};

const eoqComponent = {
  header: 'Components of EOQ Analysis',
  content: [
    {
      key: 'orderCost',
      label: 'Ordering/Reorder Cost',
      desc: 'Cost when reordering the product',
      prodList: ['Sambal Ikan Bilis', 'Pes Mi Goreng'],
    },
    {
      key: 'carryCost',
      label: 'Carrying/Holding Cost',
      desc: 'Cost for holding inventory in stock',
      prodList: [],
    },
  ],
};

const eoqColumns: {
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
    title: 'Demand',
    dataIndex: 'demand',
    key: 'demand',
    sorter: true,
    width: 100,
  },
  {
    title: 'Ordering Cost',
    dataIndex: 'orderCost',
    key: 'orderCost',
    sorter: true,
    width: 120,
    render: (amount: number) =>
      amount !== undefined ? (
        <Text type='secondary'>{moneyFormatter(amount)}</Text>
      ) : (
        <Popover content='Please update the holding cost for this product.'>
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
    title: 'Holding Cost',
    dataIndex: 'carryCost',
    key: 'carryCost',
    sorter: true,
    width: 120,
    render: (amount: number) =>
      amount !== undefined ? (
        <Text type='secondary'>{moneyFormatter(amount)}</Text>
      ) : (
        <Popover content='Please update the holding cost for this product.'>
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
    title: 'Optimal Order Quantity',
    dataIndex: 'ooq',
    key: 'ooq',
    sorter: true,
    width: 170,
    fixed: 'right',
    render: (amount: number) =>
      amount !== undefined ? (
        <Text type='secondary'>{moneyFormatter(amount)}</Text>
      ) : (
        <Popover content='Please fill up the ordering and holding costs.'>
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
        Edit Costs
      </EditButton>
    ),
  },
];

const eoqData = [
  {
    key: '1',
    prodNm: 'Nasi Briyani Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    demand: 30,
    orderCost: 550,
  },
  {
    key: '2',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    prodImg: hashtag,
    costPerUnit: 17.6,
    demand: 70,
    carryCost: 155,
  },
  {
    key: '3',
    prodNm: 'Nasi Bukhari',
    prodCat: 'Ready-To-Cook',
    prodSKU: 'SHRF-RTC-NBB',
    costPerUnit: 20.8,
    demand: 20,
    orderCost: 666,
    carryCost: 329,
    ooq: 169,
  },
];

const eoqAnalysis = {
  desc: eoqDesc,
  component: eoqComponent,
  columns: eoqColumns,
  data: eoqData,
};

export default eoqAnalysis;
