import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
import InformativeTable, {
  InformativeTableButtonProps,
} from '@components/Table/InformativeTable';
import Button from '@components/Button/Button';
import { Col, Image, Row, Space, Typography, InputNumber, Radio } from 'antd';
import FilterInputs from './FilterInputs';
import prodList from './prodList';
import { ReactComponent as BulkEditIcon } from '@assets/Icons/BulkEditIcon.svg';
import { MdAdd, MdRemove } from 'react-icons/md';
import prodTabList from './prodTabList';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { moneyFormatter } from '@utils/numUtils';

const ProdInv = () => {
  const { Text, Title } = Typography;

  let navigate = useNavigate();

  const [prodListFltr, setProdListFltr] = useState(prodList);

  const bulkUpdBtn = (props: any) => (
    <Button
      type='primary'
      icon={<BulkEditIcon style={{ marginRight: 5 }} />}
      style={{ display: 'flex', alignItems: 'center' }}
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
      width: 400,
      sorter: true,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={5}>
          <Col xs={9} xl={7}>
            <Image src={data['prodImg']} height={120} width={120} />
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
      width: 160,
      sorter: true,
    },
    {
      title: 'Price',
      dataIndex: 'prodPrice',
      key: 'prodPrice',
      width: 120,
      sorter: true,
      render: (amount: number) => (
        <Text type='secondary'>{moneyFormatter(amount)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'prodStock',
      key: 'prodStock',
      width: 100,
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: 280,
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
              tabList={prodTabList}
              onTabChange={(key) =>
                setProdListFltr(
                  prodList.filter((prod) =>
                    key !== 'all' ? prod.prodStat === key : true
                  )
                )
              }
            >
              <Space direction='vertical' size={40} className='width-full'>
                <FilterInputs />
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Product List</Title>
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
                    dataSource={prodListFltr}
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
