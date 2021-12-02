import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import InformativeTable from '@components/Table/InformativeTable';
import Button from '@components/Button/Button';
import { Col, Image, Row, Space, Typography } from 'antd';
import { HiPencilAlt, HiTrash } from 'react-icons/hi';
import FilterInputs from './FilterInputs';
import prodList from './prodList';
import BulkEditIcon from '@components/Icons/BulkEditIcon';
import Icon from '@ant-design/icons';
const ProdInv = () => {
  const { Text, Title } = Typography;

  const onSelectBtn = (
    <Button type='primary' icon={<BulkEditIcon />}>
      Bulk Updates
    </Button>
  );

  const tabList = [
    { key: 'all', tab: 'All' },
    { key: 'active', tab: 'Active' },
    { key: 'oos', tab: 'Out of Stock' },
    { key: 'hidden', tab: 'Hidden' },
  ];

  const prodListColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['prodNm', 'prodCat', 'prodImg'],
      key: 'prod',
      sorter: true,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row>
          <Col>
            <Image src={data['prodImg']} height={120} />
          </Col>
          <Col>
            <Space direction='vertical' size={5}>
              <Button type='link' color='info'>
                {data['prodNm']}
              </Button>
              <Text className='color-grey text-sm'>{data['prodCat']}</Text>
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
    },
    {
      title: 'Price',
      dataIndex: 'prodPrice',
      key: 'prodPrice',
      sorter: true,
      render: (amount: string) => (
        <Text className='color-grey'>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'prodStock',
      key: 'prodStock',
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space direction='vertical' size={5}>
          <Button
            type='link'
            color='info'
            icon={
              <HiPencilAlt
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 3 }}
              />
            }
          >
            Edit
          </Button>
          <Button
            type='link'
            color='info'
            icon={
              <HiTrash
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 2 }}
              />
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Layout>
      <div className='prod-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard tabList={tabList}>
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Product List</Title>
                    </Col>
                    <Col>
                      <Button type='primary'>Add Product</Button>
                    </Col>
                  </Row>

                  <InformativeTable
                    dataSource={prodList}
                    columns={prodListColumns}
                    buttons={onSelectBtn}
                  />
                </Space>
              </Space>
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};
export default ProdInv;
