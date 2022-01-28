import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import Button from '@components/Button';
import { Col, Image, Row, Space, Typography, InputNumber, Radio } from 'antd';
import FilterInputs from './FilterInputs';
import packageList from './packageList';
import { ReactComponent as BulkEditIcon } from '@assets/Icons/BulkEditIcon.svg';
import { MdAdd, MdRemove } from 'react-icons/md';
import packTabList from './packTabList';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';

const ProdInv = () => {
  const { Text, Title } = Typography;
  const [packageListFltr, setPackageListFltr] = useState(packageList);

  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setPackageListFltr(
        packageList.filter((pack) =>
          searchParams.get('stat') !== null
            ? pack.packStat === searchParams.get('stat')
            : true
        )
      ),
    [searchParams]
  );

  const bulkUpdBtn = (props: any) => (
    <Button
      type='primary'
      icon={<BulkEditIcon style={{ marginRight: 5 }} />}
      className='centerFlex'
      {...props}
    >
      Bulk Updates
    </Button>
  );

  const onSelectBtn: InformativeTableButtonProps = [
    {
      element: bulkUpdBtn,
      key: 'bulkUpd',
    },
  ];

  const getSalesData = (data: string) =>
    data === 'month'
      ? console.log('month')
      : data === 'week'
      ? console.log('week')
      : data === 'day'
      ? console.log('day')
      : console.log('year');

  const packInvColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    width?: number | string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Package',
      dataIndex: ['packNm', 'packSKU', 'packImg'],
      key: 'prod',
      width: 260,
      sorter: true,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={20}>
          <Col xs={9} xl={7}>
            <Image src={data['packImg']} height={80} width={80} />
          </Col>
          <Col xs={15} xl={17}>
            <Space direction='vertical' size={5}>
              <div className='text-button-wrapper'>
                <Text strong className='text-button'>
                  {data['packNm']}
                </Text>
              </div>
              <Text type='secondary' className='text-sm text-break'>
                {data['packSKU']}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Products Included',
      dataIndex: 'packProds',
      key: 'packProds.prodNm',
      width: 260,
      render: (products: []) => (
        <Space direction='vertical' size={10} className='width-full'>
          {products.map((product: any) => (
            <Row justify='space-between' gutter={20}>
              <Col span={20}>
                <Text type='secondary' className='text-break'>
                  {product.prodNm}
                </Text>
              </Col>
              <Col span={4} className='justify-end'>
                <Text type='secondary'>x{product.quantity}</Text>
              </Col>
            </Row>
          ))}
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'packPrice',
      key: 'packPrice',
      width: 100,
      sorter: true,
      render: (amount: string) => (
        <Text type='secondary'>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'packStock',
      key: 'packStock',
      width: 100,
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,

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
                size={'small'}
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
                  size={'small'}
                  style={{ width: 150 }}
                ></InputNumber>
              </Col>
              <Col>
                <Button type='primary' size={'small'}>
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
            <ContainerCard
              tabList={packTabList}
              activeTabKey={
                searchParams.get('stat') === null
                  ? 'all'
                  : searchParams.get('stat')
              }
              onTabChange={(key) => {
                setSearchParams(key !== 'all' ? { stat: key } : {});
              }}
            >
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Package List</Title>
                    </Col>
                    <Col>
                      <Button
                        type='primary'
                        onClick={() => navigate(findRoutePath('packMgmt'))}
                      >
                        View Packages
                      </Button>
                    </Col>
                  </Row>

                  <InformativeTable
                    dataSource={packageListFltr}
                    columns={packInvColumns}
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
