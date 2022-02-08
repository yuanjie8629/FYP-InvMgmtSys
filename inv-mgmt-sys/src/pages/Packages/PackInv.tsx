import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import Button from '@components/Button';
import MainCardContainer from '@components/Container/MainCardContainer';
import { Col, Image, Row, Space, Typography } from 'antd';
import FilterInputs from './FilterInputs';
import packageList from './packageList';
import packTabList from './packTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import InvStockInput from '@/components/Input/InvStockInput';
import { BulkEditButton } from '@/components/Button/ActionButton';

const PackInv = () => {
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

  const bulkUpdBtn = (props: any) => <BulkEditButton />;

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: bulkUpdBtn,
      key: 'bulkUpd',
    },
  ];

  const packInvColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    width?: number | string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Package',
      dataIndex: ['packNm', 'packSKU', 'packImg'],
      key: 'pack',
      width: 260,
      sorter: true,
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
      width: 260,
      render: (products: []) => (
        <Space direction='vertical' size={10} className='full-width'>
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
      width: 100,
      sorter: true,
      render: (amount: string) => (
        <Text type='secondary'>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'packStock',
      key: 'packStock',
      width: 100,
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,

      render: () => <InvStockInput input={0} />,
    },
  ];
  return (
    <Layout>
      <MainCardContainer className='pack-inv'>
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
                <Title level={4}>Package List</Title>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('packMgmt'))}
                >
                  View Packages
                </Button>
              </Col>
            </Row>

            <InformativeTable
              dataSource={packageListFltr}
              columns={packInvColumns}
              buttons={onSelectBtn}
              defPg={5}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};
export default PackInv;
