import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import AffixAction from '@components/Affix/AffixAction';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Anchor,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { removeInvalidData } from '@utils/arrayUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import FormSpin from '@components/Spin/FormSpin';
import '@components/Input/InputNumberRange/InputNumberRange.less';
import {
  shippingFeeAddAPI,
  shippingFeeListAPI,
} from '@api/services/shipmentAPI';
import Button from '@components/Button';

const ShptFeeEdit = () => {
  const { Title } = Typography;
  const { Link } = Anchor;
  const { id } = useParams();
  const [shptFeeForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [messageApi] = useContext(MessageContext);
  const navigate = useNavigate();
  const anchorList = [
    { link: 'shippingFeeInfo', title: 'Shipping Fee Information' },
  ];
  const [subFee, setSubFee] = useState<number>();
  const [weightStart, setWeightStart] = useState([]);
  const [weightEnd, setWeightEnd] = useState([]);
  const [weightInvalid, setWeightInvalid] = useState([]);
  const [validateFailed, setValidateFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setTargetOffset(window.innerHeight / 1.5);
    setLoading(true);
    if (id) {
      shptFeeForm.setFieldsValue({ location: id });
      shippingFeeListAPI(
        `?no_page&${createSearchParams({
          location: id,
        }).toString()}&ordering=weight_end`
      )
        .then((res) => {
          if (isMounted) {
            let list = [];
            res.data.forEach((data, index) => {
              list.push({
                weight_start: data.weight_start,
                weight_end: data.weight_end,
                ship_fee: data.ship_fee,
              });
              weightStart.push({ index: index, value: data.weight_start });
              weightEnd.push({ index: index, value: data.weight_end });

              if (index === res.data.length - 1) {
                shptFeeForm.setFieldsValue({
                  sub_fee: data.sub_fee,
                  sub_weight: data.sub_weight,
                });
                setSubFee(data.sub_fee);
              }
            });
            shptFeeForm.setFieldsValue({ location: id, list: list });
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setSubmitLoading(false);
            showServerErrMsg();
          }
        });
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const handleSubmit = (values) => {
    values = removeInvalidData(values);

    setSubmitLoading(true);
    shippingFeeAddAPI(values)
      .then((res) => {
        setSubmitLoading(false);
        navigate(findRoutePath('shptFeeEditSuccess'));
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setSubmitLoading(false);
          showServerErrMsg();
        }
      });
  };

  return (
    <Form
      name='shptFeeForm'
      layout='vertical'
      size='small'
      form={shptFeeForm}
      onFinish={handleSubmit}
      onFinishFailed={() => {
        setValidateFailed(true);
      }}
      onFieldsChange={() => {
        setValidateFailed(false);
      }}
      scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
    >
      <Layout>
        <Col xs={16} xl={19} className='center-flex'>
          <MainCardContainer>
            <FormSpin visible={loading || submitLoading} />
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='shippingFeeInfo'>
                  Shipping Fee Information
                </Title>
                <Form.Item
                  label='Location'
                  name='location'
                  rules={[
                    {
                      required: true,
                      message:
                        'Please select the location for the shipping fee.',
                    },
                  ]}
                  style={{ width: '40%' }}
                >
                  <Select
                    showSearch
                    filterOption
                    placeholder='Please select the state'
                    disabled
                  />
                </Form.Item>
                <Form.Item label='Weight (g) & Shipping Fee (RM)' required>
                  <Form.List name='list'>
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((field, index) => (
                          <Row
                            gutter={20}
                            style={{ margin: 10, minHeight: 55 }}
                          >
                            <Col span={12}>
                              <Form.Item
                                className={`input-range${
                                  weightInvalid.find(
                                    (weight) => weight.index === index
                                  ) || validateFailed
                                    ? ' input-range-error'
                                    : ''
                                }`}
                                required
                                help={
                                  weightInvalid.find(
                                    (weight) => weight.index === index
                                  )?.msg
                                }
                                validateStatus={
                                  weightInvalid.find(
                                    (weight) => weight.index === index
                                  )
                                    ? 'error'
                                    : null
                                }
                              >
                                <Input.Group compact>
                                  <Form.Item
                                    name={[field.name, 'weight_start']}
                                    noStyle
                                    rules={[
                                      ({ getFieldValue }) => ({
                                        validator(_, value) {
                                          if (
                                            value === undefined ||
                                            value === null ||
                                            value === ''
                                          ) {
                                            setWeightInvalid([
                                              ...weightInvalid.filter(
                                                (weight) =>
                                                  weight.index !== index
                                              ),
                                              {
                                                index: index,
                                                msg: 'Please enter the starting and ending weight for the shipping fee',
                                              },
                                            ]);
                                            return Promise.reject(
                                              'Please enter the starting and ending weight for the shipping fee'
                                            );
                                          }

                                          if (
                                            weightEnd.find(
                                              (weight) => weight.index === index
                                            ) !== undefined &&
                                            value >
                                              weightEnd.find(
                                                (weight) =>
                                                  weight.index === index
                                              ).value
                                          ) {
                                            setWeightInvalid([
                                              ...weightInvalid.filter(
                                                (weight) =>
                                                  weight.index !== index
                                              ),
                                              {
                                                index: index,
                                                msg: 'Starting value should be smaller than ending value.',
                                              },
                                            ]);
                                            return Promise.reject();
                                          }

                                          if (
                                            weightEnd.find(
                                              (weight) =>
                                                weight.index === index - 1
                                            ) &&
                                            value <=
                                              weightEnd.find(
                                                (weight) =>
                                                  weight.index === index - 1
                                              ).value
                                          ) {
                                            setWeightInvalid([
                                              ...weightInvalid.filter(
                                                (weight) =>
                                                  weight.index !== index
                                              ),
                                              {
                                                index: index,
                                                msg: 'The starting value overlaps with the previous ending value.',
                                              },
                                            ]);
                                            return Promise.reject();
                                          }

                                          setWeightInvalid(
                                            weightInvalid.filter(
                                              (weight) => weight.index !== index
                                            )
                                          );
                                          return Promise.resolve();
                                        },
                                      }),
                                    ]}
                                  >
                                    <InputNumber
                                      className='input-range-left'
                                      placeholder='Start'
                                      min={0}
                                      onChange={(value: number) => {
                                        setWeightStart([
                                          ...weightStart.filter(
                                            (weight) => weight.index !== index
                                          ),
                                          { index: index, value: value },
                                        ]);
                                      }}
                                      style={{ width: '40%' }}
                                    />
                                  </Form.Item>
                                  <Input
                                    style={{
                                      width: 30,
                                      backgroundColor: 'white',
                                      textAlign: 'center',
                                    }}
                                    value='-'
                                    disabled
                                    className='input-range-splitter'
                                  />
                                  <Form.Item
                                    name={[field.name, 'weight_end']}
                                    noStyle
                                    rules={[
                                      ({ getFieldValue }) => ({
                                        validator(_, value) {
                                          if (
                                            value === undefined ||
                                            value === null ||
                                            value === ''
                                          ) {
                                            setWeightInvalid([
                                              ...weightInvalid.filter(
                                                (weight) =>
                                                  weight.index !== index
                                              ),
                                              {
                                                index: index,
                                                msg: 'Please enter the starting and ending weight for the shipping fee',
                                              },
                                            ]);
                                            return Promise.reject();
                                          }

                                          if (
                                            weightStart.find(
                                              (weight) => weight.index === index
                                            ) !== undefined &&
                                            value <
                                              weightStart.find(
                                                (weight) =>
                                                  weight.index === index
                                              ).value
                                          ) {
                                            setWeightInvalid([
                                              ...weightInvalid.filter(
                                                (weight) =>
                                                  weight.index !== index
                                              ),
                                              {
                                                index: index,
                                                msg: 'Starting value should be smaller than ending value.',
                                              },
                                            ]);
                                            return Promise.reject();
                                          }

                                          if (
                                            weightStart.find(
                                              (weight) => weight.index === index
                                            ) &&
                                            weightEnd.find(
                                              (weight) =>
                                                weight.index === index - 1
                                            ) &&
                                            weightStart.find(
                                              (weight) => weight.index === index
                                            ).value <=
                                              weightEnd.find(
                                                (weight) =>
                                                  weight.index === index - 1
                                              ).value
                                          ) {
                                            setWeightInvalid([
                                              ...weightInvalid.filter(
                                                (weight) =>
                                                  weight.index !== index
                                              ),
                                              {
                                                index: index,
                                                msg: 'The starting value overlaps with the previous ending value.',
                                              },
                                            ]);
                                            return Promise.reject();
                                          }

                                          setWeightInvalid(
                                            weightInvalid.filter(
                                              (weight) => weight.index !== index
                                            )
                                          );
                                          return Promise.resolve();
                                        },
                                      }),
                                    ]}
                                  >
                                    <InputNumber
                                      className='input-range-right'
                                      placeholder='End'
                                      min={0}
                                      onChange={(value: number) => {
                                        setWeightEnd([
                                          ...weightEnd.filter(
                                            (weight) => weight.index !== index
                                          ),
                                          { index: index, value: value },
                                        ]);
                                      }}
                                      style={{ width: '40%' }}
                                    />
                                  </Form.Item>
                                </Input.Group>
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                name={[field.name, 'ship_fee']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter the shipping fee.',
                                  },
                                ]}
                                noStyle
                              >
                                <InputNumber
                                  addonBefore='RM'
                                  precision={2}
                                  min={0}
                                  placeholder='Input'
                                />
                              </Form.Item>
                            </Col>

                            {fields.length > 1 ? (
                              <Col>
                                <MinusCircleOutlined
                                  onClick={() => remove(field.name)}
                                />
                              </Col>
                            ) : null}
                          </Row>
                        ))}
                        <Form.Item style={{ margin: 20 }}>
                          <Button
                            type='dashed'
                            onClick={() => add()}
                            style={{ width: '80%' }}
                            icon={<PlusOutlined />}
                          >
                            Add Shipping Fee
                          </Button>
                          <Button
                            type='dashed'
                            onClick={() => {
                              add('The head item', 0);
                            }}
                            style={{ width: '80%', marginTop: '20px' }}
                            icon={<PlusOutlined />}
                          >
                            Add Shipping Fee as first
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
                <Row gutter={20}>
                  <Col>
                    <Form.Item
                      label='Subsequent Price'
                      name='sub_fee'
                      tooltip={{
                        title:
                          'Extra shipping fee charged per subsequent weight when the weight exceeds the specified maximum range',
                      }}
                    >
                      <InputNumber
                        addonBefore='RM'
                        precision={2}
                        min={1}
                        placeholder='Input'
                        onChange={(value) => {
                          if (value) {
                            setSubFee(value);
                          } else {
                            setSubFee(undefined);
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label='Subsequent Weight'
                      name='sub_weight'
                      rules={[
                        {
                          required: subFee ? true : false,
                          message: 'Please enter the subsequent weight.',
                        },
                      ]}
                    >
                      <InputNumber
                        addonAfter='g'
                        min={0}
                        placeholder='Input'
                        disabled={!subFee}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Space>
            </MainCard>

            <AffixAction
              offsetBottom={0}
              label='Shipping Fees'
              loading={submitLoading}
              disabled={loading}
              type='edit'
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

export default ShptFeeEdit;
