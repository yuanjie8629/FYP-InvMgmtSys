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
import {
  itemBulkDelAPI,
  productBulkUpdAPI,
  productDelAPI,
  productPrevAPI,
  productUpdAPI,
} from '@api/services/productAPI';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import {
  getItemDetails,
  onItemSelectBtn,
  selectButtonsProps,
} from '../itemUtils';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { MessageContext } from '@contexts/MessageContext';

const ProdMgmt = () => {
  const { Text } = Typography;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi] = useContext(MessageContext);
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const [selected, setSelected] = useState([]);
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
        if (isMounted && err.response?.status !== 401) {
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

  const showActionSuccessMsg = (
    action: 'activate' | 'delete' | 'hide',
    isMulti: boolean = true
  ) => {
    messageApi.open(
      actionSuccessMsg('Product', action, isMulti ? selected.length : 1)
    );
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const activateBtn = (props: any) => (
    <ActivateButton
      type='primary'
      onClick={() => {
        ActionModal.show('activate', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );

            await productBulkUpdAPI(
              selectedKeys.map((key) => {
                return { id: key, status: 'active' };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('activate');
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

            await productBulkUpdAPI(
              selectedKeys.map((key) => {
                return { id: key, status: 'hidden' };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('hide');
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

  const deleteBtn = (props: any) => (
    <DeleteButton
      type='primary'
      onClick={() => {
        ActionModal.show('delete', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );
            await itemBulkDelAPI(selectedKeys)
              .then(() => {
                getTableData();
                showActionSuccessMsg('delete');
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

  const selectButtons: selectButtonsProps[] = [
    { label: 'activate', element: activateBtn },
    { label: 'hide', element: hideBtn },
    { label: 'delete', element: deleteBtn },
  ];

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((prod) =>
      selectedKeys.some((selected) => selected === prod.id)
    );

    setSelected(getItemDetails(selectedRecord));
  };

  const handleTabChange = (key) => {
    if (key !== 'all') {
      searchParams.delete('offset');
      setSearchParams(addSearchParams(searchParams, { status: key }));
    } else {
      searchParams.delete('status');
      searchParams.delete('offset');
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
    defaultSortOrder?: 'ascend' | 'descend';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['id', 'name', 'category', 'thumbnail'],
      key: 'name',
      sorter: true,
      defaultSortOrder: getSortOrder('name'),
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
      sorter: true,
      defaultSortOrder: getSortOrder('sku'),
      width: 160,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      defaultSortOrder: getSortOrder('price'),
      width: 150,
      render: (amount: string) => {
        return (
          <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
        );
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      defaultSortOrder: getSortOrder('stock'),
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: ['id', 'status', 'name', 'thumbnail'],
      key: 'status',
      width: 150,
      render: (_: any, data: { [x: string]: any }) => {
        return (
          <StatusTag
            status={data.status}
            statusList={prodStatList}
            dropdownStatus={['active', 'hidden']}
            onDropdownSelect={(selectedStatus) => {
              setSelected(getItemDetails([data]));
              ActionModal.show(
                selectedStatus === 'hidden' ? 'hide' : 'activate',
                {
                  onOk: async () => {
                    let formData = new FormData();
                    formData.append(
                      'status',
                      selectedStatus === 'hidden' ? 'hidden' : 'active'
                    );
                    await productUpdAPI(data.id, formData)
                      .then((res) => {
                        getTableData();
                        showActionSuccessMsg(
                          selectedStatus === 'hidden' ? 'hide' : 'activate',
                          false
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
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (data: any) => {
        return (
          <Space direction='vertical' size={5}>
            <EditButton
              type='link'
              color='info'
              onClick={() => {
                navigate(`/product/${data.id}`);
              }}
            />
            <DeleteButton
              type='link'
              color='info'
              onClick={() => {
                setSelected(getItemDetails([data]));
                ActionModal.show('delete', {
                  onOk: async () => {
                    await productDelAPI(data.id)
                      .then((res) => {
                        getTableData();
                        showActionSuccessMsg('delete', false);
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
              rowKey='id'
              dataSource={list}
              columns={prodMgmtColumns}
              buttons={onItemSelectBtn(selectButtons)}
              loading={tableLoading}
              defPg={defPg}
              totalRecord={recordCount}
              onSelectChange={handleSelectChange}
              currentPg={currentPg}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='product' dataSource={selected} />
    </Layout>
  );
};

export default ProdMgmt;
