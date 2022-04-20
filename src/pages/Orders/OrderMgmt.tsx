import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button, { ButtonProps } from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import { HiExclamation } from 'react-icons/hi';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import orderTabList from './orderTabList';
import { orderStatList } from '@utils/optionUtils';
import {
  BulkEditButton,
  CancelButton,
  PickupButton,
  PrintButton,
} from '@components/Button/ActionButton';
import UpdButton from '@components/Button/ActionButton/UpdButton';
import StatusTag from '@components/Tag/StatusTag';
import Popover from '@components/Popover';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import {
  orderTrackNumUpdAPI,
  orderListAPI,
  orderPickupUpdAPI,
  orderCancelAPI,
  orderBulkInvoicesAPI,
  orderInvoiceAPI,
} from '@api/services/orderAPI';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { ActionModal } from '@components/Modal';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import { getOrderDetails } from './orderUtils';

const OrderMgmt = () => {
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
  const defPg = 10;

  const getTableData = (isMounted: boolean = true) => {
    setSelected([]);
    setTableLoading(true);
    if (!searchParams.has('limit')) {
      setSearchParams(addSearchParams(searchParams, { limit: String(defPg) }));
    }
    orderListAPI(location.search)
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

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showActionSuccessMsg = (
    action: 'update' | 'invoice',
    isMulti: boolean = true
  ) => {
    messageApi.open(
      actionSuccessMsg(
        action === 'invoice' ? 'Invoice' : 'Order',
        action,
        isMulti ? selected.length : 1
      )
    );
  };

  const genInvoiceBtn = (props: ButtonProps) => (
    <PrintButton
      onClick={() => {
        ActionModal.show('invoice', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );
            await orderBulkInvoicesAPI(
              selectedKeys.map((key) => {
                return key;
              })
            )
              .then((res) => {
                showActionSuccessMsg('invoice');
              })
              .catch((err) => {
                if (err.response?.status !== 401) {
                  showServerErrMsg();
                }
              });
          },
        });
      }}
    >
      Generate Invoice(s)
    </PrintButton>
  );

  const pickupBtn = (props: ButtonProps) => (
    <PickupButton
      type='primary'
      onClick={() => {
        ActionModal.show('pickup', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );
            await orderPickupUpdAPI(
              selectedKeys.map((key) => {
                return { id: key };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('update');
              })
              .catch((err) => {
                if (err.response?.status !== 401) {
                  showServerErrMsg();
                }
              });
          },
        });
      }}
      {...props}
    />
  );

  const cancelBtn = (props: ButtonProps) => (
    <CancelButton
      type='primary'
      onClick={() => {
        ActionModal.show('cancel', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );
            await orderCancelAPI(
              selectedKeys.map((key) => {
                return { id: key };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('update');
              })
              .catch((err) => {
                if (err.response?.status !== 401) {
                  showServerErrMsg();
                }
              });
          },
        });
      }}
      {...props}
    />
  );

  const bulkUpdBtn = (props: ButtonProps) => (
    <BulkEditButton
      onClick={() => {
        ActionModal.show('orderBulkUpd', {
          onOk: async (data) => {
            await orderTrackNumUpdAPI(data)
              .then(() => {
                getTableData();
                showActionSuccessMsg('update');
              })
              .catch((err) => {
                if (err.response?.status !== 401) {
                  showServerErrMsg();
                }
              });
          },
        });
      }}
      {...props}
    />
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: genInvoiceBtn,
      key: 'genInvoice',
      fltr: [
        { fld: 'status', value: 'cancel', rel: 'neq' },
        { fld: 'status', value: 'unpaid', rel: 'neq' },
      ],
    },
    {
      element: bulkUpdBtn,
      key: 'bulkUpd',
      fltr: [
        { fld: 'shipment', value: 'shipping', rel: 'eq' },
        { fld: 'status', value: 'cancel', rel: 'neq' },
        { fld: 'status', value: 'completed', rel: 'neq' },
        { fld: 'status', value: 'unpaid', rel: 'neq' },
      ],
    },
    {
      element: pickupBtn,
      key: 'pickup',
      fltr: [
        { fld: 'shipment', value: 'pickup', rel: 'eq' },
        { fld: 'status', value: 'toPick', rel: 'eq' },
      ],
    },
    {
      element: cancelBtn,
      key: 'cancel',
      fltr: [
        { fld: 'status', value: 'shipping', rel: 'neq' },
        { fld: 'status', value: 'completed', rel: 'neq' },
        { fld: 'status', value: 'cancel', rel: 'neq' },
      ],
    },
  ];

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((order) =>
      selectedKeys.some((selected) => selected === order.id)
    );
    setSelected(getOrderDetails(selectedRecord));
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

  const orderMgmtColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    defaultSortOrder?: 'ascend' | 'descend';
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Order Number',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      defaultSortOrder: getSortOrder('id'),
      fixed: 'left',
      width: 160,
      render: (data: number) => (
        <div className='text-button-wrapper'>
          <Text
            strong
            className='text-button'
            onClick={() => {
              navigate(`/order/${data}`);
            }}
          >
            #{data}
          </Text>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: ['cust_name', 'email'],
      key: 'email',
      sorter: true,
      defaultSortOrder: getSortOrder('email'),
      width: 200,
      render: (_: any, data: { [x: string]: string }) => {
        return (
          <Space direction='vertical'>
            {data?.cust_name && (
              <Text strong type='secondary' className='text-break'>
                {data?.cust_name}
              </Text>
            )}
            <Text type='secondary' className='text-break'>
              {data?.email}
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Customer Type',
      dataIndex: 'cust_type',
      key: 'cust_type',
      sorter: true,
      defaultSortOrder: getSortOrder('cust_type'),
      width: 150,
      render: (type: string) => (
        <Text type='secondary'>
          {type === 'agent'
            ? 'Agent'
            : type === 'drpshpr'
            ? 'Dropshipper'
            : type === 'cust'
            ? 'Direct Customer'
            : 'Unregistered Customer'}
        </Text>
      ),
    },
    {
      title: 'Order Time',
      dataIndex: 'order_time',
      key: 'order_time',
      sorter: true,
      defaultSortOrder: getSortOrder('order_time'),
      width: 150,
    },
    {
      title: 'Tracking Number',
      dataIndex: ['track_num', 'status', 'shipment'],
      key: 'track_num',
      width: 150,
      render: (_: any, data: { [x: string]: string }) =>
        data?.track_num !== null ? (
          <Button
            type='link'
            color='info'
            onClick={() => {
              window['linkTrack'](data?.track_num);
            }}
          >
            #{data?.track_num}
          </Button>
        ) : data?.status === 'cancel' || data?.shipment === 'pickup' ? (
          '-'
        ) : (
          <Popover content='Please update the tracking number'>
            <Space size={5}>
              <HiExclamation size={20} className='color-warning' />
              <Text strong className='color-warning'>
                Not found
              </Text>
            </Space>
          </Popover>
        ),
    },
    {
      title: 'Amount',
      dataIndex: 'total_amt',
      key: 'total_amt',
      sorter: true,
      defaultSortOrder: getSortOrder('total_amt'),
      width: 100,
      render: (amount: string) => (
        <Text strong>{moneyFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 130,
      render: (status: string) => (
        <StatusTag status={status} statusList={orderStatList} minWidth='90%' />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (data: any) => (
        <Space direction='vertical' size={5}>
          {!['cancel', 'unpaid'].includes(data?.status) && (
            <PrintButton
              type='link'
              color='info'
              onClick={() => {
                setSelected(getOrderDetails([data]));
                ActionModal.show('invoice', {
                  onOk: async () => {
                    await orderInvoiceAPI(data?.id)
                      .then((res) => {
                        showActionSuccessMsg('invoice', false);
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
          )}
          {!['completed', 'cancel', 'unpaid'].includes(data?.status) &&
            data?.shipment === 'shipping' && (
              <UpdButton
                type='link'
                color='info'
                onClick={() => {
                  setSelected(getOrderDetails([data]));
                  ActionModal.show('orderBulkUpd', {
                    onOk: async (data) => {
                      await orderTrackNumUpdAPI(data)
                        .then(() => {
                          getTableData();
                          showActionSuccessMsg('update', false);
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
            )}
          {!['completed', 'cancel', 'unpaid'].includes(data?.status) &&
            data?.shipment === 'pickup' && (
              <PickupButton
                type='link'
                color='info'
                onClick={() => {
                  setSelected(getOrderDetails([data]));
                  ActionModal.show('pickup', {
                    onOk: async () => {
                      await orderPickupUpdAPI([{ id: data?.id }])
                        .then(() => {
                          getTableData();
                          showActionSuccessMsg('update', false);
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
            )}
          {['unpaid', 'toShip', 'toPick'].includes(data?.status) && (
            <CancelButton
              type='link'
              color='info'
              onClick={() => {
                setSelected(getOrderDetails([data]));
                ActionModal.show('cancel', {
                  onOk: async () => {
                    await orderCancelAPI([{ id: data?.id }])
                      .then(() => {
                        getTableData();
                        showActionSuccessMsg('update', false);
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
          )}
          {['cancel'].includes(data?.status) && '-'}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='order-mgmt'>
        <MainCard
          tabList={orderTabList}
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
          <Space direction='vertical' size={40} className='full-width'>
            <Space direction='vertical' size={15} className='full-width'>
              <Row justify='space-between'>
                <Col>
                  <BoldTitle level={4}>Order List</BoldTitle>
                </Col>
                <Col>
                  <Button
                    type='primary'
                    onClick={() => navigate(findRoutePath('orderAdd'))}
                  >
                    Add Order
                  </Button>
                </Col>
              </Row>
              <InformativeTable
                rowKey='id'
                dataSource={list}
                columns={orderMgmtColumns}
                buttons={onSelectBtn}
                loading={tableLoading}
                defPg={defPg}
                currentPg={currentPg}
                totalRecord={recordCount}
                onSelectChange={handleSelectChange}
                scroll={{ x: 1300 }}
              />
            </Space>
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='order' dataSource={selected} />
    </Layout>
  );
};

export default OrderMgmt;
