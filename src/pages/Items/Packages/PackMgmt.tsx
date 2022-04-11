import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image } from 'antd';
import InformativeTable from '@components/Table/InformativeTable';

import packTabList from './packTabList';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { packStatList } from '@utils/optionUtils';
import {
  ActivateButton,
  DeleteButton,
  EditButton,
  HideButton,
} from '@components/Button/ActionButton';
import StatusTag from '@components/Tag/StatusTag';
import { BoldTitle } from '@components/Title';
import {
  itemBulkDelAPI,
  packageBulkUpdAPI,
  packageDelAPI,
  packagePrevAPI,
  packageUpdAPI,
} from '@api/services/packageAPI';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { ActionModal } from '@components/Modal';
import {
  getItemDetails,
  onItemSelectBtn,
  selectButtonsProps,
} from '../itemUtils';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import { moneyFormatter } from '@utils/numUtils';
import { MessageContext } from '@contexts/MessageContext';

const PackMgmt = () => {
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
    packagePrevAPI(location.search)
      .then((res) => {
        if (isMounted) {
          setList(res.data.results);
          setRecordCount(res.data.count);
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
          // showServerErrMsg();
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
      actionSuccessMsg('Package', action, isMulti ? selected.length : 1)
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

            await packageBulkUpdAPI(
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

            await packageBulkUpdAPI(
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
    const selectedRecord = list.filter((pack) =>
      selectedKeys.some((selected) => selected === pack.id)
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

  const packMgmtColumns: {
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
      sorter: true,
      defaultSortOrder: getSortOrder('name'),
      width: 280,
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
                    navigate(`/package/${data.id}`);
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
      title: 'Status',
      dataIndex: ['id', 'status', 'name', 'thumbnail'],
      key: 'status',
      width: 150,
      render: (_: any, data: { [x: string]: any }) => (
        <StatusTag
          status={data.status}
          statusList={packStatList}
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
                    selectedStatus === 'hidden' ? 'hide' : 'active'
                  );
                  await packageUpdAPI(data.id, formData)
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
      ),
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
                navigate(`/package/${data.id}`);
              }}
            />
            <DeleteButton
              type='link'
              color='info'
              onClick={() => {
                setSelected(getItemDetails([data]));
                ActionModal.show('delete', {
                  onOk: async () => {
                    await packageDelAPI(data.id)
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
      <MainCardContainer className='pack-mgmt'>
        <MainCard
          tabList={packTabList}
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
              rowKey='id'
              dataSource={list}
              columns={packMgmtColumns}
              buttons={onItemSelectBtn(selectButtons)}
              loading={tableLoading}
              defPg={defPg}
              currentPg={currentPg}
              totalRecord={recordCount}
              onSelectChange={handleSelectChange}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='package' dataSource={selected} />
    </Layout>
  );
};

export default PackMgmt;
