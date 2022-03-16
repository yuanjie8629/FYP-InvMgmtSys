import React, { useEffect, useState } from 'react';
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
  message,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import Button from '@components/Button';
import Table from '@components/Table';
import TextEditor from '@components/Input/TextEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { serverErrMsg } from '@utils/messageUtils';
import { removeInvalidData } from '@utils/arrayUtils';
import { packageDetailsAPI, packageUpdFileAPI } from '@api/services/packageAPI';
import { findRoutePath } from '@utils/routingUtils';
import { DeleteButton } from '@components/Button/ActionButton';
import { getDtTm } from '@utils/dateUtils';
import ProductSelect from './ProductSelect';
import BraftEditor from 'braft-editor';
import { prodCat } from '@utils/optionUtils';
import moment from 'moment';
import { productPrevAllAPI } from '@api/services/productAPI';

const PackEdit = () => {
  const { Text, Title, Paragraph } = Typography;
  const [packForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
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
  const [thumbnail, setThumbnail] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [packStatus, setPackStatus] = useState('');
  const [startTime, setStartTime] = useState<moment.Moment>();
  const [endTime, setEndTime] = useState<moment.Moment>();
  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  const showErrMsg = (errMsg?: string) => {
    messageApi.open({ key: 'err', type: 'error', content: errMsg });
    setTimeout(() => message.destroy('err'), 3000);
  };

  const handleEditPackage = (values) => {
    if (selectedProds.length < 1) {
      setErrMsg({
        type: 'require_product',
        message: 'Please add at least one Product',
      });
      showErrMsg('Please add at least one Product');
      return;
    }

    if (startTime.isAfter(endTime)) {
      setErrMsg({
        type: 'invalid_avail_tm',
        message: 'Start time cannot after end time.',
      });
      showErrMsg('Start time cannot after end time.');
      return;
    }

    let { profit, description, product, ...data } = values;
    data.description = description.toHTML();
    data.avail_start_tm = getDtTm(data.avail_start_tm);
    if (data.avail_end_tm) {
      data.avail_end_tm = getDtTm(data.avail_end_tm);
    }

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
    selectedProds.forEach((prod, index) => {
      formData.append(
        `product[${index}]`,
        `id=${prod.id}&quantity=${prod.quantity}`
      );
      // formData.append(`product[${index}]['id']`, prod.id);
      // formData.append(`product[${index}]['quantity']`, prod.quantity);
    });
    setLoading(true);
    packageUpdFileAPI(id, formData)
      .then((res) => {
        setLoading(false);
        navigate(findRoutePath('packEditSuccess'));
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

  useEffect(() => {
    let isMounted = true;
    setTargetOffset(window.innerHeight / 1.65);
    if (id) {
      setDataLoading(true);
      let newProducts = [];
      productPrevAllAPI()
        .then((res) => {
          if (isMounted) {
            newProducts = res.data;
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setDataLoading(false);
            showServerErrMsg();
          }
        });

      packageDetailsAPI(id)
        .then((res) => {
          if (isMounted) {
            let { avail_start_tm, avail_end_tm, product, ...data } = res.data;
            packForm.setFieldsValue(data);
            packForm.setFieldsValue({
              avail_start_tm: moment(avail_start_tm, 'DD-MM-YYYY HH:mm:ss'),
            });
            setStartTime(moment(avail_start_tm, 'DD-MM-YYYY HH:mm:ss'));
            if (avail_end_tm) {
              packForm.setFieldsValue({
                avail_end_tm: moment(avail_end_tm, 'DD-MM-YYYY HH:mm:ss'),
              });
              setEndTime(moment(avail_end_tm, 'DD-MM-YYYY HH:mm:ss'));
              setHideEndTime(false);
            }
            let thumbnail = {
              url: res.data?.thumbnail,
            };

            let imageList = [];
            res.data?.image.forEach((img) => {
              imageList.push({
                url: img,
              });
            });
            packForm.setFieldsValue({
              description: BraftEditor.createEditorState(data.description),
            });

            setSelectedProds(product);
            setThumbnail([thumbnail]);
            setImageList(imageList);
            setPackStatus(res.data?.status);
            if (product.length > 0) {
              product.forEach((selected) => {
                setProducts([
                  ...products,
                  ...newProducts.filter((prod) => prod.id !== selected.id),
                ]);
              });
            } else {
              setProducts(newProducts);
            }

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

  const handleDeleteProd = (data) => {
    setProducts([...products, selectedProds.find((prod) => prod.id === data)]);
    setSelectedProds(selectedProds.filter((prod) => prod.id !== data));
  };

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
      dataIndex: ['name', 'category', 'thumbnail'],
      key: 'name',
      render: (_: any, data: { [x: string]: string | undefined }) => {
        return (
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
                  {prodCat.find((cat) => cat.value === data.category)?.label
                    ? prodCat.find((cat) => cat.value === data.category)?.label
                    : data.category}
                </Text>
              </Space>
            </Col>
          </Row>
        );
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      key: 'quantity',
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
          />
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'id',
      width: 100,
      key: 'action',
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
      onFinish={handleEditPackage}
    >
      <Layout>
        {contextHolder}
        <Spin
          spinning={dataLoading || loading}
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
                      if (info.fileList.length > 0) {
                        setThumbnail(info.fileList.map((file) => file));
                        packForm.setFieldsValue({
                          thumbnail: info.fileList.map((file) => file),
                        });
                      } else {
                        setThumbnail([]);
                        packForm.setFieldsValue({ thumbnail: undefined });
                      }
                    }}
                    fileList={thumbnail}
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
                      setImageList(info.fileList.map((file) => file));
                    }}
                    fileList={imageList}
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
                <Form.Item label='Package Status' name='status'>
                  <Checkbox
                    checked={packStatus === 'hidden'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        packForm.setFieldsValue({ status: 'hidden' });
                        setPackStatus('hidden');
                      } else {
                        packForm.setFieldsValue({ status: 'active' });
                        setPackStatus('active');
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
                  name='product'
                  validateStatus={errMsg.type === 'require_product' && 'error'}
                  help={errMsg.type === 'require_product' && errMsg.message}
                >
                  <ProductSelect
                    products={products}
                    onChange={(data) => {
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
                    validateStatus={errMsg.type === 'invalid_sku' && 'error'}
                    help={errMsg.type === 'invalid_sku' && errMsg.message}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the SKU for the product.',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.reject(
                              'Please enter the SKU for the product.'
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    style={{ width: '40%' }}
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
                    label='Start Time'
                    name='avail_start_tm'
                    rules={[
                      {
                        required: true,
                        message:
                          'Please select the start time to launch the package.',
                      },
                    ]}
                  >
                    <DatePicker
                      showTime
                      placeholder='Select Date and Time'
                      onChange={(value) => {
                        setStartTime(value);
                      }}
                    />
                  </Form.Item>
                  <Checkbox
                    checked={!hideEndTime}
                    onChange={(e) => {
                      setHideEndTime(!e.target.checked);
                    }}
                  >
                    Set End Time
                  </Checkbox>

                  <Form.Item
                    label='End Time'
                    name='avail_end_tm'
                    hidden={hideEndTime}
                  >
                    <DatePicker
                      showTime
                      placeholder='Select Date and Time'
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
              type='edit'
              loading={loading}
              disabled={dataLoading || loading}
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

export default PackEdit;
