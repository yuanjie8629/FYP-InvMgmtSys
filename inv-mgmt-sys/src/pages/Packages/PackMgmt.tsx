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
import packageList from './packageList';
import { HiCheckCircle, HiEyeOff, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { MdArrowDropDown } from 'react-icons/md';
import packTabList from './packTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { packStatList } from '@utils/optionUtils';

const PackMgmt = () => {
  const { Text, Title } = Typography;
  const [packageListFltr, setPackageListFltr] = useState(packageList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setPackageListFltr(
        packageList.filter((pack) =>
          searchParams.get('stat') !== null
            ? pack.packStat === searchParams.get('stat')
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
      fltr: [{ fld: 'packStat', value: 'hidden', rel: 'eq' }],
    },
    {
      element: hideBtn,
      key: 'hide',
      fltr: [{ fld: 'packStat', value: 'active', rel: 'eq' }],
    },
    {
      element: deleteBtn,
      key: 'delete',
    },
  ];

  const packMgmtColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Package',
      dataIndex: ['packNm', 'packSKU', 'packImg'],
      key: 'pack',
      sorter: true,
      width: 280,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={20}>
          <Col xs={9} xl={7}>
            <Image src={data['packImg']} height={80} width={80} />
          </Col>
          <Col xs={15} xl={17}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text strong className='text-button'>
                  {data['packNm']}
                </Text>
              </div>
              <Text type='secondary' className='text-sm text-break'>
                {data['packSKU']}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Products Included',
      dataIndex: 'packProds',
      key: 'packProds.prodNm',
      width: 280,
      render: (products: []) => (
        <Space direction='vertical' size={10} className='width-full'>
          {products.map((product: any) => (
            <Row justify='space-between' gutter={20}>
              <Col span={20}>
                <Text type='secondary' className='text-break'>
                  {product.prodNm}
                </Text>
              </Col>
              <Col span={4} className='justify-end'>
                <Text type='secondary'>x{product.quantity}</Text>
              </Col>
            </Row>
          ))}
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'packPrice',
      key: 'packPrice',
      sorter: true,
      width: 100,
      render: (amount: string) => (
        <Text type='secondary'>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'packStock',
      key: 'paclStock',
      sorter: true,
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'packStat',
      key: 'packStat',
      width: 100,
      render: (status: string) => {
        const menu = (
          <Menu>
            {packStatList.map((statusItem) =>
              !(
                status === statusItem.status ||
                (statusItem.status !== 'hidden' &&
                  statusItem.status !== 'active')
              ) ? (
                <Menu.Item key='{statusItem.status}'>
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

        const matchedStatus = packStatList.find(
          (statusItem) => status === statusItem.status
        );

        return !(
          ['expired', 'oos', 'scheduled'].indexOf(matchedStatus!.status) >= 0
        ) ? (
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
              packStatList.find(
                (statusItem) => statusItem.status === matchedStatus?.status
              )!.color
            }
          >
            {
              packStatList.find(
                (statusItem) => statusItem.status === matchedStatus?.status
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
      <MainCardContainer className='pack-mgmt'>
        <MainCard
          tabList={packTabList}
          activeTabKey={
            searchParams.get('stat') === null ? 'all' : searchParams.get('stat')
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
                  <Title level={4}>Package List</Title>
                </Col>
                <Col>
                  <Button
                    type='primary'
                    onClick={() => navigate(findRoutePath('packAdd'))}
                  >
                    Add Package
                  </Button>
                </Col>
              </Row>
              <InformativeTable
                dataSource={packageListFltr}
                columns={packMgmtColumns}
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

export default PackMgmt;
