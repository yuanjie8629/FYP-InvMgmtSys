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
import voucherList from './voucherList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { MdAllInclusive, MdSync } from 'react-icons/md';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import { sortByOrder } from '@utils/sortUtils';
import {
  ActivateButton,
  DeleteButton,
  EditButton,
  HideButton,
} from '@/components/Button/ActionButton';
import StatusTag from '@/components/Tag/StatusTag';
import { voucherStatList } from '@/utils/optionUtils';
import Tooltip from '@/components/Tooltip';

const VoucherMgmt = () => {
  const { Text, Title } = Typography;
  const [voucherListFltr, setVoucherListFltr] = useState(voucherList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setVoucherListFltr(
        voucherList.filter((voucher) =>
          searchParams.get('stat') !== null
            ? voucher.status === searchParams.get('stat')
            : true
        )
      ),
    [searchParams]
  );
  const voucherTabList = [
    { key: 'all', tab: 'All' },
    { key: 'active', tab: 'Active' },
    { key: 'hidden', tab: 'Hidden' },
    { key: 'scheduled', tab: 'Scheduled' },
    { key: 'expired', tab: 'Expired' },
  ];

  const activateBtn = (props: any) => <ActivateButton type='primary' />;

  const hideBtn = (props: any) => <HideButton type='primary' color='grey' />;

  const deleteBtn = (props: any) => (
    <DeleteButton type='primary' color='error' />
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: activateBtn,
      key: 'activate',
      fltr: [{ fld: 'status', value: 'hidden', rel: 'eq' }],
    },
    {
      element: hideBtn,
      key: 'hide',
      fltr: [{ fld: 'status', value: 'active', rel: 'eq' }],
    },
    {
      element: deleteBtn,
      key: 'delete',
    },
  ];

  const voucherMgmtColumns: {
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
      title: 'Voucher Code',
      dataIndex: ['voucherCde', 'autoApply'],
      key: 'voucherCde',
      sorter: true,
      fixed: 'left',
      width: 150,
      render: (_: any, data: { [x: string]: boolean }) => (
        <Row>
          <Col span={20} className='text-button-wrapper'>
            <Text strong className='text-button'>
              {data['voucherCde']}
            </Text>
          </Col>
          <Col span={4} className='justify-end'>
            {data['autoApply'] === true ? (
              <Tooltip title='Automatically applied'>
                <MdSync />
              </Tooltip>
            ) : null}
          </Col>
        </Row>
      ),
    },
    {
      title: 'Discount Details',
      dataIndex: ['discType', 'discAmt', 'minSpend', 'maxDisc', 'usageLimit'],
      key: 'discDetl',
      sorter: true,
      width: 280,
      render: (_: any, data) => (
        <>
          <Text strong type='secondary'>
            {data['discType'] === 'amount'
              ? moneyFormatter(data['discAmt'])
              : percentFormatter(data['discAmt'])}{' '}
            off
          </Text>
          <ul>
            {data['minSpend'] !== undefined ? (
              <li>Min spend of {moneyFormatter(data['minSpend'])}</li>
            ) : null}
            {data['maxDisc'] !== undefined ? (
              <li>Capped at {moneyFormatter(data['maxDisc'])}</li>
            ) : null}
            {data['usageLimit'] !== undefined ? (
              <li>Limit for {data['usageLimit']} transactions per user</li>
            ) : null}
          </ul>
        </>
      ),
    },
    {
      title: 'Customer Type',
      dataIndex: 'custType',
      key: 'custType',
      sorter: true,
      width: 150,
      render: (types: []) => (
        <Space direction='vertical'>
          {sortByOrder(types).map((type: string) => (
            <Text type='secondary'>
              {type === 'agent'
                ? 'Agent'
                : type === 'drpshpr'
                ? 'Dropshipper'
                : type === 'cust'
                ? 'Direct Customer'
                : null}
            </Text>
          ))}
        </Space>
      ),
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
      sorter: true,
      width: 100,
      render: (availability: string) =>
        availability === 'unlimited' ? (
          <Tooltip title='Unlimited'>
            <MdAllInclusive />
          </Tooltip>
        ) : (
          availability
        ),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTm',
      key: 'startTm',
      sorter: true,
      width: 150,
    },
    {
      title: 'End Time',
      dataIndex: 'endTm',
      key: 'endTm',
      sorter: true,
      width: 150,
      render: (endTm: string) => (endTm !== undefined ? endTm : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <StatusTag
          status={status}
          statusList={voucherStatList}
          dropdownStatus={['active', 'hidden']}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_: any, data: { [x: string]: string }) => (
        <Space direction='vertical' size={5}>
          <EditButton type='link' color='info' />
          <DeleteButton type='link' color='info' />
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='voucher-mgmt'>
        <MainCard
          tabList={voucherTabList}
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
                <Title level={4}>Voucher List</Title>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('voucherAdd'))}
                >
                  Create Voucher
                </Button>
              </Col>
            </Row>
            <InformativeTable
              dataSource={voucherListFltr}
              columns={voucherMgmtColumns}
              buttons={onSelectBtn}
              scroll={{ x: 1200 }}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default VoucherMgmt;
