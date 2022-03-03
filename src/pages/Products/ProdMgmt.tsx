import MainCard from '@components/Card/MainCard';
import Button from '@components/Button';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import {
  Row,
  Space,
  Col,
  Typography,
  Image,
  message,
  TablePaginationConfig,
} from 'antd';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import prodTabList from './prodTabList';
import React, { useEffect, useState } from 'react';
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
import { ActionModalContentProps } from '@components/Modal/ActionModal';
import { productPrevAPI } from '@api/services/productAPI';
import { addSearchParams } from '@utils/urlUtls';

const ProdMgmt = () => {
  const { Text } = Typography;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const [selected, setSelected] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>();
  const defPg = 5;

  useEffect(() => {
    if (pagination !== undefined) {
    } else
      setSearchParams(addSearchParams(searchParams, { limit: String(defPg) }));

    setTableLoading(true);
    productPrevAPI(location.search)
      .then((res) => {
        setList(res.data.results);
        setRecordCount(res.data.count);
      })
      .then(() => {
        setTableLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pagination]);

  const actionModalProps: ActionModalContentProps = {
    recordType: 'product',
    dataSource: selected,
  };

  const showActionMsg = (action: string, multi: boolean = false) => {
    messageApi.open({
      key: action,
      type: 'success',
      content: `${multi ? selected.length : 1} Products ${
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

  const handleSelectChange = (selectedKeys) => {
    const selectedProd = list.filter((prod) =>
      selectedKeys.some((selected) => selected === prod.key)
    );
    const selected = [];
    selectedProd.forEach((prod) =>
      selected.push({
        key: prod.key,
        title: prod.prodNm,
        icon: (
          <Image src={prod.prodImg} height={40} width={40} preview={false} />
        ),
      })
    );
    setSelected(selected);
  };

  const handleTabChange = (key) => {
    let currSearchParams = {};
    searchParams.forEach((value, key) => {
      key !== 'status' &&
        (currSearchParams = { ...currSearchParams, [key]: value });
    });
    setSearchParams(
      key !== 'all' ? { status: key, ...currSearchParams } : currSearchParams
    );
  };

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
      dataIndex: ['name', 'category', 'thumbnail'],
      key: 'name',
      sorter: true,
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
                <Text strong className='text-button'>
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
      width: 160,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      width: 150,
      render: (amount: string) => {
        let newAmt = parseFloat(amount);
        return <Text type='secondary'>{moneyFormatter(newAmt)}</Text>;
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <StatusTag
          status={status}
          statusList={prodStatList}
          dropdownStatus={['active', 'hidden']}
          onDropdownSelect={(selectedStatus) => {
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
              dataSource={list}
              columns={prodMgmtColumns}
              buttons={onSelectBtn}
              loading={tableLoading}
              defPg={defPg}
              totalRecord={recordCount}
              onSelectChange={handleSelectChange}
              onPageChange={(paginate) => setPagination(paginate)}
            />
          </Space>
        </MainCard>
      </MainCardContainer>

      <ActionModal {...actionModalProps} />
    </Layout>
  );
};

export default ProdMgmt;
