import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import Button from '@components/Button';
import MainCardContainer from '@components/Container/MainCardContainer';
import { Col, Image, Row, Space, Typography } from 'antd';
import FilterInputs from './FilterInputs';
import prodTabList from './prodTabList';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';
import InvStockInput from '@components/Input/InvStockInput';
import { BulkEditButton } from '@components/Button/ActionButton';
import { BoldTitle } from '@components/Title';
import { productPrevAPI } from '@api/services/productAPI';
import { addSearchParams, parseURL } from '@utils/urlUtls';

const ProdInv = () => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableLoading, setTableLoading] = useState(false);
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const defPg = 5;

  useEffect(() => {
    setTableLoading(true);
    productPrevAPI(location.search)
      .then((res) => {
        setList(res.data.results);
        setRecordCount(res.data.count);
        setTableLoading(false);
      })
      .catch((err) => {
        if (err.response?.status !== 401) setTableLoading(false);
        Promise.resolve();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const bulkUpdBtn = (props: any) => <BulkEditButton />;

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: bulkUpdBtn,
      key: 'bulkUpd',
    },
  ];

  const handleTabChange = (key) => {
    if (key !== 'all') {
      setSearchParams(addSearchParams(searchParams, { status: key }));
    } else {
      searchParams.delete('status');
      setSearchParams(parseURL(searchParams));
    }
  };

  const prodInvColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    width?: number | string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['name', 'category', 'thumbnail'],
      key: 'prod',
      width: 400,
      sorter: true,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={5}>
          <Col xs={9} xl={7}>
            <Image src={data.thumbnail} height={100} width={100} />
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
      width: 160,
      sorter: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: true,
      render: (amount: string) => (
        <Text type='secondary'>{moneyFormatter(parseFloat(amount))}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: 280,
      render: () => <InvStockInput input={0} />,
    },
  ];
  return (
    <Layout>
      <MainCardContainer className='prod-inv'>
        <MainCard tabList={prodTabList} onTabChange={handleTabChange}>
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
                  onClick={() => navigate(findRoutePath('prodMgmt'))}
                >
                  View Products
                </Button>
              </Col>
            </Row>

            <InformativeTable
              rowKey='item_id'
              dataSource={list}
              columns={prodInvColumns}
              buttons={onSelectBtn}
              defPg={defPg}
              totalRecord={recordCount}
              loading={tableLoading}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};
export default ProdInv;
