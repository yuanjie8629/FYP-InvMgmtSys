import React, { useState } from 'react';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Button from '@components/Button/Button';
import Layout from '@components/Layout/Layout';
import Tag, { TagProps } from '@components/Tag/Tag';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import custList from './custList';
import { HiCheckCircle, HiPause } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';

const CustMgmt = () => {
  const { Text, Title } = Typography;
  let navigate = useNavigate();

  const [custListFltr, setCustListFltr] = useState(custList);
  const custTabList = [
    { key: 'all', tab: 'All' },
    { key: 'cust', tab: 'Direct Customer' },
    { key: 'agent', tab: 'Agent' },
    { key: 'drpshpr', tab: 'Dropshipper' },
  ];

  const activateBtn = (props: any) => (
    <Button
      type='primary'
      icon={
        <HiCheckCircle
          size={16}
          style={{ marginRight: 5, position: 'relative', top: 3 }}
        />
      }
      {...props}
    >
      Activate
    </Button>
  );

  const suspendBtn = (props: any) => (
    <Button
      type='primary'
      color='error'
      icon={
        <HiPause style={{ marginRight: 5, position: 'relative', top: 2 }} />
      }
      {...props}
    >
      Suspend
    </Button>
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: activateBtn,
      key: 'activate',
      fltr: [{ fld: 'status', val: 'suspended', rel: 'eq' }],
    },
    {
      element: suspendBtn,
      key: 'suspend',
      fltr: [{ fld: 'status', val: 'active', rel: 'eq' }],
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
      render: (status: string) => {
        const statusList = [
          { status: 'active', label: 'Active', color: 'success' },
          { status: 'suspended', label: 'Suspended', color: 'error' },
        ];

        interface custStatusTagProps extends TagProps {
          color: string;
          children: React.ReactNode;
        }
        const CustStatusTag = ({
          color,
          children,
          ...props
        }: custStatusTagProps) => (
          <Tag minWidth='80%' maxWidth='100%' color={color} {...props}>
            {children}
          </Tag>
        );

        const matchedStatus = statusList.find(
          (statusItem) => status === statusItem.status
        );

        return (
          <CustStatusTag
            color={matchedStatus !== undefined ? matchedStatus.color : ''}
          >
            {matchedStatus !== undefined ? matchedStatus.label : null}
          </CustStatusTag>
        );
      },
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
          <Button
            type='link'
            color='info'
            icon={
              <HiCheckCircle
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 3 }}
              />
            }
          >
            Activate
          </Button>
        ) : (
          <Button
            type='link'
            color='info'
            icon={
              <HiPause
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 3 }}
              />
            }
          >
            Suspend
          </Button>
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
                  custList.filter((cust) =>
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
                    columns={custMgmtColumns}
                    buttons={onSelectBtn}
                    scroll={{ x: 1200 }}
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

export default CustMgmt;
