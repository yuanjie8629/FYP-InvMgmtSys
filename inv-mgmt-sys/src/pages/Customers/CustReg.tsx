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
import custRegList from './custRegList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { AcceptButton, RejectButton } from '@/components/Button/ActionButton';
import { BoldTitle } from '@/components/Title';

const CustReg = () => {
  const { Text } = Typography;
  const [custListFltr, setCustListFltr] = useState(custRegList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setCustListFltr(
        custRegList.filter((cust) =>
          searchParams.get('stat') !== null
            ? cust.custType === searchParams.get('stat')
            : true
        )
      ),
    [searchParams]
  );
  const custTabList = [
    { key: 'all', tab: 'All' },
    { key: 'agent', tab: 'Agent' },
    { key: 'drpshpr', tab: 'Dropshipper' },
  ];

  const acceptBtn = (props: any) => <AcceptButton type='primary' />;

  const rejectBtn = (props: any) => (
    <RejectButton type='primary' />
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: acceptBtn,
      key: 'accept',
    },
    {
      element: rejectBtn,
      key: 'reject',
    },
  ];

  const custRegColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Registration ID',
      dataIndex: 'regID',
      key: 'regID',
      sorter: true,
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
      title: 'Applicant',
      dataIndex: 'applicant',
      key: 'applicant',
      sorter: true,
      width: 300,
    },
    {
      title: 'Register For',
      dataIndex: 'custType',
      key: 'custType',
      sorter: true,
      width: 130,
      render: (type: string) => (
        <Text type='secondary'>
          {type === 'agent'
            ? 'Agent'
            : type === 'drpshpr'
            ? 'Dropshipper'
            : null}
        </Text>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
      width: 100,
      render: (gender: string) => (
        <Text type='secondary'>{gender === 'm' ? 'Male' : 'Female'}</Text>
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
      title: 'Contact Number',
      dataIndex: 'contactNum',
      key: 'contactNum',
      sorter: true,
      width: 160,
    },

    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: () => (
        <Space direction='vertical' size={5}>
          <AcceptButton type='link' />
          <RejectButton type='link'/>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='cust-reg'>
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
              columns={custRegColumns}
              buttons={onSelectBtn}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default CustReg;
