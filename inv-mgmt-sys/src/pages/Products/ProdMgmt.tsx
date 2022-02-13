import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Row, Space, Col, Typography, Image, message } from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import prodList from './prodList';
import prodTabList from './prodTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import { prodStatList } from '@utils/optionUtils';
import {
  ActivateButton,
  DeleteButton,
  EditButton,
  HideButton,
} from '@/components/Button/ActionButton';
import StatusTag from '@/components/Tag/StatusTag';
import { BoldTitle } from '@/components/Title';
import { ActionModal } from '@/components/Modal';
import fetchMock from 'fetch-mock';
import { ActionModalContentProps } from '@/components/Modal/ActionModal';

fetchMock.mock('http://example.com', 200, { delay: 3000 });

const ProdMgmt = () => {
  const { Text } = Typography;

  let navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [prodListFltr, setProdListFltr] = useState(prodList);
  const [selectedProds, setSelectedProds] = useState([]);
  let [searchParams, setSearchParams] = useSearchParams();
  useEffect(
    () =>
      setProdListFltr(
        prodList.filter((prod) =>
          searchParams.get('stat') !== null
            ? prod.prodStat === searchParams.get('stat')
            : true
        )
      ),
    [searchParams]
  );

  const actionModalProps: ActionModalContentProps = {
    recordType: 'product',
    dataSource: selectedProds,
  };

  const showActionMsg = (action: string, multi: boolean = false) => {
    messageApi.open({
      key: action,
      type: 'success',
      content: `${multi ? selectedProds.length : 1} Products ${
        action === 'delete' ? 'Deleted' : 'Hidden'
      } Successfully`,
    });
    setTimeout(() => message.destroy(action), 2000);
  };

  const activateBtn = (props: any) => <ActivateButton type='primary' />;

  const hideBtn = (props: any) => (
    <HideButton
      type='primary'
      color='grey'
      onClick={() => {
        ActionModal.show('hide', {
          onOk: () =>
            fetch('http://example.com').then(() => {
              showActionMsg('hide', true);
            }),
          multiItem: true,
        });
      }}
    />
  );

  const deleteBtn = (props: any) => (
    <DeleteButton
      type='primary'
      onClick={() => {
        ActionModal.show('delete', {
          onOk: () =>
            fetch('http://example.com').then(() => {
              showActionMsg('delete', true);
            }),
          multiItem: true,
        });
      }}
    />
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: activateBtn,
      key: 'activate',
      fltr: [{ fld: 'prodStat', value: 'hidden', rel: 'eq' }],
    },
    {
      element: hideBtn,
      key: 'hide',
      fltr: [{ fld: 'prodStat', value: 'active', rel: 'eq' }],
    },
    {
      element: deleteBtn,
      key: 'delete',
    },
  ];

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
      dataIndex: ['prodNm', 'prodCat', 'prodImg'],
      key: 'prod',
      sorter: true,
      width: 400,
      render: (_: any, data: { [x: string]: string }) => (
        <Row gutter={5}>
          <Col xs={9} xl={7}>
            <Image
              alt={data['prodNm']}
              src={data['prodImg']}
              height={100}
              width={100}
            />
          </Col>
          <Col xs={15} xl={17}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text strong className='text-button'>
                  {data['prodNm']}
                </Text>
              </div>
              <Text type='secondary' className='text-sm text-break'>
                {data['prodCat']}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'prodSKU',
      key: 'prodSKU',
      sorter: true,
      width: 160,
    },
    {
      title: 'Price',
      dataIndex: 'prodPrice',
      key: 'prodPrice',
      sorter: true,
      width: 150,
      render: (amount: number) => (
        <Text type='secondary'>{moneyFormatter(amount)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'prodStock',
      key: 'prodStock',
      sorter: true,
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'prodStat',
      key: 'prodStat',
      width: 150,
      render: (status: string) => (
        <StatusTag
          status={status}
          statusList={prodStatList}
          dropdownStatus={['active', 'hidden']}
          onDropdownSelect={(selectedStatus) => {
            console.log(selectedStatus);
            if (selectedStatus === 'hidden') {
              ActionModal.show('hide', {
                onOk: () =>
                  fetch('http://example.com').then(() => {
                    showActionMsg('hide');
                  }),
              });
            }
          }}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: () => (
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
              ActionModal.show('delete', {
                onOk: () =>
                  fetch('http://example.com').then(() => {
                    showActionMsg('delete');
                  }),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      {contextHolder}
      <MainCardContainer className='prod-mgmt'>
        <MainCard
          tabList={prodTabList}
          activeTabKey={
            searchParams.get('stat') === null ? 'all' : searchParams.get('stat')
          }
          onTabChange={(key) => {
            setSearchParams(key !== 'all' ? { stat: key } : {});
          }}
        >
          <FilterInputs />
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
              dataSource={prodListFltr}
              columns={prodMgmtColumns}
              buttons={onSelectBtn}
              defPg={5}
              onSelectChange={(selectedKeys) => {
                const selectedProd = prodListFltr.filter((prod) =>
                  selectedKeys.some((selected) => selected === prod.key)
                );
                const selectedProds = [];
                selectedProd.forEach((prod) =>
                  selectedProds.push({
                    key: prod.key,
                    title: prod.prodNm,
                    icon: (
                      <Image
                        src={prod.prodImg}
                        height={40}
                        width={40}
                        preview={false}
                      />
                    ),
                  })
                );
                setSelectedProds(selectedProds);
              }}
            />
          </Space>
        </MainCard>
      </MainCardContainer>

      <ActionModal {...actionModalProps} />
    </Layout>
  );
};

export default ProdMgmt;
