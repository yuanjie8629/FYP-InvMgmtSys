import React, { useEffect, useState } from 'react';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall';
import Table from '@components/Table/Table';
import AffixAdd from '@components/Affix/AffixAdd';
import {
  Anchor,
  AutoComplete,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
} from 'antd';
import Button from '@components/Button/Button';

const PackAdd = () => {
  const { Text, Title, Paragraph } = Typography;
  const { Link } = Anchor;
  const [hideEndTime, setHideEndTime] = useState(true);
  const [fileList, setFileList]: any = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://www.sharifahfood.com/wp-content/uploads/2020/10/BG-3.png',
    },
  ]);

  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'products', title: 'Products' },
    { link: 'pricing', title: 'Pricing' },
    { link: 'inv', title: 'Inventory' },
    { link: 'shipping', title: 'Shipping' },
    { link: 'availPeriod', title: 'Available Period' },
  ];

  const prodColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['prodNm', 'prodCat', 'prodImg'],
      key: 'prod',

      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={5}>
          <Col>
            <Image src={data['prodImg']} height={120} width={120} />
          </Col>
          <Col>
            <Space direction='vertical' size={5}>
              <Button type='link' color='info'>
                {data['prodNm']}
              </Button>
              <Text type='secondary' className='text-sm'>
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
    },
    {
      title: 'Stock',
      dataIndex: 'prodStock',
      key: 'prodStock',
    },
  ];

  const options: any = [
    {
      label: 'Ready-To-Eat',
      options: [
        { label: 'Kari Ayam', value: 'Kari Ayam' },
        { label: 'Sambal Ikan Bilis', value: 'Sambal Ikan Bilis' },
        { label: 'Rendang Dendeng Daging', value: 'Rendang Dendeng Daging' },
      ],
    },
    {
      label: 'Ready-To-Cook',
      options: [
        { label: 'Nasi Briyani Bukhari', value: 'Nasi Briyani Bukhari' },
      ],
    },
    {
      label: 'Paste',
      options: [
        { label: 'Pes Sambal Tumis', value: 'Pes Sambal Tumis' },
        { label: 'Pes Masakan Keruntuk', value: 'Pes Masakan Keruntuk' },
        { label: 'Pes Mi Goreng', value: 'Pes Mi Goreng' },
      ],
    },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.5);
  }, []);

  return (
    <Layout>
      <div className='pack-add'>
        <Form name='packForm' layout='vertical' size='small'>
          <Row justify='center'>
            <Col span={21}>
              <Space
                direction='vertical'
                size={20}
                className='container-card-wrapper'
              >
                <Row justify='center'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title
                        level={4}
                        id='basicInfo'
                        style={{ fontWeight: 500 }}
                      >
                        Basic Information
                      </Title>
                      <Form.Item
                        label='Package Name'
                        name='packNm'
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder='e.g. Promo Raya Qurban'
                          style={{ width: '40%' }}
                        />
                      </Form.Item>

                      <Form.Item
                        label='Package Image'
                        name='packImg'
                        rules={[{ required: true }]}
                      >
                        <UploadPicWall
                          fileList={fileList}
                          onChange={(info) => {
                            setFileList([...info.fileList]);
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Package Description'
                        name='packDesc'
                        rules={[{ required: true }]}
                      >
                        <Input.TextArea style={{ height: 200 }} />
                      </Form.Item>
                      <Form.Item label='Package Status' name='packStat'>
                        <Checkbox>Hidden</Checkbox>
                      </Form.Item>
                    </Space>
                  </ContainerCard>
                </Row>
                <Row justify='center'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title
                        level={4}
                        id='products'
                        style={{ fontWeight: 500 }}
                      >
                        Products
                      </Title>

                      <Form.Item label='Products To Be Included' name='prodNm'>
                        <Input.Group compact>
                          <AutoComplete
                            placeholder='Product Name'
                            options={options}
                            filterOption
                            notFoundContent='Not Found'
                            style={{ width: '40%' }}
                          >
                            <Input />
                          </AutoComplete>
                          <Button type='primary' style={{ padding: '0 15px' }}>
                            Add
                          </Button>
                        </Input.Group>

                        <Paragraph type='secondary'>
                          Note: Selected products will be displayed below.
                        </Paragraph>
                      </Form.Item>
                      <Table columns={prodColumns} />
                    </Space>
                  </ContainerCard>
                </Row>
                <Row justify='center'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title level={4} id='pricing' style={{ fontWeight: 500 }}>
                        Pricing
                      </Title>
                      <Row gutter={30}>
                        <Col>
                          <Form.Item
                            label='Price'
                            name='packPrice'
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              addonBefore='RM'
                              precision={2}
                              min={0}
                              placeholder='Input'
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item
                            label='Special Price'
                            name='packSPrice'
                            tooltip={{
                              title: 'Discounted Price',
                            }}
                          >
                            <InputNumber
                              addonBefore='RM'
                              precision={2}
                              min={0}
                              placeholder='Input'
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Space>
                  </ContainerCard>
                </Row>
                <Row justify='center'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title level={4} id='inv' style={{ fontWeight: 500 }}>
                        Inventory
                      </Title>

                      <Form.Item
                        label='Stock Keeping Unit (SKU)'
                        name='packSKU'
                        rules={[{ required: true }]}
                        style={{ width: '40%' }}
                      >
                        <Input placeholder='e.g. SHRF-PP-PRQ' />
                      </Form.Item>

                      <Form.Item
                        label='Stock Quantity'
                        name='packQuantity'
                        rules={[{ required: true }]}
                      >
                        <InputNumber min={0} defaultValue={0} />
                      </Form.Item>
                    </Space>
                  </ContainerCard>
                </Row>
                <Row justify='center' className='width-full'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title
                        level={4}
                        id='shipping'
                        style={{ fontWeight: 500 }}
                      >
                        Shipping
                      </Title>
                      <Form.Item
                        label='Weight (kg)'
                        name='packWeight'
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={0}
                          defaultValue={0}
                          style={{ width: '10%' }}
                        />
                      </Form.Item>

                      <Form.Item
                        label='Dimension (cm)'
                        name='packDimension'
                        rules={[{ required: true }]}
                      >
                        <Space size={10}>
                          <InputNumber
                            min={0}
                            placeholder='Length'
                            addonAfter='cm'
                          />
                          <Text type='secondary'>x</Text>
                          <InputNumber
                            min={0}
                            placeholder='Width'
                            addonAfter='cm'
                          />
                          <Text type='secondary'>x</Text>
                          <InputNumber
                            min={0}
                            placeholder='Height'
                            addonAfter='cm'
                          />
                        </Space>
                      </Form.Item>
                    </Space>
                  </ContainerCard>
                </Row>
                <Row justify='center' className='width-full'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title
                        level={4}
                        id='availPeriod'
                        style={{ fontWeight: 500 }}
                      >
                        Available Period
                      </Title>
                      <Form.Item
                        label='Start Time'
                        name='packStartTime'
                        rules={[{ required: true }]}
                      >
                        <DatePicker
                          showTime
                          placeholder='Select Date and Time'
                        />
                      </Form.Item>
                      <Checkbox
                        onChange={() =>
                          hideEndTime
                            ? setHideEndTime(false)
                            : setHideEndTime(true)
                        }
                      >
                        Set End Time
                      </Checkbox>

                      <Form.Item
                        label='End Time'
                        name='packEndTime'
                        hidden={hideEndTime}
                      >
                        <DatePicker
                          showTime
                          placeholder='Select Date and Time'
                        />
                      </Form.Item>
                    </Space>
                  </ContainerCard>
                </Row>
              </Space>
              <AffixAdd offsetBottom={0} label='Package' />
            </Col>
            <Col span={3}>
              <Anchor offsetTop={150} targetOffset={targetOffset}>
                {anchorList.map((anchor) => (
                  <Link
                    key={anchor.link}
                    href={`#${anchor.link}`}
                    title={anchor.title}
                  />
                ))}
              </Anchor>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default PackAdd;
