import React, { useEffect, useState } from 'react';
import ContainerCard from '@components/Card/ContainerCard';
import Button from '@components/Button';
import Layout from '@components/Layout/Layout';
import Tag, { TagProps } from '@components/Tag';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import orderList from './orderList';
import { ReactComponent as BulkEditIcon } from '@assets/Icons/BulkEditIcon.svg';
import { HiExclamation, HiPrinter } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { MdUpdate } from 'react-icons/md';
import orderTabList from './orderTabList';
import { orderStatList } from '@utils/optionUtils';

const OrderMgmt = () => {
  const { Text, Title } = Typography;
  const [orderListFltr, setOrderListFltr] = useState(orderList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setOrderListFltr(
        orderList.filter((order) =>
          searchParams.get('stat') !== null
            ? order.orderStat === searchParams.get('stat')
            : true
        )
      ),
    [searchParams]
  );

  const genInvoiceBtn = (props: any) => (
    <Button
      type='primary'
      icon={
        <HiPrinter
          size={16}
          style={{ marginRight: 5, position: 'relative', top: 3 }}
        />
      }
      {...props}
    >
      Generate Invoice(s)
    </Button>
  );

  const bulkUpdBtn = (props: any) => (
    <Button
      type='primary'
      icon={<BulkEditIcon style={{ marginRight: 5 }} />}
      className='centerFlex'
      {...props}
    >
      Bulk Updates
    </Button>
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: genInvoiceBtn,
      key: 'genInvoice',
    },
    {
      element: bulkUpdBtn,
      key: 'bulkUpd',
      fltr: [
        { fld: 'trackNum', value: undefined, rel: 'eq' },
        { fld: 'orderStat', value: 'cancel', rel: 'neq' },
      ],
    },
  ];

  const orderMgmtColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
      sorter: true,
      fixed: 'left',
      width: 110,
      render: (data: number) => (
        <div className='text-button-wrapper'>
          <Text strong className='text-button'>
            #{data}
          </Text>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'custNm',
      key: 'custNm',
      sorter: true,
      width: 200,
      render: (name: string) => (
        <Text type='secondary' className='text-break'>
          {name}
        </Text>
      ),
    },
    {
      title: 'Customer Type',
      dataIndex: 'custType',
      key: 'custType',
      sorter: true,
      width: 150,
      render: (type: string) => (
        <Text type='secondary'>
          {type === 'agent'
            ? 'Agent'
            : type === 'drpshpr'
            ? 'Dropshipper'
            : type === 'cust'
            ? 'Direct Customer'
            : null}
        </Text>
      ),
    },
    {
      title: 'Order Time',
      dataIndex: 'orderTm',
      key: 'orderTm',
      sorter: true,
      width: 150,
    },
    {
      title: 'Tracking Number',
      dataIndex: ['trackNum', 'orderStat'],
      key: 'trackNum',
      width: 150,
      render: (_: any, data: { [x: string]: string }) =>
        data['trackNum'] !== undefined ? (
          <Button type='link' color='info'>
            #{data['trackNum']}
          </Button>
        ) : data['orderStat'] === 'cancel' ? (
          '-'
        ) : (
          <Space align='center'>
            <HiExclamation size={20} color='#FFC107' />
            <Text type='warning'>Please update the tracking number.</Text>
          </Space>
        ),
    },
    {
      title: 'Amount',
      dataIndex: 'orderAmt',
      key: 'orderAmt',
      sorter: true,
      width: 100,
      render: (amount: number) => <Text strong>{moneyFormatter(amount)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'orderStat',
      key: 'orderStat',
      align: 'center' as const,
      width: 130,
      render: (status: string) => {
        interface OrderStatusTagProps extends TagProps {
          color: string;
          children: React.ReactNode;
        }
        const OrderStatusTag = ({
          color,
          children,
          ...props
        }: OrderStatusTagProps) => (
          <Tag minWidth='80%' maxWidth='100%' color={color} {...props}>
            {children}
          </Tag>
        );

        const matchedStatus = orderStatList.find(
          (statusItem) => status === statusItem.status
        );

        return (
          <OrderStatusTag
            color={matchedStatus !== undefined ? matchedStatus.color : ''}
          >
            {matchedStatus !== undefined ? matchedStatus.label : null}
          </OrderStatusTag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: ['trackNum', 'orderStat'],
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_: any, data: { [x: string]: string }) =>
        data['orderStat'] !== 'cancel' ? (
          <Space direction='vertical' size={5}>
            <Button
              type='link'
              color='info'
              icon={
                <HiPrinter
                  size={16}
                  style={{ marginRight: 5, position: 'relative', top: 3 }}
                />
              }
            >
              Invoice
            </Button>
            <Button
              type='link'
              color='info'
              icon={
                <MdUpdate
                  size={16}
                  style={{ marginRight: 5, position: 'relative', top: 3 }}
                />
              }
            >
              Update
            </Button>
          </Space>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <Layout>
      <div className='order-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard
              tabList={orderTabList}
              activeTabKey={
                searchParams.get('stat') === null
                  ? 'all'
                  : searchParams.get('stat')
              }
              onTabChange={(key) => {
                setSearchParams(key !== 'all' ? { stat: key } : {});
              }}
            >
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Order List</Title>
                    </Col>
                    <Col>
                      <Button
                        type='primary'
                        onClick={() => navigate(findRoutePath('orderAdd'))}
                      >
                        Add Order
                      </Button>
                    </Col>
                  </Row>
                  <InformativeTable
                    dataSource={orderListFltr}
                    columns={orderMgmtColumns}
                    buttons={onSelectBtn}
                    scroll={{ x: 1100 }}
                  />
                </Space>
              </Space>
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default OrderMgmt;
