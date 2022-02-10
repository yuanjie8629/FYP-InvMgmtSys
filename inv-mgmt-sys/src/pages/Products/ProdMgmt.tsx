import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import prodList from './prodList';
import prodTabList from './prodTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { prodStatList } from '@utils/optionUtils';
import {
  ActivateButton,
  DeleteButton,
  EditButton,
  HideButton,
} from '@/components/Button/ActionButton';
import StatusTag from '@/components/Tag/StatusTag';
import { BoldTitle } from '@/components/Title';
import { DeleteModal } from '@/components/Modal';
import DescriptionList from '@/components/List/DescriptionList';

const ProdMgmt = () => {
  const { Text } = Typography;

  let navigate = useNavigate();
  const [prodListFltr, setProdListFltr] = useState(prodList);
  const [loading, setLoading] = useState(false);
  const [deleteMulti, setDeleteMulti] = useState(false);
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

  const DeleteList = () => (
    <DescriptionList dataSource={[]} bordered style={{ width: 400 }} />
  );

  const activateBtn = (props: any) => <ActivateButton type='primary' />;

  const hideBtn = (props: any) => <HideButton type='primary' color='grey' />;

  const deleteBtn = (props: any) => (
    <DeleteButton
      type='primary'
      color='error'
      onClick={() => {
        setDeleteMulti(true);
        DeleteModal.show();
      }}
    />
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
            <Image src={data['prodImg']} height={100} width={100} />
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
      render: (status: string) => (
        <StatusTag
          status={status}
          statusList={prodStatList}
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
          <EditButton
            type='link'
            color='info'
            onClick={() => {
              navigate(findRoutePath('prodAdd'));
            }}
          />
          <DeleteButton
            type='link'
            color='info'
            onClick={() => {
              setDeleteMulti(false);
              DeleteModal.show();
            }}
          />
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
          <FilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={15} className='full-width'>
            <Row justify='space-between'>
              <Col>
                <BoldTitle level={4}>Product List</BoldTitle>
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
              onSelectChange={(selectedKeys) => console.log(selectedKeys)}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <DeleteModal
        onOk={() => setLoading(true)}
        onCancel={() => setLoading(false)}
        loading={loading}
        label={
          deleteMulti
            ? 'Do you really want to delete the following records?'
            : undefined
        }
      >
        {deleteMulti && <DeleteList />}
      </DeleteModal>
    </Layout>
  );
};

export default ProdMgmt;
