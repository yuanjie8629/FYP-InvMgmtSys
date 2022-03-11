import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall/UploadPicWall';
import AffixAction from '@components/Affix/AffixAction';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Anchor,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import TextEditor from '@components/Input/TextEditor';
import { prodCat } from '@utils/optionUtils';
import { productCreateAPI, productDetailsAPI } from '@api/services/productAPI';
import { removeInvalidData } from '@utils/arrayUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { serverErrMsg } from '@utils/messageUtils';
import BraftEditor from 'braft-editor';

const ProdEdit = () => {
  const { Text, Title } = Typography;
  const [prodForm] = Form.useForm();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const { Link } = Anchor;
  const [price, setPrice] = useState<number>();
  const [costPerUnit, setCostPerUnit] = useState<number>();
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'pricing', title: 'Pricing' },
    { link: 'inv', title: 'Inventory' },
    { link: 'shipping', title: 'Shipping' },
  ];
  const [dimensionValid, setDimensionValid] = useState({
    length: true,
    width: true,
    height: true,
  });
  const [errMsg, setErrMsg] = useState({ type: undefined, message: undefined });
  const [dataLoading, setDataLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState([]);
  const [imageList, setImageList] = useState([]);

  const checkDimension = !(
    dimensionValid.length &&
    dimensionValid.width &&
    dimensionValid.height
  );

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  const showErrMsg = (errMsg?: string) => {
    messageApi.open({ key: 'err', type: 'error', content: errMsg });
    setTimeout(() => message.destroy('err'), 3000);
  };

  useEffect(() => {
    let isMounted = true;
    setTargetOffset(window.innerHeight / 1.65);
    if (id) {
      setDataLoading(true);
      productDetailsAPI(id)
        .then((res) => {
          if (isMounted) {
            console.log(res.data);
            prodForm.setFieldsValue(res.data);
            let thumbnail = {
              url: res.data.thumbnail,
            };

            let imageList = [];
            res.data?.image.forEach((img) => {
              imageList.push({
                url: img.image,
              });
            });
            prodForm.setFieldsValue({
              description: BraftEditor.createEditorState(res.data.description),
            });
            setThumbnail([thumbnail]);
            setImageList(imageList);
            setDataLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setDataLoading(false);
            showServerErrMsg();
          }
        });
      return () => {
        isMounted = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEditProduct = (values) => {
    let { profit, description, image, ...data } = values;
    if (data.status === undefined) data.status = 'active';
    data.description = description.toHTML();
    let newImageList = imageList.map((img) =>
      'originFileObj' in img ? img.originFileObj : img.url
    );
    data.image = newImageList;
    data = removeInvalidData(data);

    let formData = new FormData();
    Object.keys(data).forEach((item) => {
      if (item === 'image') {
        data[item].forEach((image, index) => {
          formData.append(`${item}[${index}]`, image);
        });
      } else if (item === 'thumbnail') {
        formData.append(item, data[item]);
      } else {
        formData.append(item, data[item]);
      }
    });

    setLoading(true);
    productCreateAPI(formData)
      .then((res) => {
        setLoading(false);
        navigate(findRoutePath('ProdEditSuccess'));
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          console.log(err.response.data);
          if (err.response.data?.item) {
            setErrMsg({ type: 'sku', message: err.response.data?.item?.sku });
            showErrMsg(err.response.data?.item?.sku);
          } else {
            showServerErrMsg();
          }
        }
      });
  };

  return (
    <Form
      name='prodForm'
      form={prodForm}
      layout='vertical'
      size='small'
      scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
      onFinish={handleEditProduct}
    >
      <Layout>
        {contextHolder}
        <Spin
          spinning={dataLoading}
          style={{
            position: 'fixed',
            top: '50%',
            transform: 'translate(0,-50%)',
          }}
        >
          {' '}
        </Spin>
        <Col xs={16} xl={19} className='center-flex'>
          <MainCardContainer>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='basicInfo'>
                  Basic Information
                </Title>
                <Form.Item
                  label='Product Name'
                  name='name'
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
                  name='category'
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
                  label='Product Thumbnail'
                  name='thumbnail'
                  rules={[
                    {
                      required: true,
                      message: 'Please upload ONE product thumbnail.',
                    },
                  ]}
                >
                  <UploadPicWall
                    maxCount={1}
                    onChange={(info) => {
                      console.log(info);
                      setThumbnail(info.fileList.map((file) => file));
                    }}
                    fileList={thumbnail}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <Space size={10}>
                      <Text>Product Image</Text>
                      <Text type='secondary' className='text-sm'>
                        (Max 8)
                      </Text>
                    </Space>
                  }
                  name='image'
                >
                  <UploadPicWall
                    maxCount={8}
                    onChange={(info) => {
                      setImageList(info.fileList.map((file) => file));
                    }}
                    fileList={imageList}
                  />
                </Form.Item>
                <Form.Item
                  label='Product Description'
                  name='description'
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
                <Form.Item label='Product Status' name='status'>
                  <Checkbox>Hidden</Checkbox>
                </Form.Item>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='pricing'>
                  Pricing
                </Title>
                <div>
                  <Row gutter={30}>
                    <Col>
                      <Form.Item
                        label='Price'
                        name='price'
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
                          onChange={(value) => {
                            setPrice(value);
                            if (costPerUnit) {
                              prodForm.setFieldsValue({
                                profit: (value - costPerUnit).toFixed(2),
                              });
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        label='Special Price'
                        name='special_price'
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
                        name='cost_per_unit'
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
                          onChange={(value) => {
                            setCostPerUnit(value);
                            if (price) {
                              prodForm.setFieldsValue({
                                profit: (price - value).toFixed(2),
                              });
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        label='Profit'
                        name='profit'
                        dependencies={['price, cost_per_unit']}
                      >
                        <Input
                          disabled
                          bordered={false}
                          defaultValue='-'
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
                        name='ordering_cost'
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
                        name='holding_cost'
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
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='inv'>
                  Inventory
                </Title>
                <div>
                  <Form.Item
                    label='Stock Keeping Unit (SKU)'
                    name='sku'
                    validateStatus={errMsg.type === 'sku' && 'error'}
                    help={errMsg.type === 'sku' && errMsg.message}
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
                    name='stock'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the product stock quantity.',
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
                        name='avg_lead_tm'
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
                        name='max_lead_tm'
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
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='shipping'>
                  Shipping
                </Title>
                <Form.Item
                  label='Weight (kg)'
                  name='weight'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the product weight.',
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: '10%' }} />
                </Form.Item>

                <Form.Item
                  label='Dimension (cm)'
                  required
                  help={
                    checkDimension &&
                    'Please ensure that THREE diemensions are filled (Length x Width x Height).'
                  }
                  validateStatus={checkDimension && 'error'}
                >
                  <Space size={10}>
                    <Form.Item
                      name='length'
                      noStyle
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              setDimensionValid({
                                ...dimensionValid,
                                width: false,
                              });
                              return Promise.reject();
                            }
                            setDimensionValid({
                              ...dimensionValid,
                              width: true,
                            });
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder='Length'
                        addonAfter='cm'
                      />
                    </Form.Item>
                    <Text type='secondary'>x</Text>
                    <Form.Item
                      name='width'
                      noStyle
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              setDimensionValid({
                                ...dimensionValid,
                                width: false,
                              });
                              return Promise.reject();
                            }
                            setDimensionValid({
                              ...dimensionValid,
                              width: true,
                            });
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder='Width'
                        addonAfter='cm'
                      />
                    </Form.Item>
                    <Text type='secondary'>x</Text>
                    <Form.Item
                      name='height'
                      noStyle
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              setDimensionValid({
                                ...dimensionValid,
                                height: false,
                              });
                              return Promise.reject();
                            }
                            setDimensionValid({
                              ...dimensionValid,
                              height: true,
                            });
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder='Height'
                        addonAfter='cm'
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>
              </Space>
            </MainCard>

            <AffixAction
              offsetBottom={0}
              label='Product'
              type='edit'
              loading={loading}
              disabled={dataLoading}
            />
          </MainCardContainer>
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
      </Layout>
    </Form>
  );
};

export default ProdEdit;
