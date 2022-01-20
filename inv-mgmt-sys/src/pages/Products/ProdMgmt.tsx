import ContainerCard from '@components/ContainerCard/ContainerCard';
import Button from '@components/Button/Button';
import Layout from '@components/Layout/Layout';
import Tag, { TagProps } from '@components/Tag/Tag';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image, Dropdown, Menu } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import prodList from './prodList';
import { HiEyeOff, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { MdArrowDropDown } from 'react-icons/md';
import prodTabList from './prodTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';

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
      element: hideBtn,
      key: 'hide',
      fltr: [{ fld: 'prodStat', val: 'active', rel: 'eq' }],
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
          <Col>
            <Image src={data['prodImg']} height={120} width={120} />
          </Col>
          <Col>
            <Space direction='vertical' size={5}>
              <Button type='link' color='info'>
                {data['prodNm']}
              </Button>
              <Text type='secondary' className='text-sm'>
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
        const statusList = [
          { status: 'active', label: 'Active', color: 'success' },
          { status: 'oos', label: 'Out of Stock', color: 'error' },
          { status: 'hidden', label: 'Hidden', color: 'default' },
        ];
        const menu = (
          <Menu>
            {statusList.map((statusItem) =>
              !(
                status === statusItem.status ||
                (statusItem.status !== 'hidden' &&
                  statusItem.status !== 'active')
              ) ? (
                <Menu.Item key={statusItem.status}>
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

        return matchedStatus?.status !== 'oos' ? (
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
                (statusItem) => statusItem.status === matchedStatus.status
              )!.color
            }
          >
            {
              statusList.find(
                (statusItem) => statusItem.status === matchedStatus.status
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
      <div className='prod-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard
              tabList={prodTabList}
              activeTabKey={
                searchParams.get('stat') === null
                  ? 'all'
                  : searchParams.get('stat')
              }
              onTabChange={(key) => {
                setSearchParams(key !== 'all' ? { stat: key } : {});
              }}
            >
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
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
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default ProdMgmt;
