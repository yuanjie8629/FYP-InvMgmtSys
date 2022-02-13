import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import packageList from './packageList';

import packTabList from './packTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { packStatList } from '@utils/optionUtils';
import {
  ActivateButton,
  DeleteButton,
  EditButton,
  HideButton,
} from '@/components/Button/ActionButton';
import StatusTag from '@/components/Tag/StatusTag';
import { BoldTitle } from '@/components/Title';

const PackMgmt = () => {
  const { Text } = Typography;
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

  const activateBtn = (props: any) => <ActivateButton type='primary' />;

  const hideBtn = (props: any) => <HideButton type='primary' color='grey' />;

  const deleteBtn = (props: any) => (
    <DeleteButton type='primary' />
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
        <Space direction='vertical' size={10} className='full-width'>
          {products.map((product: any) => (
            <Row
              key={`prodIncluded-${product}`}
              justify='space-between'
              gutter={20}
            >
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
      width: 150,
      render: (status: string) => (
        <StatusTag
          status={status}
          statusList={packStatList}
          dropdownStatus={['active', 'hidden']}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: () => (
        <Space direction='vertical' size={5}>
          <EditButton type='link' color='info' />
          <DeleteButton type='link' color='info' />
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
          <FilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={15} className='full-width'>
            <Row justify='space-between'>
              <Col>
                <BoldTitle level={4}>Package List</BoldTitle>
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
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default PackMgmt;
