import React, { useState } from 'react';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Button from '@components/Button/Button';
import Layout from '@components/Layout/Layout';
import Tag, { TagProps } from '@components/Tag/Tag';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, { InformativeTableButtonProps } from '@components/Table/InformativeTable';
import orderList from './orderList';
import { ReactComponent as BulkEditIcon } from '@assets/Icons/BulkEditIcon.svg';
import {
  HiDocumentSearch,
  HiExclamation,
  HiPencilAlt,
  HiPrinter,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';

const OrderMgmt = () => {
  const { Text, Title } = Typography;
  let navigate = useNavigate();

  const [orderListFltr, setOrderListFltr] = useState(orderList);
  const orderTabList = [
    { key: 'all', tab: 'All' },
    { key: 'unpaid', tab: 'Unpaid' },
    { key: 'toShip', tab: 'To Ship' },
    { key: 'shipping', tab: 'Shipping' },
    { key: 'completed', tab: 'Completed' },
    { key: 'cancel', tab: 'Cancellation' },
  ];

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
        { fld: 'trackNum', val: undefined, rel: 'eq' },
        { fld: 'orderStat', val: 'cancel', rel: 'neq' },
      ],
    },
  ];

  const orderMgmtColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
      sorter: true,
      render: (data: number) => (
        <Button type='link' color='info'>
          #{data}
        </Button>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'custNm',
      key: 'custNm',
      sorter: true,
    },
    {
      title: 'Customer Type',
      dataIndex: 'custType',
      key: 'custType',
      sorter: true,
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
    },
    {
      title: 'Tracking Number',
      dataIndex: ['trackNum', 'orderStat'],
      key: 'trackNum',
      width: '12%',
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
      render: (amount: string) => (
        <Text strong>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'orderStat',
      key: 'orderStat',
      render: (status: string) => {
        const statusList = [
          { status: 'completed', label: 'Completed', color: 'success' },
          { status: 'cancel', label: 'Cancelled', color: 'error' },
          { status: 'unpaid', label: 'Unpaid', color: 'error' },
          { status: 'toShip', label: 'To Ship', color: 'warning' },
          { status: 'shipping', label: 'Shipping', color: 'processing' },
        ];

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

        const matchedStatus = statusList.find(
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
            {data['trackNum'] === undefined ? (
              <Button
                type='link'
                color='info'
                icon={
                  <HiPencilAlt
                    size={16}
                    style={{ marginRight: 5, position: 'relative', top: 3 }}
                  />
                }
              >
                Update
              </Button>
            ) : (
              <Button
                type='link'
                color='info'
                icon={
                  <HiDocumentSearch
                    size={16}
                    style={{ marginRight: 5, position: 'relative', top: 3 }}
                  />
                }
              >
                Track
              </Button>
            )}
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
              onTabChange={(key) =>
                setOrderListFltr(
                  orderList.filter((order) =>
                    key !== 'all' ? order.orderStat === key : true
                  )
                )
              }
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
