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
import custList from './custList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import {
  ActivateButton,
  SuspendButton,
} from '@/components/Button/ActionButton';
import StatusTag from '@/components/Tag/StatusTag';
import { custStatList } from '@/utils/optionUtils';
import { BoldTitle } from '@/components/Title';

const CustMgmt = () => {
  const { Text } = Typography;
  const [custListFltr, setCustListFltr] = useState(custList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setCustListFltr(
        custList.filter((cust) =>
          searchParams.get('stat') !== null
            ? cust.custType === searchParams.get('stat')
            : true
        )
      ),
    [searchParams]
  );

  const custTabList = [
    { key: 'all', tab: 'All' },
    { key: 'cust', tab: 'Direct Customer' },
    { key: 'agent', tab: 'Agent' },
    { key: 'drpshpr', tab: 'Dropshipper' },
  ];

  const activateBtn = (props: any) => <ActivateButton type='primary' />;

  const suspendBtn = (props: any) => <SuspendButton type='primary' />;

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: activateBtn,
      key: 'activate',
      fltr: [{ fld: 'status', value: 'suspended', rel: 'eq' }],
    },
    {
      element: suspendBtn,
      key: 'suspend',
      fltr: [{ fld: 'status', value: 'active', rel: 'eq' }],
    },
  ];

  const custMgmtColumns: {
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
      title: 'Customer ID',
      dataIndex: 'custID',
      key: 'custID',
      sorter: true,
      fixed: 'left',
      width: 150,
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
            : 'Unknown'}
        </Text>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'regDt',
      key: 'regDt',
      sorter: true,
      width: 160,
    },
    {
      title: 'Sales per Month',
      dataIndex: 'salesMth',
      key: 'salesMth',
      sorter: true,
      width: 160,
      render: (amount: number) =>
        amount !== undefined ? (
          <Text strong>{moneyFormatter(amount)}</Text>
        ) : (
          '-'
        ),
    },
    {
      title: 'Last Order Date',
      dataIndex: 'lastOrderDt',
      key: 'lastOrderDt',
      sorter: true,
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 130,
      render: (status: string) => (
        <StatusTag status={status} statusList={custStatList} minWidth='90%' />
      ),
    },
    {
      title: 'Action',
      dataIndex: ['custType', 'status'],
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_: any, data: { [x: string]: string }) =>
        data['custType'] === 'cust' ? (
          '-'
        ) : data['status'] === 'suspended' ? (
          <ActivateButton type='link' color='info' />
        ) : (
          <SuspendButton type='link' color='info' />
        ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='cust-mgmt'>
        <MainCard
          tabList={custTabList}
          activeTabKey={
            searchParams.get('stat') === null ? 'all' : searchParams.get('stat')
          }
          onTabChange={(key) => {
            setSearchParams(key !== 'all' ? { stat: key } : {});
          }}
        >
          <FilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={15} className='full-width'>
            <Row justify='space-between'>
              <Col>
                <BoldTitle level={4}>Customer List</BoldTitle>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('custAdd'))}
                >
                  Add Customer
                </Button>
              </Col>
            </Row>
            <InformativeTable
              dataSource={custListFltr}
              columns={custMgmtColumns}
              buttons={onSelectBtn}
              scroll={{ x: 1200 }}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default CustMgmt;