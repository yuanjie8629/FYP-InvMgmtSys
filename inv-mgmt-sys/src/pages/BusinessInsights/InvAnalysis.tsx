import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout/Layout';
import Tag, { TagProps } from '@components/Tag';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Dropdown, Menu } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import voucherList from './voucherList';
import { HiCheckCircle, HiEyeOff, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { MdAllInclusive, MdArrowDropDown, MdSync } from 'react-icons/md';
import Tooltip from 'antd/es/tooltip';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import { sortByOrder } from '@utils/sortUtils';

const InvAnalysis = () => {
  const { Text, Title } = Typography;
  const [invAnalysisListFltr, setInvAnalysisListFltr] = useState(voucherList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setInvAnalysisListFltr(
        voucherList.filter((voucher) =>
          searchParams.get('stat') !== null
            ? voucher.status === searchParams.get('stat')
            : setSearchParams({ stat: 'abc' })
        )
      ),
    [searchParams, setSearchParams]
  );
  const invAnalysisTab = [
    { key: 'abc', tab: 'ABC' },
    { key: 'hml', tab: 'HML' },
    { key: 'eoq', tab: 'EOQ' },
    { key: 'ss', tab: 'Safety Stock' },
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

  const hideBtn = (props: any) => (
    <Button
      type='primary'
      color='grey'
      icon={
        <HiEyeOff
          size={16}
          style={{ marginRight: 5, position: 'relative', top: 3 }}
        />
      }
      {...props}
    >
      Hide
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
          <ul style={{ padding: '0 25px' }}>
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
      width: 120,
      render: (status: string) => {
        const statusList = [
          { status: 'active', label: 'Active', color: 'success' },
          { status: 'scheduled', label: 'Scheduled', color: 'processing' },
          { status: 'expired', label: 'Expired', color: 'error' },
          { status: 'hidden', label: 'Hidden', color: 'default' },
        ];
        const menu = (
          <Menu>
            {statusList.map((statusItem) =>
              !(
                status === statusItem.status ||
                !['hidden', 'active'].includes(statusItem.status)
              ) ? (
                <Menu.Item key='{statusItem.status}'>
                  {statusItem.label}
                </Menu.Item>
              ) : null
            )}
          </Menu>
        );

        interface ProdStatusTagProps extends TagProps {
          color: string;
          children: React.ReactNode;
        }
        const ProdStatusTag = ({
          color,
          children,
          ...props
        }: ProdStatusTagProps) => (
          <Tag minWidth='50%' maxWidth='100%' color={color} {...props}>
            {children}
          </Tag>
        );

        const matchedStatus = statusList.find(
          (statusItem) => status === statusItem.status
        );

        return !(
          ['expired', 'scheduled'].indexOf(matchedStatus!.status) >= 0
        ) ? (
          <Row align='middle'>
            <ProdStatusTag color={matchedStatus!.color}>
              {matchedStatus!.label}
            </ProdStatusTag>
            <Dropdown overlay={menu} placement='bottomRight'>
              <MdArrowDropDown size={25} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Row>
        ) : (
          <ProdStatusTag
            color={
              statusList.find(
                (statusItem) => statusItem.status === matchedStatus?.status
              )!.color
            }
          >
            {
              statusList.find(
                (statusItem) => statusItem.status === matchedStatus?.status
              )!.label
            }
          </ProdStatusTag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_: any, data: { [x: string]: string }) => (
        <Space direction='vertical' size={5}>
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
            Edit
          </Button>
          <Button
            type='link'
            color='info'
            icon={
              <HiTrash
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 2 }}
              />
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='voucher-mgmt'>
        <MainCard
          tabList={invAnalysisTab}
          activeTabKey={searchParams.get('stat')}
          onTabChange={(key) => {
            setSearchParams({ stat: key });
          }}
        >
          <Space direction='vertical' size={40} className='full-width'>
            <FilterInputs />
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
                dataSource={invAnalysisListFltr}
                columns={voucherMgmtColumns}
                buttons={onSelectBtn}
                scroll={{ x: 1200 }}
              />
            </Space>
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default InvAnalysis;
