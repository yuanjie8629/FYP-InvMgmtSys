import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Button, { ButtonProps } from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
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
import { addSearchParams, getSortOrder, parseURL } from '@utils/urlUtls';
import CustRegFilterInputs from './CustRegFilterInputs';

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
  const [currentPg, setCurrentPg] = useState(1);
  const defPg = 10;

  const getTableData = (isMounted: boolean = true) => {
    setSelected([]);
    setTableLoading(true);
    if (!searchParams.has('limit')) {
      setSearchParams(addSearchParams(searchParams, { limit: String(defPg) }));
    }
    custRegListAPI(location.search)
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
    selectedRecord.forEach((record) =>
      selected.push({
        key: record.id,
        title: record.name,
        desc: custCat.find((cust) => cust.value === record.position)?.label,
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
      searchParams.delete('offset');
      setSearchParams(addSearchParams(searchParams, { type: key }));
    } else {
      searchParams.delete('type');
      searchParams.delete('offset');
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
      fltr: [{ fld: 'accept', value: undefined, rel: 'eq' }],
    },
    {
      element: rejectBtn,
      key: 'reject',
      fltr: [{ fld: 'accept', value: undefined, rel: 'eq' }],
    },
  ];

  const custRegColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    defaultSortOrder?: 'ascend' | 'descend';
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Registration ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      defaultSortOrder: getSortOrder('id'),
      width: 150,
      render: (data: number) => (
        <div className='text-button-wrapper'>
          <Text
            strong
            className='text-button'
            onClick={() => {
              navigate(`/customer/registration/${data}`);
            }}
          >
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
      defaultSortOrder: getSortOrder('name'),
      width: 300,
    },
    {
      title: 'Register For',
      dataIndex: 'position',
      key: 'position',
      sorter: true,
      defaultSortOrder: getSortOrder('position'),
      width: 130,
      render: (type: string) => (
        <Text type='secondary'>
          {custCat.find((cust) => cust.value === type)?.label}
        </Text>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
      defaultSortOrder: getSortOrder('gender'),
      width: 100,
      render: (gender: string) => (
        <Text type='secondary'>
          {genderCat.find((cat) => cat.value === gender)?.label}
        </Text>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      defaultSortOrder: getSortOrder('created_at'),
      width: 160,
    },
    {
      title: 'Contact Number',
      dataIndex: 'phone_num',
      key: 'phone_num',
      sorter: true,
      defaultSortOrder: getSortOrder('phone_num'),
      width: 160,
      render: (phoneNum: string) => (
        <Text type='secondary'>
          {phoneNum.slice(0, 3)}-{phoneNum.slice(3)}
        </Text>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (data: any) => {
        if (data.accept === true) {
          return (
            <Text strong type='success'>
              Accepted
            </Text>
          );
        } else if (data.accept === false) {
          return (
            <Text strong type='danger'>
              Rejected
            </Text>
          );
        } else {
          return (
            <Space direction='vertical' size={5}>
              <AcceptButton
                type='link'
                onClick={() => {
                  setSelected(getCustDetails([data]));
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
                  setSelected(getCustDetails([data]));
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
          );
        }
      },
    },
  ];

  return (
    <Layout>
      <MainCardContainer className='cust-reg'>
        <MainCard
          tabList={custTabList}
          activeTabKey={
            searchParams.get('type') === null ? 'all' : searchParams.get('type')
          }
          onTabChange={handleTabChange}
        >
          <CustRegFilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={15} className='full-width'>
            <Row justify='space-between'>
              <Col>
                <BoldTitle level={4}>
                  Agent/Dropshipper Registration List
                </BoldTitle>
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
              currentPg={currentPg}
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
