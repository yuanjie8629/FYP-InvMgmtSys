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
import { DeleteButton } from '@components/Button/ActionButton';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { ActionModal } from '@components/Modal';
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import FilterInputs from './PickupFilterInputs';
import {
  pickupLocBulkDelAPI,
  pickupLocDelAPI,
  pickupLocListAPI,
} from '@api/services/shipmentAPI';

const PickupMgmt = () => {
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
    pickupLocListAPI(location.search)
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

  const pickupTabList = [{ key: 'all', tab: 'All' }];

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showActionSuccessMsg = (action: 'delete', isMulti: boolean = true) => {
    messageApi.open(
      actionSuccessMsg('Pickup Location', action, isMulti ? selected.length : 1)
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
            await pickupLocBulkDelAPI(selectedKeys)
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
      element: deleteBtn,
      key: 'delete',
    },
  ];

  const getPickupLocDetails = (selectedRecord) => {
    const selected = [];
    selectedRecord.forEach((record) =>
      selected.push({
        key: record.id,
        title: record.location,
      })
    );
    return selected;
  };

  const handleSelectChange = (selectedKeys) => {
    const selectedRecord = list.filter((pickup) =>
      selectedKeys.some((selected) => selected === pickup.id)
    );

    setSelected(getPickupLocDetails(selectedRecord));
  };

  const handleTabChange = (key) => {
    if (key !== 'all') {
      setSearchParams(addSearchParams(searchParams, { type: key }));
    } else {
      searchParams.delete('type');
      setSearchParams(parseURL(searchParams));
    }
  };

  const PickupMgmtColumns: {
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
              navigate(`/shipment/pickup/${data.id}`);
            }}
          >
            #{data.location}
          </Text>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (data: any) => (
        <DeleteButton
          type='link'
          color='info'
          onClick={() => {
            setSelected(getPickupLocDetails([data]));
            ActionModal.show('delete', {
              onOk: async () => {
                await pickupLocDelAPI(data.id)
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
      ),
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='pickup-mgmt'>
        <MainCard
          tabList={pickupTabList}
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
                <BoldTitle level={4}>Pickup Location List</BoldTitle>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate(findRoutePath('pickupAdd'))}
                >
                  Add Pickup Location
                </Button>
              </Col>
            </Row>
            <InformativeTable
              rowKey='id'
              dataSource={list}
              columns={PickupMgmtColumns}
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
      <ActionModal recordType='pickup location' dataSource={selected} />
    </Layout>
  );
};

export default PickupMgmt;
