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
import discList from './discList';
import { HiCheckCircle, HiPause, HiTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';

const DiscMgmt = () => {
  const { Text, Title } = Typography;
  let navigate = useNavigate();

  const [discListFltr, setDiscListFltr] = useState(discList);
  const discTabList = [
    { key: 'all', tab: 'All' },
    { key: 'active', tab: 'Active' },
    { key: 'hidden', tab: 'Hidden' },
    { key: 'scheduled', tab: 'Scheduled' },
    { key: 'expired', tab: 'Expired' },
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

  const deleteBtn = (props: any) => (
    <Button
      type='primary'
      color='error'
      icon={
        <HiTrash
          size={16}
          style={{ marginRight: 5, position: 'relative', top: 3 }}
        />
      }
    >
      Delete
    </Button>
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: activateBtn,
      key: 'activate',
      fltr: [{ fld: 'status', val: 'suspended', rel: 'eq' }],
    },
    {
      element: deleteBtn,
      key: 'delete',
      fltr: [{ fld: 'status', val: 'active', rel: 'eq' }],
    },
  ];

  const discMgmtColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Customer ID',
      dataIndex: 'custID',
      key: 'custID',
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
      title: 'Registration Date',
      dataIndex: 'regDt',
      key: 'regDt',
      sorter: true,
    },
    {
      title: 'Sales per Month',
      dataIndex: 'salesMth',
      key: 'salesMth',
      sorter: true,
      render: (amount: string) =>
        amount !== undefined ? (
          <Text strong>RM {parseFloat(amount).toFixed(2)}</Text>
        ) : (
          '-'
        ),
    },
    {
      title: 'Last Order Date',
      dataIndex: 'lastOrderDt',
      key: 'lastOrderDt',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
      <div className='disc-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard
              tabList={discTabList}
              onTabChange={(key) =>
                setDiscListFltr(
                  discList.filter((disc) =>
                    key !== 'all' ? disc.custType === key : true
                  )
                )
              }
            >
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Discount List</Title>
                    </Col>
                    <Col>
                      <Button
                        type='primary'
                        onClick={() => navigate(findRoutePath('discAdd'))}
                      >
                        Create Discount Code
                      </Button>
                    </Col>
                  </Row>
                  <InformativeTable
                    dataSource={discListFltr}
                    columns={discMgmtColumns}
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

export default DiscMgmt;
