import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import orderList from './orderList';
import { HiExclamation } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import orderTabList from './orderTabList';
import { orderStatList } from '@utils/optionUtils';
import { BulkEditButton, PrintButton } from '@components/Button/ActionButton';
import UpdButton from '@components/Button/ActionButton/UpdButton';
import StatusTag from '@components/Tag/StatusTag';
import Popover from '@components/Popover';
import { BoldTitle } from '@components/Title';

const OrderMgmt = () => {
  const { Text } = Typography;
  const [orderListFltr, setOrderListFltr] = useState(orderList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setOrderListFltr(
        orderList.filter((order) =>
          searchParams.get('status') !== null
            ? order.orderStat === searchParams.get('status')
            : true
        )
      ),
    [searchParams]
  );

  const genInvoiceBtn = (props: any) => (
    <PrintButton type='primary'>Generate Invoice(s)</PrintButton>
  );

  const bulkUpdBtn = (props: any) => <BulkEditButton />;

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
          <Popover content='Please update the tracking number'>
            <Space size={5}>
              <HiExclamation size={20} className='color-warning' />
              <Text strong className='color-warning'>
                Not found
              </Text>
            </Space>
          </Popover>
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
      render: (status: string) => (
        <StatusTag status={status} statusList={orderStatList} minWidth='90%' />
      ),
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
            <PrintButton type='link' color='info' />
            <UpdButton type='link' color='info' />
          </Space>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='order-mgmt'>
        <MainCard
          tabList={orderTabList}
          activeTabKey={
            searchParams.get('status') === null
              ? 'all'
              : searchParams.get('status')
          }
          onTabChange={(key) => {
            setSearchParams(key !== 'all' ? { status: key } : {});
          }}
        >
          <FilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={40} className='full-width'>
            <Space direction='vertical' size={15} className='full-width'>
              <Row justify='space-between'>
                <Col>
                  <BoldTitle level={4}>Order List</BoldTitle>
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
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default OrderMgmt;
