import React, { useEffect, useState } from 'react';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall';
import AffixAdd from '@components/Affix/AffixAdd';
import {
  Anchor,
  BackTop,
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

const ProdAdd = () => {
  const { Text, Title } = Typography;
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

  const prodCat = [
    { value: 'rte', label: 'Ready-To-Eat' },
    { value: 'rtc', label: 'Ready-To-Cook' },
    { value: 'paste', label: 'Paste' },
  ];

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'pricing', title: 'Pricing' },
    { link: 'inv', title: 'Inventory' },
    { link: 'shipping', title: 'Shipping' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.4);
  }, []);

  return (
    <Layout>
      <div className='prod-mgmt'>
        <Form name='prodForm' layout='vertical' size='small'>
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
                        label='Product Name'
                        name='prodName'
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder='e.g. Nasi Briyani Bkhari'
                          style={{ width: '40%' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Product Category'
                        name='prodCat'
                        rules={[{ required: true }]}
                      >
                        <Radio.Group options={prodCat} />
                      </Form.Item>
                      <Form.Item
                        label='Product Image'
                        name='prodImg'
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
                        label='Product Description'
                        name='prodDesc'
                        rules={[{ required: true }]}
                      >
                        <Input.TextArea style={{ height: 200 }} />
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
                              rules={[{ required: true }]}
                            >
                              <InputNumber
                                addonBefore='RM'
                                precision={2}
                                min={0}
                                placeholder='Input'
                              ></InputNumber>
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
                              ></InputNumber>
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
                              rules={[{ required: true }]}
                            >
                              <InputNumber
                                addonBefore='RM'
                                precision={2}
                                min={0}
                                placeholder='Input'
                              ></InputNumber>
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
                              ></InputNumber>
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
                              ></InputNumber>
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
                          rules={[{ required: true }]}
                          style={{ width: '40%' }}
                        >
                          <Input placeholder='e.g. SHRF-RTC-NBB' />
                        </Form.Item>

                        <Form.Item
                          label='Stock Quantity'
                          name='prodSPrice'
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0} defaultValue={0}></InputNumber>
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
                              ></InputNumber>
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
                              ></InputNumber>
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
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={0}
                          defaultValue={0}
                          style={{ width: '10%' }}
                        ></InputNumber>
                      </Form.Item>

                      <Form.Item
                        label='Dimension (cm)'
                        name='prodDimension'
                        rules={[{ required: true }]}
                      >
                        <Space size={10}>
                          <InputNumber
                            min={0}
                            placeholder='Length'
                            addonAfter='cm'
                          ></InputNumber>
                          <Text className='color-grey'>x</Text>
                          <InputNumber
                            min={0}
                            placeholder='Width'
                            addonAfter='cm'
                          ></InputNumber>
                          <Text className='color-grey'>x</Text>
                          <InputNumber
                            min={0}
                            placeholder='Height'
                            addonAfter='cm'
                          ></InputNumber>
                        </Space>
                      </Form.Item>
                    </Space>
                  </ContainerCard>
                </Row>
              </Space>
              <AffixAdd offsetBottom={0} label='Product' />
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
        <BackTop />
      </div>
    </Layout>
  );
};

export default ProdAdd;
