import React, { useContext, useEffect, useState } from 'react';
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
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import TextEditor from '@components/Input/TextEditor';
import { prodCat } from '@utils/optionUtils';
import { productDetailsAPI, productUpdAPI } from '@api/services/productAPI';
import { removeInvalidData } from '@utils/arrayUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { serverErrMsg } from '@utils/messageUtils';
import BraftEditor from 'braft-editor';
import FormSpin from '@components/Spin/FormSpin';
import { MessageContext } from '@contexts/MessageContext';

const ProdEdit = () => {
  const { Text, Title } = Typography;
  const [prodForm] = Form.useForm();
  const { id } = useParams();
  const [messageApi] = useContext(MessageContext);
  const { Link } = Anchor;
  const [price, setPrice] = useState<number>();
  const [specialPrice, setSpecialPrice] = useState<number>();
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
  const [prodStatus, setProdStatus] = useState('');

  const checkDimension = !(
    dimensionValid.length &&
    dimensionValid.width &&
    dimensionValid.height
  );

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showErrMsg = (errMsg?: string) => {
    messageApi.open({ type: 'error', content: errMsg });
  };

  useEffect(() => {
    let isMounted = true;
    setTargetOffset(window.innerHeight / 1.65);
    if (id) {
      setDataLoading(true);
      productDetailsAPI(id)
        .then((res) => {
          if (isMounted) {
            prodForm.setFieldsValue(res.data);
            let thumbnail = {
              url: res.data?.thumbnail,
            };

            let imageList = [];
            res.data?.image.forEach((img) => {
              imageList.push({
                url: img,
              });
            });
            prodForm.setFieldsValue({
              description: BraftEditor.createEditorState(res.data.description),
            });
            setThumbnail([thumbnail]);
            setImageList(imageList);
            setProdStatus(res.data?.status);
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
    if (!values.sku) {
      setErrMsg({
        type: 'invalid_sku',
        message: 'Please enter the SKU for the product.',
      });
      return;
    }
    data.description = description.toHTML();
    let newImageList = imageList.map((img) =>
      'originFileObj' in img ? img.originFileObj : img.url
    );
    data.image = newImageList;

    data.thumbnail = data.thumbnail[0].originFileObj
      ? data.thumbnail[0].originFileObj
      : data.thumbnail[0].url;

    data = removeInvalidData(data);
    let formData = new FormData();
    Object.keys(data).forEach((item) => {
      if (item === 'image') {
        data[item].forEach((image, index) => {
          formData.append(`${item}[${index}]`, image);
        });
      } else {
        formData.append(item, data[item]);
      }
    });

    setLoading(true);
    productUpdAPI(id, formData)
      .then((res) => {
        setLoading(false);
        navigate(findRoutePath('prodEditSuccess'));
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          if (err.response?.data?.error?.code === 'invalid_sku') {
            setErrMsg({
              type: 'invalid_sku',
              message: err.response?.data?.error?.message,
            });
            showErrMsg(err.response?.data?.error?.message);
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
      <Layout gutter={30}>
        <FormSpin visible={dataLoading || loading} />
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
                      if (info.fileList.length > 0) {
                        setThumbnail(info.fileList.map((file) => file));
                        prodForm.setFieldsValue({
                          thumbnail: info.fileList.map((file) => file),
                        });
                      } else {
                        setThumbnail([]);
                        prodForm.setFieldsValue({ thumbnail: undefined });
                      }
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
                  <Checkbox
                    checked={prodStatus === 'hidden'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        prodForm.setFieldsValue({ status: 'hidden' });
                        setProdStatus('hidden');
                      } else {
                        prodForm.setFieldsValue({ status: 'active' });
                        setProdStatus('active');
                      }
                    }}
                  >
                    Hidden
                  </Checkbox>
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
                            if (costPerUnit && !specialPrice) {
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
                          onChange={(value) => {
                            setSpecialPrice(value);
                            if (costPerUnit && value) {
                              prodForm.setFieldsValue({
                                profit: (value - costPerUnit).toFixed(2),
                              });
                            } else {
                              prodForm.setFieldsValue({
                                profit: (price - costPerUnit).toFixed(2),
                              });
                            }
                          }}
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
                            if (specialPrice) {
                              prodForm.setFieldsValue({
                                profit: (specialPrice - value).toFixed(2),
                              });
                            } else if (price) {
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
                          title:
                            'Fixed cost / Setup cost per purchase order (Shipping and handling costs)',
                        }}
                      >
                        <InputNumber
                          addonBefore='RM'
                          addonAfter='Monthly'
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
                          title:
                            'Cost for storing or holding the inventory in stock per unit, per month',
                        }}
                      >
                        <InputNumber
                          addonBefore='RM'
                          addonAfter='Monthly'
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
                  <Space direction='vertical' size={20} className='full-width'>
                    <Form.Item
                      label='Stock Keeping Unit (SKU)'
                      name='sku'
                      validateStatus={
                        errMsg.type === 'invalid_sku' ? 'error' : undefined
                      }
                      help={
                        errMsg.type === 'invalid_sku'
                          ? errMsg.message
                          : undefined
                      }
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.reject(
                                'Please enter product SKU.'
                              );
                            }
                            if (errMsg.type === 'invalid_sku') {
                              return Promise.reject(errMsg.message);
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      style={{ width: '40%' }}
                      required
                    >
                      <Input
                        placeholder='e.g. SHRF-RTC-NBB'
                        onChange={(e) => {
                          setErrMsg({ type: undefined, message: undefined });
                        }}
                      />
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
                      <InputNumber min={0} />
                    </Form.Item>
                  </Space>
                  <Divider />
                  <Row gutter={30}>
                    <Col>
                      <Form.Item
                        label='Average Lead Time'
                        name='avg_lead_tm'
                        tooltip={{
                          title:
                            'Average number of days it takes to receive the product once you place a new order',
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
                          title:
                            'Maximum number of days it takes to receive the product once you place a new order',
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
                  label='Weight (g)'
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
              disabled={dataLoading || loading}
            />
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
      </Layout>
    </Form>
  );
};

export default ProdEdit;
