import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall/UploadPicWall';
import AffixAction from '@components/Affix/AffixAction';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Alert,
  Anchor,
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
import { useNavigate } from 'react-router-dom';
import { serverErrMsg } from '@utils/messageUtils';
import { removeInvalidData } from '@utils/arrayUtils';
import { packageCreateAPI } from '@api/services/packageAPI';
import { findRoutePath } from '@utils/routingUtils';
import { productPrevAllAPI } from '@api/services/productAPI';
import { DeleteButton } from '@components/Button/ActionButton';
import { getDt } from '@utils/dateUtils';
import ProductSelect from './ProductSelect';
import FormSpin from '@components/Spin/FormSpin';
import { MessageContext } from '@contexts/MessageContext';
import moment from 'moment';
import { moneyFormatter } from '@utils/numUtils';

const PackAdd = () => {
  const { Text, Title, Paragraph } = Typography;
  const [packForm] = Form.useForm();
  const [messageApi] = useContext(MessageContext);
  const { Link } = Anchor;
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [hideEndTime, setHideEndTime] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [dimensionValid, setDimensionValid] = useState({
    length: true,
    width: true,
    height: true,
  });
  const [selectedProds, setSelectedProds] = useState([]);

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'products', title: 'Products' },
    { link: 'pricing', title: 'Pricing' },
    { link: 'inv', title: 'Inventory' },
    { link: 'shipping', title: 'Shipping' },
    { link: 'availPeriod', title: 'Available Period' },
  ];

  const checkDimension = !(
    dimensionValid.length &&
    dimensionValid.width &&
    dimensionValid.height
  );

  const [errMsg, setErrMsg] = useState({ type: undefined, message: undefined });
  const [dataLoading, setDataLoading] = useState(false);
  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };
  const [startTime, setStartTime] = useState<moment.Moment>();
  const [endTime, setEndTime] = useState<moment.Moment>();
  const showErrMsg = (errMsg?: string) => {
    messageApi.open({ key: 'err', type: 'error', content: errMsg });
  };

  const handleAddPackage = (values) => {
    if (selectedProds.length < 1) {
      setErrMsg({
        type: 'require_product',
        message: 'Please add at least one Product',
      });
      showErrMsg('Please add at least one Product');
      return;
    }

    if (endTime && startTime.isAfter(endTime)) {
      setErrMsg({
        type: 'invalid_avail_tm',
        message: 'Start date cannot after end date.',
      });
      showErrMsg('Start date cannot after end date.');
      return;
    }
    let { profit, description, ...data } = values;
    if (!values.sku) {
      setErrMsg({
        type: 'invalid_sku',
        message: 'Please enter the SKU for the package.',
      });
      return;
    }
    data.description = description.toHTML();
    data.avail_start_dt = getDt(data.avail_start_dt);
    if (data.avail_end_dt) data.avail_end_dt = getDt(data.avail_end_dt);
    data = removeInvalidData(data);
    let formData = new FormData();
    Object.keys(data).forEach((item) => {
      if (item === 'image') {
        data[item].forEach((image, index) => {
          formData.append(`${item}[${index}]`, image);
        });
      } else if (item === 'thumbnail') {
        formData.append(item, data[item], `${data.name.trim()}-thumbnail.jpg`);
      } else {
        formData.append(item, data[item]);
      }
    });
    selectedProds.forEach((prod, index) => {
      formData.append(
        `product[${index}]`,
        `id=${prod.id}&quantity=${prod.quantity}`
      );
      // formData.append(`product[${index}]['id']`, prod.id);
      // formData.append(`product[${index}]['quantity']`, prod.quantity);
    });
    setLoading(true);
    packageCreateAPI(formData)
      .then((res) => {
        setLoading(false);
        navigate(findRoutePath('packAddSuccess'));
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
          } else if (err.response?.data.hasOwnProperty('thumbnail')) {
            showErrMsg(err.response?.data.thumbnail[0]);
          } else {
            showServerErrMsg();
          }
        }
      });
  };
  const getProducts = (isMounted: boolean = true) => {
    setDataLoading(true);
    productPrevAllAPI()
      .then((res) => {
        if (isMounted) {
          setDataLoading(false);
          setProducts(res.data);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setDataLoading(false);
          showServerErrMsg();
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    setTargetOffset(window.innerHeight / 1.5);
    getProducts(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteProd = (data) => {
    setProducts([...products, selectedProds.find((prod) => prod.id === data)]);
    setSelectedProds(selectedProds.filter((prod) => prod.id !== data));
  };
  const prodColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: any;
    sortOrder?: any;
    sortDirections?: any;
    defaultSortOrder?: 'ascend' | 'descend';
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['name', 'category', 'thumbnail'],
      key: 'name',
      sorter: (a, b) => a.name < b.name,
      defaultSortOrder: 'descend',
      sortDirections: [],
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={10}>
          <Col span={8}>
            <Image src={data.thumbnail} height={80} width={80} />
          </Col>
          <Col>
            <Space direction='vertical' size={5}>
              <Button type='link' color='info'>
                {data.name}
              </Button>
              <Text type='secondary' className='text-sm'>
                {data.category}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      sortOrder: false,
      key: 'sku',
      render: (data) => <Text type='secondary'>{data}</Text>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sortOrder: false,
      key: 'price',
      render: (data) => (
        <Text type='secondary'>{moneyFormatter(parseFloat(data))}</Text>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      sortOrder: false,
      render: (data: any) => {
        return (
          <InputNumber
            value={data.quantity}
            onChange={(value) => {
              let selected = selectedProds.find((prod) => prod.id === data.id);
              setSelectedProds([
                ...selectedProds.filter((prod) => prod.id !== data.id),
                { ...selected, quantity: value },
              ]);
            }}
            min={1}
          />
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'id',
      width: 100,
      key: 'action',
      sortOrder: false,
      render: (data: any) => {
        return (
          <DeleteButton
            type='link'
            color='info'
            onClick={() => {
              handleDeleteProd(data);
            }}
          />
        );
      },
    },
  ];

  return (
    <Form
      name='packForm'
      form={packForm}
      layout='vertical'
      size='small'
      scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
      onFinish={handleAddPackage}
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
                  label='Package Name'
                  name='name'
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
                  label='Package Thumbnail'
                  name='thumbnail'
                  rules={[
                    {
                      required: true,
                      message: 'Please upload ONE package thumbnail.',
                    },
                  ]}
                >
                  <UploadPicWall
                    maxCount={1}
                    onChange={(info) => {
                      info.fileList[0]
                        ? packForm.setFieldsValue({
                            thumbnail: info.fileList[0].originFileObj,
                          })
                        : packForm.resetFields(['thumbnail']);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <Space size={10}>
                      <Text>Package Image</Text>
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
                      packForm.setFieldsValue({
                        image: info.fileList.map((file) => file.originFileObj),
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Package Description'
                  name='description'
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
                <Form.Item
                  label='Package Status'
                  name='status'
                  initialValue='active'
                >
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        packForm.setFieldsValue({ status: 'hidden' });
                      } else {
                        packForm.setFieldsValue({ status: 'active' });
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
                <Title level={4} id='products'>
                  Products
                </Title>

                <Form.Item
                  label='Products To Be Included'
                  validateStatus={errMsg.type === 'require_product' && 'error'}
                  help={errMsg.type === 'require_product' && errMsg.message}
                >
                  <ProductSelect
                    products={products}
                    onSelect={(data) => {
                      setSelectedProds([
                        ...selectedProds,
                        {
                          ...products.find((prod) => prod.id === data),
                          quantity: 1,
                        },
                      ]);
                      setProducts(products.filter((prod) => prod.id !== data));
                      setErrMsg({ type: undefined, message: undefined });
                    }}
                  />
                  <Paragraph type='secondary'>
                    Note: Selected products will be displayed below.
                  </Paragraph>
                </Form.Item>

                <Table
                  rowKey='id'
                  columns={prodColumns}
                  dataSource={selectedProds}
                  pagination={false}
                />
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
                      name='price'
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
                    name='sku'
                    validateStatus={
                      errMsg.type === 'invalid_sku' ? 'error' : undefined
                    }
                    help={
                      errMsg.type === 'invalid_sku' ? errMsg.message : undefined
                    }
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.reject('Please enter product SKU.');
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
                        message: 'Please enter the package stock quantity.',
                      },
                    ]}
                  >
                    <InputNumber min={0} />
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
                    label='Weight (g)'
                    name='weight'
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
            </Row>
            <Row justify='center' className='full-width'>
              <MainCard>
                <Space direction='vertical' size={20} className='full-width'>
                  <Title level={4} id='availPeriod'>
                    Available Period
                  </Title>
                  {errMsg.type === 'invalid_avail_tm' && (
                    <Alert
                      type='error'
                      style={{ width: '40%' }}
                      showIcon
                      message={<Text type='danger'>{errMsg.message}</Text>}
                    />
                  )}
                  <Form.Item
                    label='Start Date'
                    name='avail_start_dt'
                    rules={[
                      {
                        required: true,
                        message:
                          'Please select the start date to launch the package.',
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder='Select Date'
                      onChange={(value) => {
                        setStartTime(value);
                      }}
                    />
                  </Form.Item>
                  <Checkbox
                    checked={!hideEndTime}
                    onChange={(e) => {
                      setHideEndTime(!e.target.checked);
                      packForm.resetFields(['avail_end_dt']);
                    }}
                  >
                    Set End Date
                  </Checkbox>

                  <Form.Item
                    label='End Date'
                    name='avail_end_dt'
                    hidden={hideEndTime}
                  >
                    <DatePicker
                      placeholder='Select Date'
                      onChange={(value) => {
                        setEndTime(value);
                      }}
                    />
                  </Form.Item>
                </Space>
              </MainCard>
            </Row>
            <AffixAction
              offsetBottom={0}
              label='Package'
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

export default PackAdd;
