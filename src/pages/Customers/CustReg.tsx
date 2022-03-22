import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button, { ButtonProps } from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './CustMgmtFilterInputs';
import { Row, Space, Col, Typography } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { AcceptButton, RejectButton } from '@components/Button/ActionButton';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { custRegListAPI, custRegUpdAPI } from '@api/services/custAPI';
import { ActionModal } from '@components/Modal';
import { custCat, genderCat } from '@utils/optionUtils';
import { addSearchParams, parseURL } from '@utils/urlUtls';

const CustReg = () => {
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
    custRegListAPI(location.search)
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
    { key: 'agent', tab: 'Agent' },
    { key: 'drpshpr', tab: 'Dropshipper' },
  ];

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showActionSuccessMsg = (
    action: 'accept' | 'reject',
    isMulti: boolean = true
  ) => {
    messageApi.open(
      actionSuccessMsg('Customer', action, isMulti ? selected.length : 1)
    );
  };

  const getCustDetails = (selectedRecord) => {
    const selected = [];
    console.log(selectedRecord);
    selectedRecord.forEach((record) =>
      selected.push({
        key: record.id,
        title: record.name,
        desc: custCat.find((cust) => cust.value === record.cust_type).label,
      })
    );
    console.log(selected);
    return selected;
  };

  const handleSelectChange = (selectedKeys) => {
    console.log(selectedKeys);
    const selectedRecord = list.filter((prod) =>
      selectedKeys.some((selected) => selected === prod.id)
    );

    setSelected(getCustDetails(selectedRecord));
  };

  const handleTabChange = (key) => {
    if (key !== 'all') {
      setSearchParams(addSearchParams(searchParams, { status: key }));
    } else {
      searchParams.delete('status');
      setSearchParams(parseURL(searchParams));
    }
  };

  const acceptBtn = (props: ButtonProps) => (
    <AcceptButton
      type='primary'
      onClick={() => {
        ActionModal.show('accept', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );

            await custRegUpdAPI(
              selectedKeys.map((key) => {
                return { id: key, accept: true };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('accept');
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

  const rejectBtn = (props: ButtonProps) => (
    <RejectButton
      type='primary'
      onClick={() => {
        ActionModal.show('reject', {
          onOk: async () => {
            const selectedKeys = selected.map(
              (selectedItem) => selectedItem.key
            );

            await custRegUpdAPI(
              selectedKeys.map((key) => {
                return { id: key, accept: false };
              })
            )
              .then(() => {
                getTableData();
                showActionSuccessMsg('reject');
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
      element: acceptBtn,
      key: 'accept',
    },
    {
      element: rejectBtn,
      key: 'reject',
    },
  ];

  const custRegColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Registration ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      width: 150,
      render: (data: number) => (
        <div className='text-button-wrapper'>
          <Text strong className='text-button'>
            #{data}
          </Text>
        </div>
      ),
    },
    {
      title: 'Applicant',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 300,
    },
    {
      title: 'Register For',
      dataIndex: 'position',
      key: 'position',
      sorter: true,
      width: 130,
      render: (type: string) => (
        <Text type='secondary'>
          {custCat.find((cust) => cust.value === type).label}
        </Text>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
      width: 100,
      render: (gender: string) => (
        <Text type='secondary'>
          {genderCat.find((cat) => cat.value === gender).label}
        </Text>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'created_at',
      key: 'regDt',
      sorter: true,
      width: 160,
    },
    {
      title: 'Contact Number',
      dataIndex: 'phone_num',
      key: 'phone_num',
      sorter: true,
      width: 160,
    },

    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (data: any) => (
        <Space direction='vertical' size={5}>
          <AcceptButton
            type='link'
            onClick={() => {
              setSelected(getCustDetails(data));
              ActionModal.show('accept', {
                onOk: async () => {
                  await custRegUpdAPI([
                    {
                      id: data.id,
                      accept: true,
                    },
                  ])
                    .then((res) => {
                      getTableData();
                      showActionSuccessMsg('accept', false);
                    })
                    .catch((err) => {
                      showServerErrMsg();
                    });
                },
              });
            }}
          />
          <RejectButton
            type='link'
            onClick={() => {
              setSelected(getCustDetails(data));
              ActionModal.show('reject', {
                onOk: async () => {
                  await custRegUpdAPI([
                    {
                      id: data.id,
                      accept: false,
                    },
                  ])
                    .then((res) => {
                      getTableData();
                      showActionSuccessMsg('reject', false);
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
      <MainCardContainer className='cust-reg'>
        <MainCard
          tabList={custTabList}
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
              columns={custRegColumns}
              buttons={onSelectBtn}
              loading={tableLoading}
              defPg={defPg}
              totalRecord={recordCount}
              onSelectChange={handleSelectChange}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
      <ActionModal recordType='customer' dataSource={selected} />
    </Layout>
  );
};

export default CustReg;
