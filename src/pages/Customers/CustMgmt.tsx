import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button, { ButtonProps } from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import CustMgmtFilterInputs from './CustMgmtFilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { ActivateButton, SuspendButton } from '@components/Button/ActionButton';
import StatusTag from '@components/Tag/StatusTag';
import { custCat, custStatList } from '@utils/optionUtils';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import { custStatusUpdAPI, custListAPI } from '@api/services/custAPI';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { ActionModal } from '@components/Modal';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';

const CustMgmt = () => {
  const { Text } = Typography;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi] = useContext(MessageContext);
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const [selected, setSelected] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const defPg = 10;

  const getTableData = (isMounted: boolean = true) => {
    setSelected([]);
    setTableLoading(true);
    custListAPI(location.search)
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

  const custTabList = [
    { key: 'all', tab: 'All' },
    { key: 'cust', tab: 'Direct Customer' },
    { key: 'agent', tab: 'Agent' },
    { key: 'drpshpr', tab: 'Dropshipper' },
  ];

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showActionSuccessMsg = (
    action: 'activate' | 'suspend',
    isMulti: boolean = true
  ) => {
    messageApi.open(
      actionSuccessMsg('Customer', action, isMulti ? selected.length : 1)
    );
  };

  const ActivateBtn = (props: ButtonProps) => (
    <ActivateButton
      type='primary'
      onClick={() => {
        ActionModal.show('activate', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );

            await custStatusUpdAPI(
              selectedKeys.map((key) => {
                return { id: key, is_active: true };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('activate');
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
      {...props}
    />
  );

  const SuspendBtn = (props: ButtonProps) => (
    <SuspendButton
      type='primary'
      onClick={() => {
        ActionModal.show('suspend', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );

            await custStatusUpdAPI(
              selectedKeys.map((key) => {
                return { id: key, is_active: false };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('suspend');
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
      {...props}
    />
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: ActivateBtn,
      key: 'activate',
      fltr: [
        { fld: 'is_active', value: false, rel: 'eq' },
        { fld: 'cust_type', value: 'cust', rel: 'neq' },
      ],
    },
    {
      element: SuspendBtn,
      key: 'suspend',
      fltr: [
        { fld: 'is_active', value: true, rel: 'eq' },
        { fld: 'cust_type', value: 'cust', rel: 'neq' },
      ],
    },
  ];

  const getCustDetails = (selectedRecord) => {
    const selected = [];
    selectedRecord.forEach((record) =>
      selected.push({
        key: record.id,
        title: record.name,
        desc: custCat.find((cust) => cust.value === record.cust_type)?.label,
      })
    );
    return selected;
  };

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((cust) =>
      selectedKeys.some((selected) => selected === cust.id)
    );

    setSelected(getCustDetails(selectedRecord));
  };

  const handleTabChange = (key) => {
    if (key !== 'all') {
      setSearchParams(addSearchParams(searchParams, { type: key }));
    } else {
      searchParams.delete('type');
      setSearchParams(parseURL(searchParams));
    }
  };

  const custMgmtColumns: {
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
      title: 'Customer ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      defaultSortOrder: getSortOrder('id'),
      fixed: 'left',
      width: 150,
      render: (data: number) => (
        <div className='text-button-wrapper'>
          <Text
            strong
            className='text-button'
            onClick={() => {
              navigate(`/customer/${data}`);
            }}
          >
            #{data}
          </Text>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: ['name', 'email'],
      key: 'name',
      sorter: true,
      defaultSortOrder: getSortOrder('name'),
      width: 200,
      render: (_: any, data: { [x: string]: string }) => (
        <Space direction='vertical' size={5}>
          {data.name && (
            <Text strong type='secondary'>
              {data.name}
            </Text>
          )}
          <Text strong={data.name ? true : false} type='secondary'>
            {data.email}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Customer Type',
      dataIndex: 'cust_type',
      key: 'type',
      sorter: true,
      defaultSortOrder: getSortOrder('cust_type'),
      width: 150,
      render: (type: string) => (
        <Text type='secondary'>
          {custCat.find((cust) => cust.value === type)?.label}
        </Text>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'date_joined',
      key: 'date_joined',
      sorter: true,
      defaultSortOrder: getSortOrder('date_joined'),
      width: 160,
    },
    {
      title: 'Sales per Month',
      dataIndex: 'sales_per_month',
      key: 'sales_per_month',
      sorter: true,
      defaultSortOrder: getSortOrder('sales_per_month'),
      width: 160,
      render: (amount: string) =>
        amount !== undefined ? (
          <Text strong>{moneyFormatter(parseFloat(amount))}</Text>
        ) : (
          '-'
        ),
    },
    {
      title: 'Last Order Date',
      dataIndex: 'last_order_dt',
      key: 'last_order_dt',
      sorter: true,
      defaultSortOrder: getSortOrder('last_order_dt'),
      width: 150,
      render: (date: string) =>
        date !== undefined ? <Text strong>{date}</Text> : '-',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center' as const,
      width: 130,
      render: (active: string) => (
        <StatusTag
          status={active ? 'active' : 'suspended'}
          statusList={custStatList}
          minWidth='90%'
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (data: any) =>
        data.cust_type === 'cust' ? (
          '-'
        ) : !data.is_active ? (
          <ActivateButton
            type='link'
            color='info'
            onClick={() => {
              setSelected(getCustDetails([data]));
              ActionModal.show('activate', {
                onOk: async () => {
                  await custStatusUpdAPI([
                    {
                      id: data.id,
                      is_active: true,
                    },
                  ])
                    .then((res) => {
                      getTableData();
                      showActionSuccessMsg('activate', false);
                    })
                    .catch((err) => {
                      showServerErrMsg();
                    });
                },
              });
            }}
          />
        ) : (
          <SuspendButton
            type='link'
            color='info'
            onClick={() => {
              setSelected(getCustDetails([data]));
              ActionModal.show('suspend', {
                onOk: async () => {
                  await custStatusUpdAPI([
                    {
                      id: data.id,
                      is_active: false,
                    },
                  ])
                    .then((res) => {
                      getTableData();
                      showActionSuccessMsg('suspend', false);
                    })
                    .catch((err) => {
                      showServerErrMsg();
                    });
                },
              });
            }}
          />
        ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='cust-mgmt'>
        <MainCard
          tabList={custTabList}
          activeTabKey={
            searchParams.get('type') === null ? 'all' : searchParams.get('type')
          }
          onTabChange={handleTabChange}
        >
          <CustMgmtFilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={15} className='full-width'>
            <Row justify='space-between'>
              <Col>
                <BoldTitle level={4}>Customer List</BoldTitle>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('custAdd'))}
                >
                  Add Customer
                </Button>
              </Col>
            </Row>
            <InformativeTable
              rowKey='id'
              dataSource={list}
              columns={custMgmtColumns}
              buttons={onSelectBtn}
              loading={tableLoading}
              defPg={defPg}
              totalRecord={recordCount}
              onSelectChange={handleSelectChange}
              scroll={{ x: 1200 }}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='customer' dataSource={selected} />
    </Layout>
  );
};

export default CustMgmt;
