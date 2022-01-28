import React, { useEffect, useState } from 'react';
import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall/UploadPicWall';
import AffixAdd from '@components/Affix/AffixAdd';
import {
  Anchor,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import TextEditor from '@components/Input/TextEditor';
import { prodCat } from '@utils/optionUtils';

const ProdAdd = () => {
  const { Text, Title } = Typography;
  const [prodForm] = Form.useForm();
  const { Link } = Anchor;
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
    { link: 'pricing', title: 'Pricing' },
    { link: 'inv', title: 'Inventory' },
    { link: 'shipping', title: 'Shipping' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.65);
  }, []);

  return (
    <Layout>
      <div className='prod-add'>
        <Form name='prodForm' form={prodForm} layout='vertical' size='small'>
          <Row justify='center'>
            <Col xs={16} xl={19}>
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
                        label='Product Name'
                        name='prodNm'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter the product name.',
                          },
                        ]}
                      >
                        <Input
                          placeholder='e.g. Nasi Briyani Bkhari'
                          style={{ width: '40%' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Product Category'
                        name='prodCat'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter the product category.',
                          },
                        ]}
                      >
                        <Radio.Group options={prodCat} />
                      </Form.Item>
                      <Form.Item
                        label='Product Image'
                        name='prodImg'
                        rules={[
                          {
                            required: true,
                            message:
                              'Please upload at least ONE product image.',
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
                        label='Product Description'
                        name='prodDesc'
                        rules={[
                          {
                            required: true,
                            validator: (_, value) => {
                              if (value === undefined || value.isEmpty()) {
                                return Promise.reject(
                                  'Please add some description on the product.'
                                );
                              } else {
                                return Promise.resolve();
                              }
                            },
                          },
                        ]}
                      >
                        {/* <Input.TextArea style={{ height: 200 }} /> */}
                        <TextEditor placeholder='Please add the product description here.' />
                      </Form.Item>
                      <Form.Item label='Product Status' name='prodStat'>
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
                      <Title level={4} id='pricing' style={{ fontWeight: 500 }}>
                        Pricing
                      </Title>
                      <div>
                        <Row gutter={30}>
                          <Col>
                            <Form.Item
                              label='Price'
                              name='prodPrice'
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter the product price.',
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
                              name='prodSPrice'
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
                        <Divider />
                        <Row gutter={30}>
                          <Col>
                            <Form.Item
                              label='Cost per Unit'
                              name='prodCPU'
                              tooltip={{
                                title: 'Unit Price',
                              }}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    'please enter the unit price of the product.',
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
                            <Form.Item label='Profit' name='prodProfit'>
                              <Input
                                disabled
                                bordered={false}
                                defaultValue='-'
                                placeholder='Input'
                                style={{
                                  fontWeight: 'bold',
                                  cursor: 'default',
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={30}>
                          <Col>
                            <Form.Item
                              label='Ordering/Reorder Cost'
                              name='prodOrderCost'
                              tooltip={{
                                title: 'Cost when reordering the product',
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
                          <Col>
                            <Form.Item
                              label='Carrying/Holding Cost'
                              name='prodCarryCost'
                              tooltip={{
                                title: 'Cost for holding inventory in stock',
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
                      </div>
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
                      <div>
                        <Form.Item
                          label='Stock Keeping Unit (SKU)'
                          name='prodSKU'
                          rules={[
                            {
                              required: true,
                              message: 'Please enter the SKU for the product.',
                            },
                          ]}
                          style={{ width: '40%' }}
                        >
                          <Input placeholder='e.g. SHRF-RTC-NBB' />
                        </Form.Item>

                        <Form.Item
                          label='Stock Quantity'
                          name='prodQuantity'
                          rules={[
                            {
                              required: true,
                              message:
                                'Please enter the product stock quantity.',
                            },
                          ]}
                        >
                          <InputNumber min={0} defaultValue={0} />
                        </Form.Item>

                        <Divider />
                        <Row gutter={30}>
                          <Col>
                            <Form.Item
                              label='Average Lead Time'
                              name='avgLeadTime'
                              tooltip={{
                                title: 'Average Lead Time',
                              }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='Input'
                                addonAfter='Days'
                              />
                            </Form.Item>
                          </Col>
                          <Col>
                            <Form.Item
                              label='Maximum Lead Time'
                              name='maxLeadTime'
                              tooltip={{
                                title: 'Maximum Lead Time',
                              }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='Input'
                                addonAfter='Days'
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
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
                        name='prodWeight'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter the product weight.',
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
                        name='prodDimension'
                        rules={[
                          {
                            required: true,
                            message:
                              'Please enter the product dimension in cm.',
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
                  </ContainerCard>
                </Row>
              </Space>
              <AffixAdd offsetBottom={0} label='Product' />
            </Col>
            <Col xs={8} xl={5} push={1}>
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

export default ProdAdd;
