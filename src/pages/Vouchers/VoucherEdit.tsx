import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import AffixAction from '@components/Affix/AffixAction';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Alert,
  Anchor,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { removeInvalidData } from '@utils/arrayUtils';
import { voucherDetailsAPI, voucherUpdAPI } from '@api/services/voucherAPI';
import { findRoutePath } from '@utils/routingUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { custCat } from '@utils/optionUtils';
import { getDt } from '@utils/dateUtils';
import FormSpin from '@components/Spin/FormSpin';
import moment from 'moment';
import { MessageContext } from '@contexts/MessageContext';

const VoucherEdit = () => {
  const { Text, Title } = Typography;
  const { Link } = Anchor;
  const [voucherForm] = Form.useForm();
  const { id } = useParams();
  const [messageApi] = useContext(MessageContext);
  const [discType, setDiscType] = useState('amount');
  const [availability, setAvailability] = useState<number>();
  const [usageLimit, setUsageLimit] = useState<number>();
  const [autoApply, setAutoApply] = useState(false);
  const [hideEndTime, setHideEndTime] = useState(true);
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'discSettings', title: 'Discount Settings' },
    { link: 'custEligibility', title: 'Customer Eligibility' },
    { link: 'availPeriod', title: 'Available Period' },
  ];

  const [errMsg, setErrMsg] = useState({ type: undefined, message: undefined });
  const [startTime, setStartTime] = useState<moment.Moment>();
  const [endTime, setEndTime] = useState<moment.Moment>();
  const [dataLoading, setDataLoading] = useState(false);
  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showErrMsg = (errMsg?: string) => {
    messageApi.open({ type: 'error', content: errMsg });
  };

  const handleEditVoucher = (values) => {
    if (endTime && startTime.isAfter(endTime)) {
      setErrMsg({
        type: 'invalid_avail_tm',
        message: 'Start date cannot after end date.',
      });
      showErrMsg('Start date cannot after end date.');
      return;
    }

    if (values.status === undefined) values.status = 'active';
    if (discType === 'percentage') {
      values.discount = values.discount / 100;
    }

    values.total_amt = availability;

    values.usage_limit = usageLimit;

    values.avail_start_dt = getDt(values.avail_start_dt);
    if (values.avail_end_dt) values.avail_end_dt = getDt(values.avail_end_dt);
    values = removeInvalidData(values);

    setLoading(true);
    voucherUpdAPI(id, values)
      .then((res) => {
        setLoading(false);
        navigate(findRoutePath('voucherEditSuccess'));
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          if (err.response?.data?.error?.code === 'invalid_code') {
            setErrMsg({
              type: 'invalid_code',
              message: err.response?.data?.error?.message,
            });
            showErrMsg(err.response?.data?.error?.message);
          } else {
            showServerErrMsg();
          }
        }
      });
  };

  const discCat = [
    { value: 'amount', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage' },
  ];

  useEffect(() => {
    let isMounted = true;
    setTargetOffset(window.innerHeight / 1.5);
    if (id) {
      setDataLoading(true);
      voucherDetailsAPI(id)
        .then((res) => {
          if (isMounted) {
            let { avail_start_dt, avail_end_dt, ...data } = res.data;
            voucherForm.setFieldsValue(data);
            voucherForm.setFieldsValue({
              avail_start_dt: moment(avail_start_dt, 'DD-MM-YYYY'),
            });
            setStartTime(moment(avail_start_dt, 'DD-MM-YYYY'));
            voucherForm.setFieldsValue({
              avail_end_dt:
                avail_end_dt !== '31-12-9999'
                  ? moment(avail_end_dt, 'DD-MM-YYYY')
                  : undefined,
            });
            setEndTime(
              avail_end_dt !== '31-12-9999'
                ? moment(avail_end_dt, 'DD-MM-YYYY')
                : undefined
            );

            setAutoApply(res.data.auto_apply);

            setAvailability(data.total_amt);

            setUsageLimit(data.usage_limit);

            setDataLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setDataLoading(false);
            showServerErrMsg();
          }
        });
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Form
      name='voucherForm'
      layout='vertical'
      size='small'
      form={voucherForm}
      scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
      onFinish={handleEditVoucher}
    >
      <Layout>
        <FormSpin visible={dataLoading || loading} />
        <Col xs={16} xl={19} className='center-flex'>
          <MainCardContainer>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='basicInfo'>
                  Basic Information
                </Title>
                <Form.Item
                  label='Discount Code'
                  name='code'
                  validateStatus={errMsg.type === 'invalid_code' && 'error'}
                  help={errMsg.type === 'invalid_code' && errMsg.message}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the discount code.',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Please enter the discount code.'
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder='e.g. shrfagent'
                    style={{ width: '40%' }}
                    onChange={() => {
                      if (errMsg.type === 'invalid_code') {
                        setErrMsg({ type: undefined, message: undefined });
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item label='Discount Status' name='status'>
                  <Checkbox>Hidden</Checkbox>
                </Form.Item>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='discSettings'>
                  Discount Settings
                </Title>
                <Form.Item
                  label='Discount Type'
                  name='type'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the discount type.',
                    },
                  ]}
                  initialValue='amount'
                >
                  <Radio.Group
                    options={discCat}
                    onChange={(e) => setDiscType(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label='Discount Details' required>
                  <Row gutter={30} style={{ paddingLeft: 25 }}>
                    <Col>
                      <Form.Item
                        label='If Order Amount reaches'
                        name='min_spend'
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
                        label='Discount would be'
                        name='discount'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter the discount.',
                          },
                        ]}
                      >
                        {discType === 'percentage' ? (
                          <InputNumber
                            addonAfter='% off'
                            min={0}
                            max={100}
                            placeholder='Input'
                          />
                        ) : (
                          <InputNumber
                            addonBefore='RM'
                            precision={2}
                            min={0}
                            placeholder='Input'
                          />
                        )}
                      </Form.Item>
                    </Col>
                    {discType === 'percentage' && (
                      <Col>
                        <Form.Item label='Capped At' name='max_discount'>
                          <InputNumber
                            addonBefore='RM'
                            precision={2}
                            min={0}
                            placeholder='Input'
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                </Form.Item>
                <Form.Item
                  label='Total Voucher to be Issued'
                  name='total_amt'
                  required
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value && availability === undefined) {
                          return Promise.reject(
                            'Please enter the availability number for the discount.'
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Space size={20}>
                    <InputNumber
                      min={0}
                      value={availability !== -1 ? availability : undefined}
                      onChange={(value) => {
                        voucherForm.setFieldsValue({
                          availability: value,
                        });
                        setAvailability(value);
                      }}
                      disabled={availability === -1}
                    />
                    <Checkbox
                      checked={availability === -1}
                      onChange={(e) => {
                        if (e.target.checked) {
                          voucherForm.setFieldsValue({
                            total_amt: '-1',
                          });
                          setAvailability(-1);
                        } else {
                          voucherForm.resetFields(['total_amt']);
                          setAvailability(undefined);
                        }
                      }}
                    >
                      Unlimited
                    </Checkbox>
                  </Space>
                </Form.Item>
                <Form.Item
                  label='Usage Limit per User'
                  name='usage_limit'
                  required
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value && usageLimit === undefined) {
                          return Promise.reject(
                            'Please enter the usage limit for the discount.'
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Space size={20}>
                    <InputNumber
                      min={0}
                      value={
                        voucherForm.getFieldValue('usage_limit') === -1
                          ? ''
                          : voucherForm.getFieldValue('usage_limit')
                      }
                      onChange={(value) => {
                        voucherForm.setFieldsValue({
                          usageLimit: value,
                        });
                        setUsageLimit(value);
                      }}
                      disabled={usageLimit === -1}
                    />
                    <Checkbox
                      checked={usageLimit === -1}
                      onChange={(e) => {
                        if (e.target.checked) {
                          voucherForm.setFieldsValue({
                            usage_limit: '-1',
                          });
                          setUsageLimit(-1);
                        } else {
                          voucherForm.resetFields(['usage_limit']);
                          setUsageLimit(undefined);
                        }
                      }}
                    >
                      Unlimited
                    </Checkbox>
                  </Space>
                </Form.Item>
                <Form.Item name='auto_apply'>
                  <Checkbox
                    checked={autoApply}
                    onChange={(e) => {
                      if (e.target.checked) {
                        voucherForm.setFieldsValue({ auto_apply: true });
                        setAutoApply(true);
                      } else {
                        voucherForm.setFieldsValue({ auto_apply: false });
                        setAutoApply(false);
                      }
                    }}
                  >
                    Auto Apply
                  </Checkbox>
                </Form.Item>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='custEligibility'>
                  Customer Eligibility
                </Title>

                <Form.Item
                  label='Applicable to'
                  name='cust_type'
                  rules={[
                    {
                      required: true,
                      message: 'Please select at least one customer role.',
                    },
                  ]}
                  style={{ width: '40%' }}
                >
                  <Checkbox.Group>
                    <Space direction='vertical'>
                      {custCat.map((type) => (
                        <Checkbox key={type.value} value={type.value}>
                          {type.label}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Form.Item>
              </Space>
            </MainCard>

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
                        'Please select the start date to launch the voucher.',
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
                    voucherForm.resetFields(['avail_end_dt']);
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

            <AffixAction
              offsetBottom={0}
              label='Voucher'
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

export default VoucherEdit;
