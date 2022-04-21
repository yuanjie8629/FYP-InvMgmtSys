import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image } from 'antd';
import InformativeTable from '@components/Table/InformativeTable';
import prodTabList from './prodTabList';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { BulkEditButton } from '@components/Button/ActionButton';
import { BoldTitle } from '@components/Title';
import { ActionModal } from '@components/Modal';
import {
  productBulkUpdAPI,
  productPrevAPI,
  productUpdAPI,
} from '@api/services/productAPI';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import { getItemInvDetails, onInvSelectBtn } from '../itemUtils';
import InvStockInput from '@components/Input/InvStockInput';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { MessageContext } from '@contexts/MessageContext';

const ProdInv = () => {
  const { Text } = Typography;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi] = useContext(MessageContext);
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const [selected, setSelected] = useState([]);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: any;
  }>({ loading: false, index: undefined });
  const [tableLoading, setTableLoading] = useState(false);
  const [currentPg, setCurrentPg] = useState(1);
  const defPg = 5;

  const getTableData = (isMounted: boolean = true) => {
    setSelected([]);
    setTableLoading(true);
    if (!searchParams.has('limit')) {
      setSearchParams(addSearchParams(searchParams, { limit: String(defPg) }));
    }
    productPrevAPI(location.search)
      .then((res) => {
        if (isMounted) {
          setList(res.data?.results);
          setRecordCount(res.data?.count);
          if (searchParams.has('offset')) {
            let offset = Number(searchParams.get('offset'));
            setCurrentPg(offset / defPg + 1);
          } else {
            setCurrentPg(1);
          }
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
    messageApi.open(actionSuccessMsg('Product', 'update', updCount));
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const bulkUpdBtn = (props: any) => (
    <BulkEditButton
      disabled={tableLoading}
      onClick={() => {
        ActionModal.show('invBulkUpd', {
          onOk: async (data) => {
            await productBulkUpdAPI(data)
              .then(() => {
                getTableData();
                showUpdSuccessMsg(data.length);
              })
              .catch((err) => {
                if (err.response?.status !== 401) {
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

  const prodInvColumns: {
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
      title: 'Product',
      dataIndex: ['name', 'category', 'thumbnail'],
      key: 'name',
      width: 400,
      sorter: true,
      defaultSortOrder: getSortOrder('name'),
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={5}>
          <Col xs={9} xl={7}>
            <Image
              alt={data.name}
              src={data.thumbnail}
              height={100}
              width={100}
            />
          </Col>
          <Col xs={15} xl={17}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text
                  strong
                  className='text-button'
                  onClick={() => {
                    navigate(`/product/${data['id']}`);
                  }}
                >
                  {data.name}
                </Text>
              </div>
              <Text type='secondary' className='text-sm text-break'>
                {data.category}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 160,
      sorter: true,
      defaultSortOrder: getSortOrder('sku'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: true,
      defaultSortOrder: getSortOrder('price'),
      render: (amount: string) => (
        <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      sorter: true,
      defaultSortOrder: getSortOrder('stock'),
    },
    {
      title: 'Update Inventory Stock',
      key: 'action',
      width: 280,
      render: (data: any, _, index: number) => (
        <InvStockInput
          loading={index === actionLoading.index && actionLoading.loading}
          stock={data.stock}
          onSave={(value) => {
            setActionLoading({ loading: true, index: index });
            let formData = new FormData();
            formData.append('stock', String(value));
            productUpdAPI(data.id, formData)
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
      <MainCardContainer className='prod-inv'>
        <MainCard
          tabList={prodTabList}
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
                <BoldTitle level={4}>Product List</BoldTitle>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('prodMgmt'))}
                >
                  View Products
                </Button>
              </Col>
            </Row>

            <InformativeTable
              rowKey='id'
              dataSource={list}
              columns={prodInvColumns}
              buttons={onInvSelectBtn(bulkUpdBtn)}
              defPg={defPg}
              currentPg={currentPg}
              totalRecord={recordCount}
              loading={tableLoading}
              onSelectChange={handleSelectChange}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='product' dataSource={selected} />
    </Layout>
  );
};
export default ProdInv;
