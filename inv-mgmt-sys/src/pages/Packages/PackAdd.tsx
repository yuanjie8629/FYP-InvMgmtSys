import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall/UploadPicWall';
import AffixAdd from '@components/Affix/AffixAdd';
import MainCardContainer from '@components/Container/MainCardContainer';
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
import Button from '@components/Button';
import Table from '@components/Table';
import TextEditor from '@components/Input/TextEditor';

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
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
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

  //retrieve from database
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
    <Form name='packForm' layout='vertical' size='small'>
      <Layout>
        <Col xs={16} xl={19} className='centerFlex'>
          <MainCardContainer func='add' className='pack-add'>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='basicInfo'>
                  Basic Information
                </Title>
                <Form.Item
                  label='Package Name'
                  name='packNm'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the package name.',
                    },
                  ]}
                >
                  <Input
                    placeholder='e.g. Promo Raya Qurban'
                    style={{ width: '40%' }}
                  />
                </Form.Item>

                <Form.Item
                  label='Package Image'
                  name='packImg'
                  rules={[
                    {
                      required: true,
                      message: 'Please upload at least ONE package image.',
                    },
                  ]}
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
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        if (value === undefined || value.isEmpty()) {
                          return Promise.reject(
                            'Please add some description on the package.'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  {/* <Input.TextArea style={{ height: 200 }} /> */}
                  <TextEditor placeholder='Please add the package description here.' />
                </Form.Item>
                <Form.Item label='Package Status' name='packStat'>
                  <Checkbox>Hidden</Checkbox>
                </Form.Item>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='products'>
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
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='pricing'>
                  Pricing
                </Title>
                <Row gutter={30}>
                  <Col>
                    <Form.Item
                      label='Price'
                      name='packPrice'
                      rules={[
                        {
                          required: true,
                          message: 'Please enter the package price.',
                        },
                      ]}
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
            </MainCard>

            <Row justify='center'>
              <MainCard>
                <Space direction='vertical' size={20} className='full-width'>
                  <Title level={4} id='inv'>
                    Inventory
                  </Title>

                  <Form.Item
                    label='Stock Keeping Unit (SKU)'
                    name='packSKU'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the SKU for the package.',
                      },
                    ]}
                    style={{ width: '40%' }}
                  >
                    <Input placeholder='e.g. SHRF-PP-PRQ' />
                  </Form.Item>

                  <Form.Item
                    label='Stock Quantity'
                    name='packQuantity'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the package stock quantity.',
                      },
                    ]}
                  >
                    <InputNumber min={0} defaultValue={0} />
                  </Form.Item>
                </Space>
              </MainCard>
            </Row>
            <Row justify='center' className='full-width'>
              <MainCard>
                <Space direction='vertical' size={20} className='full-width'>
                  <Title level={4} id='shipping'>
                    Shipping
                  </Title>
                  <Form.Item
                    label='Weight (kg)'
                    name='packWeight'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the package weight.',
                      },
                    ]}
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
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the package dimension in cm.',
                      },
                    ]}
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
              </MainCard>
            </Row>
            <Row justify='center' className='full-width'>
              <MainCard>
                <Space direction='vertical' size={20} className='full-width'>
                  <Title level={4} id='availPeriod'>
                    Available Period
                  </Title>
                  <Form.Item
                    label='Start Time'
                    name='packStartTime'
                    rules={[
                      {
                        required: true,
                        message:
                          'Please select the start time to launch the package.',
                      },
                    ]}
                  >
                    <DatePicker showTime placeholder='Select Date and Time' />
                  </Form.Item>
                  <Checkbox onChange={(e) => setHideEndTime(e.target.checked)}>
                    Set End Time
                  </Checkbox>

                  <Form.Item
                    label='End Time'
                    name='packEndTime'
                    hidden={hideEndTime}
                  >
                    <DatePicker showTime placeholder='Select Date and Time' />
                  </Form.Item>
                </Space>
              </MainCard>
            </Row>
            <AffixAdd offsetBottom={0} label='Package' />
          </MainCardContainer>
        </Col>
        <Col xs={8} xl={5}>
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
      </Layout>{' '}
    </Form>
  );
};

export default PackAdd;
