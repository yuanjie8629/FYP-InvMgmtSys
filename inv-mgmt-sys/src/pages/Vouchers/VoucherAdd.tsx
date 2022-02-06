import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import AffixAdd from '@components/Affix/AffixAdd';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
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

const VoucherAdd = () => {
  const { Title } = Typography;
  const { Link } = Anchor;
  const [voucherForm] = Form.useForm();
  const [discType, setDiscType] = useState('amount');
  const [usageLimitUltd, setUsageLimitUltd] = useState(false);
  const [availabilityUltd, setAvailabilityUltd] = useState(false);
  const [hideEndTime, setHideEndTime] = useState(true);
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'discSettings', title: 'Discount Settings' },
    { link: 'custEligibility', title: 'Customer Eligibility' },
    { link: 'availPeriod', title: 'Available Period' },
  ];

  const discCat = [
    { value: 'amount', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage' },
  ];

  const custCat = [
    { label: 'Direct Customer', value: 'cust' },
    { label: 'Agent', value: 'agent' },
    { label: 'Dropshipper', value: 'drpshpr' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.5);
  }, []);

  return (
    <Form name='voucherForm' layout='vertical' size='small' form={voucherForm}>
      <Layout>
        <Col xs={16} xl={19} className='centerFlex'>
          <MainCardContainer func='add' className='voucher-add'>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='basicInfo' style={{ fontWeight: 500 }}>
                  Basic Information
                </Title>
                <Form.Item
                  label='Discount Code'
                  name='voucherCde'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the discount code.',
                    },
                  ]}
                >
                  <Input
                    placeholder='e.g. shrfagent'
                    style={{ width: '40%' }}
                  />
                </Form.Item>
                <Form.Item label='Discount Status' name='discStat'>
                  <Checkbox>Hidden</Checkbox>
                </Form.Item>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='discSettings' style={{ fontWeight: 500 }}>
                  Discount Settings
                </Title>
                <Form.Item
                  label='Discount Type'
                  name='discType'
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
                <Form.Item label='Discount Details' name='discDtls' required>
                  <Row gutter={30} style={{ paddingLeft: 25 }}>
                    <Col>
                      <Form.Item
                        label='If Order Amount reaches'
                        name='minSpend'
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
                        name='discAmt'
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
                    {discType === 'percentage' ? (
                      <Col>
                        <Form.Item label='Capped At' name='maxDisc'>
                          <InputNumber
                            addonBefore='RM'
                            precision={2}
                            min={0}
                            placeholder='Input'
                          />
                        </Form.Item>
                      </Col>
                    ) : null}
                  </Row>
                </Form.Item>
                <Form.Item
                  label='Total Voucher to be Issued'
                  name='availability'
                  rules={[
                    {
                      required: true,
                      message:
                        'Please enter the availability number for the discount.',
                    },
                  ]}
                  initialValue={0}
                >
                  <Space size={20}>
                    <InputNumber
                      min={0}
                      onChange={(value) =>
                        voucherForm.setFieldsValue({
                          availability: value,
                        })
                      }
                      defaultValue={0}
                      disabled={availabilityUltd}
                    />
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          voucherForm.setFieldsValue({
                            availability: 'unlimited',
                          });
                          setAvailabilityUltd(true);
                        } else {
                          setAvailabilityUltd(false);
                        }
                      }}
                    >
                      Unlimited
                    </Checkbox>
                  </Space>
                </Form.Item>
                <Form.Item
                  label='Usage Limit per User'
                  name='usageLimit'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the usage limit for each user.',
                    },
                  ]}
                  initialValue={0}
                >
                  <Space size={20}>
                    <InputNumber
                      min={0}
                      onChange={(value) =>
                        voucherForm.setFieldsValue({
                          usageLimit: value,
                        })
                      }
                      defaultValue={0}
                      disabled={usageLimitUltd}
                    />
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          voucherForm.setFieldsValue({
                            usageLimit: 'unlimited',
                          });
                          setUsageLimitUltd(true);
                        } else {
                          setUsageLimitUltd(false);
                        }
                      }}
                    >
                      Unlimited
                    </Checkbox>
                  </Space>
                </Form.Item>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title
                  level={4}
                  id='custEligibility'
                  style={{ fontWeight: 500 }}
                >
                  Customer Eligibility
                </Title>

                <Form.Item
                  label='Applicable to'
                  name='custType'
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
                <Title level={4} id='availPeriod' style={{ fontWeight: 500 }}>
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
                <Checkbox
                  onChange={() =>
                    hideEndTime ? setHideEndTime(false) : setHideEndTime(true)
                  }
                >
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
      </Layout>
    </Form>
  );
};

export default VoucherAdd;
