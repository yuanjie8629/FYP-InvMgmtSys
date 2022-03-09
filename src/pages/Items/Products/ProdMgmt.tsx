import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image, message } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import prodTabList from './prodTabList';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { prodStatList } from '@utils/optionUtils';
import {
  ActivateButton,
  DeleteButton,
  EditButton,
  HideButton,
} from '@components/Button/ActionButton';
import StatusTag from '@components/Tag/StatusTag';
import { BoldTitle } from '@components/Title';
import { ActionModal } from '@components/Modal';
import { ActionModalContentProps } from '@components/Modal/ActionModal';
import {
  productBulkDelAPI,
  productDelAPI,
  productPrevAPI,
  productUpdAPI,
} from '@api/services/productAPI';
import { addSearchParams, parseURL } from '@utils/urlUtls';

const ProdMgmt = () => {
  const { Text } = Typography;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const [selected, setSelected] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const defPg = 5;

  const getTableData = () => {
    setTableLoading(true);
    productPrevAPI(location.search)
      .then((res) => {
        setList(res.data.results);
        setRecordCount(res.data.count);
        setTableLoading(false);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setTableLoading(false);
          showServerErrMsg();
        }
      });
  };

  useEffect(
    () => getTableData(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const actionModalProps: ActionModalContentProps = {
    recordType: 'product',
    dataSource: selected,
  };

  const showActionSuccessMsg = (action: 'activate' | 'delete' | 'hide') => {
    messageApi.open({
      key: action,
      type: 'success',
      content: `${selected.length || 1} Products ${
        action === 'activate'
          ? 'Activated'
          : action === 'delete'
          ? 'Deleted'
          : 'Hidden'
      } Successfully`,
    });
    setTimeout(() => message.destroy(action), 3000);
  };

  const showServerErrMsg = () => {
    messageApi.open({
      key: 'serverErr',
      type: 'error',
      content:
        "We're having some difficulties connecting to the server. Please try again later.",
    });
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  const activateBtn = (props: any) => <ActivateButton type='primary' />;

  const hideBtn = (props: any) => (
    <HideButton
      type='primary'
      color='grey'
      onClick={() => {
        ActionModal.show('hide', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );
            await productBulkDelAPI(selectedKeys)
              .then(() => {
                getTableData();
                showActionSuccessMsg('delete');
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

  const deleteBtn = (props: any) => (
    <DeleteButton
      type='primary'
      onClick={() => {
        ActionModal.show('delete', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );
            await productBulkDelAPI(selectedKeys)
              .then(() => {
                getTableData();
                showActionSuccessMsg('delete');
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

  const getProdDetails = (selectedRecord) => {
    const selected = [];
    selectedRecord.forEach((prod) =>
      selected.push({
        key: prod.item_id,
        title: prod.name,
        icon: (
          <Image src={prod.thumbnail} height={40} width={40} preview={false} />
        ),
      })
    );
    return selected;
  };

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((prod) =>
      selectedKeys.some((selected) => selected === prod.item_id)
    );

    setSelected(getProdDetails(selectedRecord));
  };

  const handleTabChange = (key) => {
    if (key !== 'all') {
      setSearchParams(addSearchParams(searchParams, { status: key }));
    } else {
      searchParams.delete('status');
      setSearchParams(parseURL(searchParams));
    }
  };

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
      dataIndex: ['name', 'category', 'thumbnail'],
      key: 'prod',
      sorter: true,
      width: 400,
      render: (_: any, data: { [x: string]: string }) => (
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
                <Text strong className='text-button'>
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
      sorter: true,
      width: 160,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      width: 150,
      render: (amount: string) => {
        let newAmt = parseFloat(amount);
        return <Text type='secondary'>{moneyFormatter(newAmt)}</Text>;
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: ['id', 'status', 'name', 'thumbnail'],
      key: 'status',
      width: 150,
      render: (_: any, data: { [x: string]: any }) => (
        <StatusTag
          status={data.status}
          statusList={prodStatList}
          dropdownStatus={['active', 'hidden']}
          onDropdownSelect={(selectedStatus) => {
            setSelected(getProdDetails([data]));
            ActionModal.show(
              selectedStatus === 'hidden' ? 'hide' : 'activate',
              {
                onOk: async () => {
                  await productUpdAPI(data.item_id, {
                    status: selectedStatus === 'hidden' ? 'hidden' : 'active',
                  })
                    .then((res) => {
                      getTableData();
                      showActionSuccessMsg(
                        selectedStatus === 'hidden' ? 'hide' : 'activate'
                      );
                    })
                    .catch((err) => {
                      showServerErrMsg();
                    });
                },
              }
            );
          }}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (prod: any) => {
        return (
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
                setSelected(getProdDetails([prod]));
                ActionModal.show('delete', {
                  onOk: async () => {
                    await productDelAPI(prod.item_id)
                      .then((res) => {
                        getTableData();
                        showActionSuccessMsg('delete');
                      })
                      .catch((err) => {
                        showServerErrMsg();
                      });
                  },
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Layout>
      {contextHolder}
      <MainCardContainer className='prod-mgmt'>
        <MainCard
          tabList={prodTabList}
          activeTabKey={
            searchParams.get('status') === null
              ? 'all'
              : searchParams.get('status')
          }
          onTabChange={handleTabChange}
        >
          <FilterInputs loading={tableLoading} />
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
              rowKey='item_id'
              dataSource={list}
              columns={prodMgmtColumns}
              buttons={onSelectBtn}
              loading={tableLoading}
              defPg={defPg}
              totalRecord={recordCount}
              onSelectChange={handleSelectChange}
            />
          </Space>
        </MainCard>
      </MainCardContainer>

      <ActionModal {...actionModalProps} />
    </Layout>
  );
};

export default ProdMgmt;
