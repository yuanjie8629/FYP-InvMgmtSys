import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import InformativeTable from '@components/Table/InformativeTable';
import Button from '@components/Button';
import MainCardContainer from '@components/Container/MainCardContainer';
import { Col, Image, message, Row, Space, Typography } from 'antd';
import FilterInputs from './FilterInputs';
import packTabList from './packTabList';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import InvStockInput from '@components/Input/InvStockInput';
import { BulkEditButton } from '@components/Button/ActionButton';
import { BoldTitle } from '@components/Title';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { ActionModal } from '@components/Modal';
import {
  packageBulkUpdAPI,
  packagePrevAPI,
  packageUpdAPI,
} from '@api/services/packageAPI';
import { getItemInvDetails, onInvSelectBtn } from '../itemUtils';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import { moneyFormatter } from '@utils/numUtils';

const PackInv = () => {
  const { Text } = Typography;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const [selected, setSelected] = useState([]);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: any;
  }>({ loading: false, index: undefined });
  const [tableLoading, setTableLoading] = useState(false);
  const defPg = 5;

  const getTableData = (isMounted: boolean = true) => {
    setSelected([]);
    setTableLoading(true);
    packagePrevAPI(location.search)
      .then((res) => {
        if (isMounted) {
          setList(res.data.results);
          setRecordCount(res.data.count);
          setTableLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setTableLoading(false);
          showServerErrMsg();
        }
      });
  };

  useEffect(
    () => {
      let isMounted = true;
      getTableData(isMounted);
      return () => {
        isMounted = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const showUpdSuccessMsg = (updCount?: number) => {
    messageApi.open(actionSuccessMsg('Package', 'update', updCount));
    setTimeout(() => message.destroy('update'), 3000);
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  const bulkUpdBtn = (props: any) => (
    <BulkEditButton
      disabled={tableLoading}
      onClick={() => {
        ActionModal.show('bulkUpd', {
          onOk: async (data) => {
            await packageBulkUpdAPI(data)
              .then(() => {
                getTableData();
                showUpdSuccessMsg(data.length);
              })
              .catch((err) => {
                if (err.response?.status !== 401) setTableLoading(false);
                else {
                  showServerErrMsg();
                }
              });
          },
        });
      }}
    />
  );

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((prod) =>
      selectedKeys.some((selected) => selected === prod.id)
    );

    setSelected(getItemInvDetails(selectedRecord));
  };

  const handleTabChange = (key) => {
    if (key !== 'all') {
      setSearchParams(addSearchParams(searchParams, { status: key }));
    } else {
      searchParams.delete('status');
      setSearchParams(parseURL(searchParams));
    }
  };

  const packInvColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    fixed?: 'left' | 'right';
    defaultSortOrder?: 'ascend' | 'descend';
    render?: any;
  }[] = [
    {
      title: 'Package',
      dataIndex: ['name', 'sku', 'thumbnail'],
      key: 'name',
      width: 260,
      sorter: true,
      defaultSortOrder: getSortOrder('name'),
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={20}>
          <Col xs={9} xl={7}>
            <Image src={data.thumbnail} height={80} width={80} />
          </Col>
          <Col xs={15} xl={17}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text
                  strong
                  className='text-button'
                  onClick={() => {
                    navigate(`/package/${data['id']}`);
                  }}
                >
                  {data.name}
                </Text>
              </div>
              <Text type='secondary' className='text-sm text-break'>
                {data.sku}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Products Included',
      dataIndex: 'product',
      key: 'product.id',
      width: 280,
      render: (products: []) => (
        <Space direction='vertical' size={10} className='full-width'>
          {products.map((product: any) => (
            <Row
              key={`prodIncluded-${product.id}`}
              justify='space-between'
              gutter={20}
            >
              <Col span={20}>
                <Text type='secondary' className='text-break'>
                  {product.name}
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
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      defaultSortOrder: getSortOrder('price'),
      width: 100,
      render: (amount: string) => (
        <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      defaultSortOrder: getSortOrder('sku'),
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,
      render: (data: any, _, index: number) => (
        <InvStockInput
          loading={index === actionLoading.index && actionLoading.loading}
          initialValue={data.stock}
          onSave={(value) => {
            setActionLoading({ loading: true, index: index });
            packageUpdAPI(data.id, { stock: value })
              .then(() => {
                setActionLoading({ loading: false, index: index });
                showUpdSuccessMsg(1);
                getTableData();
              })
              .catch((err) => {
                if (err.response?.status !== 401)
                  setActionLoading({ loading: false, index: index });
              });
          }}
        />
      ),
    },
  ];
  return (
    <Layout>
      {contextHolder}
      <MainCardContainer className='pack-inv'>
        <MainCard
          tabList={packTabList}
          activeTabKey={
            searchParams.get('status') === null
              ? 'all'
              : searchParams.get('status')
          }
          onTabChange={handleTabChange}
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
                  onClick={() => navigate(findRoutePath('packMgmt'))}
                >
                  View Packages
                </Button>
              </Col>
            </Row>

            <InformativeTable
              rowKey='id'
              dataSource={list}
              columns={packInvColumns}
              buttons={onInvSelectBtn(bulkUpdBtn)}
              defPg={defPg}
              totalRecord={recordCount}
              loading={tableLoading}
              onSelectChange={handleSelectChange}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='package' dataSource={selected} />
    </Layout>
  );
};
export default PackInv;
