import React, { useState } from 'react';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Button from '@components/Button/Button';
import Layout from '@components/Layout/Layout';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import custRegList from './custRegList';
import { HiThumbDown, HiThumbUp } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';

const CustReg = () => {
  const { Text, Title } = Typography;
  let navigate = useNavigate();

  const [custListFltr, setCustListFltr] = useState(custRegList);
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
      <div className='cust-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard
              tabList={custTabList}
              onTabChange={(key) =>
                setCustListFltr(
                  custRegList.filter((cust) =>
                    key !== 'all' ? cust.custType === key : true
                  )
                )
              }
            >
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
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
              </Space>
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default CustReg;
