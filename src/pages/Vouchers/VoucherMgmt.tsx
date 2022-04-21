import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { MdAllInclusive, MdSync } from 'react-icons/md';
import { moneyFormatter, percentFormatter } from '@utils/numUtils';
import { sortByOrder } from '@utils/arrayUtils';
import {
  ActivateButton,
  DeleteButton,
  EditButton,
  HideButton,
} from '@components/Button/ActionButton';
import StatusTag from '@components/Tag/StatusTag';
import { voucherStatList } from '@utils/optionUtils';
import Tooltip from '@components/Tooltip';
import { BoldTitle } from '@components/Title';
import {
  voucherBulkDelAPI,
  voucherBulkUpdAPI,
  voucherDelAPI,
  voucherUpdAPI,
  voucherViewAPI,
} from '@api/services/voucherAPI';
import voucherTabList from './voucherTabList';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { ActionModal } from '@components/Modal';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import { MessageContext } from '@contexts/MessageContext';

const VoucherMgmt = () => {
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
    voucherViewAPI(location.search)
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
      actionSuccessMsg('Voucher', action, isMulti ? selected.length : 1)
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

            await voucherBulkUpdAPI(
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

            await voucherBulkUpdAPI(
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
            await voucherBulkDelAPI(selectedKeys)
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

  const getVoucherDetails = (selectedRecord) => {
    const selected = [];
    selectedRecord.forEach((record) =>
      selected.push({
        key: record.id,
        title: record.code,
      })
    );
    return selected;
  };

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((voucher) =>
      selectedKeys.some((selected) => selected === voucher.id)
    );

    setSelected(getVoucherDetails(selectedRecord));
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
  const voucherMgmtColumns: {
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
      title: 'Voucher Code',
      dataIndex: ['code', 'auto_apply'],
      key: 'code',
      sorter: true,
      defaultSortOrder: getSortOrder('code'),
      fixed: 'left',
      width: 150,
      render: (_: any, data: { [x: string]: boolean }) => (
        <Row>
          <Col span={20} className='text-button-wrapper'>
            <Text
              strong
              className='text-button'
              onClick={() => {
                navigate(`/voucher/${data.id}`);
              }}
            >
              {data.code}
            </Text>
          </Col>
          <Col span={4} className='justify-end'>
            {data.auto_apply === true && (
              <Tooltip title='Automatically applied'>
                <MdSync />
              </Tooltip>
            )}
          </Col>
        </Row>
      ),
    },
    {
      title: 'Discount Details',
      dataIndex: [
        'type',
        'discount',
        'min_spend',
        'max_discount',
        'usage_limit',
      ],
      key: 'type',
      width: 280,
      render: (_: any, data) => {
        return (
          <>
            <Text strong type='secondary'>
              {data.type === 'amount'
                ? moneyFormatter(parseFloat(data.discount))
                : percentFormatter(parseFloat(data.discount))}{' '}
              off
            </Text>
            <ul>
              {!(data.min_spend === null || data.min_spend === undefined) && (
                <li>
                  Min spend of {moneyFormatter(parseFloat(data.min_spend))}
                </li>
              )}
              {!(data.max_disc === null || data.max_disc === undefined) && (
                <li>Capped at {moneyFormatter(parseFloat(data.max_disc))}</li>
              )}
              {!(
                data.usage_limit === null ||
                data.usage_limit === undefined ||
                data.usage_limit === -1
              ) && <li>Limit for {data.usage_limit} transactions per user</li>}
            </ul>
          </>
        );
      },
    },
    {
      title: 'Customer Type',
      dataIndex: 'cust_type',
      key: 'cust_type',
      width: 150,
      render: (types: []) => (
        <Space direction='vertical'>
          {sortByOrder(types).map((type: string) => (
            <Text type='secondary'>
              {type === 'agent'
                ? 'Agent'
                : type === 'drpshpr'
                ? 'Dropshipper'
                : type === 'cust'
                ? 'Direct Customer'
                : null}
            </Text>
          ))}
        </Space>
      ),
    },
    {
      title: 'Availability',
      dataIndex: 'total_amt',
      key: 'total_amt',
      sorter: true,
      defaultSortOrder: getSortOrder('total_amt'),
      width: 100,
      render: (availability: number) =>
        availability === -1 ? (
          <Tooltip title='Unlimited'>
            <MdAllInclusive />
          </Tooltip>
        ) : (
          availability
        ),
    },
    {
      title: 'Start Date',
      dataIndex: 'avail_start_dt',
      key: 'avail_start_dt',
      sorter: true,
      defaultSortOrder: getSortOrder('avail_start_dt'),
      width: 150,
    },
    {
      title: 'End Date',
      dataIndex: 'avail_end_dt',
      key: 'avail_end_dt',
      sorter: true,
      defaultSortOrder: getSortOrder('avail_end_dt'),
      width: 150,
      render: (endTm: string) =>
        !(endTm === null || endTm === '31-12-9999') ? endTm : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (_: any, data: { [x: string]: any }) => (
        <StatusTag
          status={data.status}
          statusList={voucherStatList}
          dropdownStatus={['active', 'hidden']}
          onDropdownSelect={(selectedStatus) => {
            setSelected(getVoucherDetails([data]));
            ActionModal.show(
              selectedStatus === 'hidden' ? 'hide' : 'activate',
              {
                onOk: async () => {
                  await voucherUpdAPI(data.id, {
                    status: selectedStatus === 'hidden' ? 'hidden' : 'active',
                  })
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
      fixed: 'right',
      render: (_: any, data: { [x: string]: string }) => (
        <Space direction='vertical' size={5}>
          <EditButton
            type='link'
            color='info'
            onClick={() => {
              navigate(`/voucher/${data.id}`);
            }}
          />
          <DeleteButton
            type='link'
            color='info'
            onClick={() => {
              setSelected(getVoucherDetails([data]));
              ActionModal.show('delete', {
                onOk: async () => {
                  await voucherDelAPI(data.id)
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
      ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='voucher-mgmt'>
        <MainCard
          tabList={voucherTabList}
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
                <BoldTitle level={4}>Voucher List</BoldTitle>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('voucherAdd'))}
                >
                  Create Voucher
                </Button>
              </Col>
            </Row>
            <InformativeTable
              rowKey='id'
              dataSource={list}
              columns={voucherMgmtColumns}
              buttons={onSelectBtn}
              loading={tableLoading}
              defPg={defPg}
              currentPg={currentPg}
              totalRecord={recordCount}
              onSelectChange={handleSelectChange}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='voucher' dataSource={selected} />
    </Layout>
  );
};

export default VoucherMgmt;
