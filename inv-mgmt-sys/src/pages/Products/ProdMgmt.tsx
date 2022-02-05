import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout/Layout';
import Tag, { TagProps } from '@components/Tag';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image, Dropdown, Menu } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import prodList from './prodList';
import { HiCheckCircle, HiEyeOff, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { MdArrowDropDown } from 'react-icons/md';
import prodTabList from './prodTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { prodStatList } from '@utils/optionUtils';

const ProdMgmt = () => {
  const { Text, Title } = Typography;
  let navigate = useNavigate();
  const [prodListFltr, setProdListFltr] = useState(prodList);
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setProdListFltr(
        prodList.filter((prod) =>
          searchParams.get('stat') !== null
            ? prod.prodStat === searchParams.get('stat')
            : true
        )
      ),
    [searchParams]
  );

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
      fltr: [{ fld: 'prodStat', value: 'hidden', rel: 'eq' }],
    },
    {
      element: hideBtn,
      key: 'hide',
      fltr: [{ fld: 'prodStat', value: 'active', rel: 'eq' }],
    },
    {
      element: deleteBtn,
      key: 'delete',
    },
  ];

  const prodMgmtColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    fixed?: 'left' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['prodNm', 'prodCat', 'prodImg'],
      key: 'prod',
      sorter: true,
      width: 400,
      render: (_: any, data: { [x: string]: string }) => (
        <Row gutter={5}>
          <Col xs={9} xl={7}>
            <Image src={data['prodImg']} height={120} width={120} />
          </Col>
          <Col xs={15} xl={17}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text strong className='text-button'>
                  {data['prodNm']}
                </Text>
              </div>
              <Text type='secondary' className='text-sm text-break'>
                {data['prodCat']}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'prodSKU',
      key: 'prodSKU',
      sorter: true,
      width: 160,
    },
    {
      title: 'Price',
      dataIndex: 'prodPrice',
      key: 'prodPrice',
      sorter: true,
      width: 150,
      render: (amount: number) => (
        <Text type='secondary'>{moneyFormatter(amount)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'prodStock',
      key: 'prodStock',
      sorter: true,
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'prodStat',
      key: 'prodStat',
      width: 150,
      render: (status: string) => {
        const menu = (
          <Menu>
            {prodStatList.map((statusItem) =>
              !(
                status === statusItem.status ||
                (!['hidden','active'].includes(statusItem.status) )
              ) ? (
                <Menu.Item key={statusItem.status}>
                  {statusItem.label}
                </Menu.Item>
              ) : null
            )}
          </Menu>
        );

        interface StatusTagProps extends TagProps {
          color: string;
          children: React.ReactNode;
        }
        const StatusTag = ({ color, children, ...props }: StatusTagProps) => (
          <Tag minWidth='50%' maxWidth='100%' color={color} {...props}>
            {children}
          </Tag>
        );

        const matchedStatus = prodStatList.find(
          (statusItem) => status === statusItem.status
        );

        return matchedStatus?.status !== 'oos' ? (
          <Row align='middle'>
            <StatusTag color={matchedStatus!.color}>
              {matchedStatus!.label}
            </StatusTag>
            <Dropdown overlay={menu} placement='bottomRight'>
              <MdArrowDropDown size={25} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Row>
        ) : (
          <StatusTag
            color={
              prodStatList.find(
                (statusItem) => statusItem.status === matchedStatus.status
              )!.color
            }
          >
            {
              prodStatList.find(
                (statusItem) => statusItem.status === matchedStatus.status
              )!.label
            }
          </StatusTag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: () => (
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
      <MainCardContainer className='prod-mgmt'>
        <MainCard
          tabList={prodTabList}
          activeTabKey={
            searchParams.get('stat') === null ? 'all' : searchParams.get('stat')
          }
          onTabChange={(key) => {
            setSearchParams(key !== 'all' ? { stat: key } : {});
          }}
        >
          <Space direction='vertical' size={40} className='full-width'>
            <FilterInputs />
            <Space direction='vertical' size={15} className='full-width'>
              <Row justify='space-between'>
                <Col>
                  <Title level={4}>Product List</Title>
                </Col>
                <Col>
                  <Button
                    type='primary'
                    onClick={() => navigate(findRoutePath('prodAdd'))}
                  >
                    Add Product
                  </Button>
                </Col>
              </Row>
              <InformativeTable
                dataSource={prodListFltr}
                columns={prodMgmtColumns}
                buttons={onSelectBtn}
                defPg={5}
              />
            </Space>
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default ProdMgmt;
