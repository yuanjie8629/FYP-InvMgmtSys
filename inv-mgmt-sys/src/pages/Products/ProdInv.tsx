import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import InformativeTable from '@components/Table/InformativeTable';
import Button from '@components/Button/Button';
import {
  Col,
  Image,
  Row,
  Space,
  Typography,
  InputNumber,
  Grid,
  Radio,
} from 'antd';
import FilterInputs from './FilterInputs';
import prodList from './prodList';
import { ReactComponent as BulkEditIcon } from '@assets/Icons/BulkEditIcon.svg';
import { MdAdd, MdRemove } from 'react-icons/md';
import prodTabList from './prodTabList';

const ProdInv = () => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const onSelectBtn = (
    <Button
      type='primary'
      icon={<BulkEditIcon style={{ marginRight: 5 }} />}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      Bulk Updates
    </Button>
  );

  const getSalesData = (data: string) =>
    data === 'month'
      ? console.log('month')
      : data === 'week'
      ? console.log('week')
      : data === 'day'
      ? console.log('day')
      : console.log('year');

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
      dataIndex: ['prodNm', 'prodCat', 'prodImg'],
      key: 'prod',
      width: screens.xl ? '40%' : '35%',
      sorter: true,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={5}>
          <Col>
            <Image
              src={data['prodImg']}
              height={screens.xl ? 120 : 80}
              width={screens.xl ? 120 : 80}
            />
          </Col>
          <Col>
            <Space direction='vertical' size={5}>
              <Button type='link' color='info'>
                {data['prodNm']}
              </Button>
              <Text type='secondary' className='text-sm'>{data['prodCat']}</Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'prodSKU',
      key: 'prodSKU',
      width: '15%',
      sorter: true,
    },
    {
      title: 'Price',
      dataIndex: 'prodPrice',
      key: 'prodPrice',
      width: '12%',
      sorter: true,
      render: (amount: string) => (
        <Text type='secondary'>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'prodStock',
      key: 'prodStock',
      width: '10%',
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: screens.xl ? '20%' : '33%',
      render: () => {
        const prodInvRadioBtn: {
          defaultValue: string;
          data: {
            value: string;
            label: React.ReactNode;
          }[];
        } = {
          defaultValue: '+',
          data: [
            {
              value: '+',
              label: (
                <MdAdd size={20} style={{ position: 'relative', top: 5 }} />
              ),
            },
            {
              value: '-',
              label: (
                <MdRemove size={20} style={{ position: 'relative', top: 5 }} />
              ),
            },
            {
              value: 'Set',
              label: (
                <Text strong style={{ color: 'white', padding: '0 12px' }}>
                  Set
                </Text>
              ),
            },
          ],
        };
        return (
          <Space size={10} direction='vertical'>
            <Row>
              <Radio.Group
                buttonStyle='solid'
                size={screens.xl ? 'middle' : 'small'}
                onChange={(e) => getSalesData(e.target.value)}
                defaultValue={prodInvRadioBtn.defaultValue}
                options={prodInvRadioBtn.data}
                optionType='button'
              />
            </Row>
            <Row gutter={[10, 10]}>
              <Col>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  size={screens.xl ? 'middle' : 'small'}
                  style={{ width: 150 }}
                ></InputNumber>
              </Col>
              <Col>
                <Button type='primary' size={screens.xl ? 'middle' : 'small'}>
                  Save
                </Button>
              </Col>
            </Row>
          </Space>
        );
      },
    },
  ];
  return (
    <Layout>
      <div className='prod-inv'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard tabList={prodTabList}>
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Product List</Title>
                    </Col>
                    <Col>
                      <Button type='primary'>View Product</Button>
                    </Col>
                  </Row>

                  <InformativeTable
                    dataSource={prodList}
                    columns={prodInvColumns}
                    buttons={onSelectBtn}
                    defPg={5}
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
