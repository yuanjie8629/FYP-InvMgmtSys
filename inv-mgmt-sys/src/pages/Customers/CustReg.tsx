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
import { HiThumbDown, HiThumbUp } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';

const CustReg = () => {
  const { Text, Title } = Typography;
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

  const acceptBtn = (props: any) => (
    <Button
      type='primary'
      icon={
        <HiThumbUp
          size={16}
          style={{ marginRight: 5, position: 'relative', top: 3 }}
        />
      }
      {...props}
    >
      Accept
    </Button>
  );

  const rejectBtn = (props: any) => (
    <Button
      type='primary'
      color='error'
      icon={
        <HiThumbDown style={{ marginRight: 5, position: 'relative', top: 3 }} />
      }
    >
      Reject
    </Button>
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
          <Button
            type='link'
            icon={
              <HiThumbUp
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 3 }}
              />
            }
          >
            Accept
          </Button>
          <Button
            type='link'
            color='error'
            icon={
              <HiThumbDown
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 2 }}
              />
            }
          >
            Reject
          </Button>
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
                <Title level={4}>Customer List</Title>
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
