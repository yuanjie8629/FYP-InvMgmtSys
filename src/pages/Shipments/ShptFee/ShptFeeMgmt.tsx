import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { DeleteButton, EditButton } from '@components/Button/ActionButton';

import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';

import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { ActionModal } from '@components/Modal';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import FilterInputs from './ShptFeeFilterInputs';
import {
  shippingFeeBulkDelAPI,
  shippingFeeDelAPI,
  shippingFeeListAPI,
} from '@api/services/shipmentAPI';

const ShptFeeMgmt = () => {
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
    shippingFeeListAPI(location.search)
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

  const shptFeeTabList = [{ key: 'all', tab: 'All' }];

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showActionSuccessMsg = (action: 'delete', isMulti: boolean = true) => {
    messageApi.open(
      actionSuccessMsg('Shipping Fee', action, isMulti ? selected.length : 1)
    );
  };

  const deleteBtn = (props: any) => (
    <DeleteButton
      type='primary'
      onClick={() => {
        ActionModal.show('delete', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );
            await shippingFeeBulkDelAPI(selectedKeys)
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
      element: deleteBtn,
      key: 'delete',
    },
  ];

  const getShptFeeDetails = (selectedRecord) => {
    const selected = [];
    selectedRecord.forEach((record) =>
      selected.push({
        key: record.id,
        title: record.location,
        desc: `${record.weight_start}g - ${
          record.weight_end
        }g     (${moneyFormatter(parseFloat(record.ship_fee))})`,
      })
    );
    return selected;
  };

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((shptFee) =>
      selectedKeys.some((selected) => selected === shptFee.id)
    );

    setSelected(getShptFeeDetails(selectedRecord));
  };

  const handleTabChange = (key) => {
    if (key !== 'all') {
      searchParams.delete('offset');
      setSearchParams(addSearchParams(searchParams, { type: key }));
    } else {
      searchParams.delete('type');
      searchParams.delete('offset');
      setSearchParams(parseURL(searchParams));
    }
  };

  const ShptFeeMgmtColumns: {
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
      title: 'Location',
      dataIndex: ['location', 'id'],
      key: 'location',
      sorter: true,
      defaultSortOrder: getSortOrder('location'),
      fixed: 'left',
      width: 150,
      render: (_: any, data: { [x: string]: string }) => (
        <div className='text-button-wrapper'>
          <Text
            strong
            className='text-button'
            onClick={() => {
              navigate(`/shipment/shipping_fee/${data.location}`);
            }}
          >
            #{data.location}
          </Text>
        </div>
      ),
    },
    {
      title: 'Starting Weight (g)',
      dataIndex: 'weight_start',
      key: 'weight_start',
      sorter: true,
      defaultSortOrder: getSortOrder('weight_start'),
      width: 150,
    },
    {
      title: 'Ending Weight (g)',
      dataIndex: 'weight_end',
      key: 'weight_end',
      sorter: true,
      defaultSortOrder: getSortOrder('weight_end'),
      width: 150,
    },
    {
      title: 'Shipping Fee',
      dataIndex: 'ship_fee',
      key: 'ship_fee',
      sorter: true,
      defaultSortOrder: getSortOrder('ship_fee'),
      width: 160,
      render: (amount: string) =>
        amount !== undefined ? (
          <Text strong>{moneyFormatter(parseFloat(amount))}</Text>
        ) : (
          '-'
        ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (data: any) => (
        <Space direction='vertical' size={5}>
          <EditButton
            type='link'
            color='info'
            onClick={() => {
              navigate(`/shipment/shipping_fee/${data.location}`);
            }}
          />
          <DeleteButton
            type='link'
            color='info'
            onClick={() => {
              setSelected(getShptFeeDetails([data]));
              ActionModal.show('delete', {
                onOk: async () => {
                  await shippingFeeDelAPI(data.id)
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
      <MainCardContainer className='shptFee-mgmt'>
        <MainCard
          tabList={shptFeeTabList}
          activeTabKey={
            searchParams.get('type') === null ? 'all' : searchParams.get('type')
          }
          onTabChange={handleTabChange}
        >
          <FilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={15} className='full-width'>
            <Row justify='space-between'>
              <Col>
                <BoldTitle level={4}>Shipping Fees List</BoldTitle>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('shptFeeAdd'))}
                >
                  Add Shipping Fees
                </Button>
              </Col>
            </Row>
            <InformativeTable
              rowKey='id'
              dataSource={list}
              columns={ShptFeeMgmtColumns}
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
      <ActionModal recordType='shipping fee' dataSource={selected} />
    </Layout>
  );
};

export default ShptFeeMgmt;
