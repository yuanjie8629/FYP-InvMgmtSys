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
import packageList from './packageList';
import { ReactComponent as BulkEditIcon } from '@assets/Icons/BulkEditIcon.svg';
import { MdAdd, MdRemove } from 'react-icons/md';
import packTabList from './packTabList';

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
      title: 'Package',
      dataIndex: ['packNm', 'packSKU', 'packImg'],
      key: 'prod',
      sorter: true,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={15}>
          <Col>
            <Image
              src={data['packImg']}
              height={screens.xl ? 120 : 100}
              width={screens.xl ? 120 : 100}
            />
          </Col>
          <Col>
            <Space direction='vertical' size={5}>
              <Button type='link' color='info'>
                {data['packNm']}
              </Button>
              <Text className='color-grey text-sm'>{data['packSKU']}</Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Products Included',
      dataIndex: 'packProds',
      key: 'packProds.quantity',
      render: (products: []) =>
        products.map((product: any) => (
          <Row justify='space-between'>
            <Text className='color-grey'>{product.prodNm}</Text>
            <Text className='color-grey'>x{product.quantity}</Text>
          </Row>
        )),
    },
    {
      title: 'Price',
      dataIndex: 'packPrice',
      key: 'packPrice',
      width: '12%',
      sorter: true,
      render: (amount: string) => (
        <Text className='color-grey'>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'packStock',
      key: 'packStock',
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
      <div className='prod-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard tabList={packTabList}>
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Package List</Title>
                    </Col>
                    <Col>
                      <Button type='primary'>View Package</Button>
                    </Col>
                  </Row>

                  <InformativeTable
                    dataSource={packageList}
                    columns={prodInvColumns}
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
