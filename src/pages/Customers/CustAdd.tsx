import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import AffixAction from '@components/Affix/AffixAction';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Anchor,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Typography,
} from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { getStates, getCities, getPostcodes } from 'malaysia-postcodes';
import { sortByOrder } from '@utils/arrayUtils';
import {
  custPositionCat,
  custStatusCat,
  genderCat,
  maritalStatCat,
} from '@utils/optionUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';

const CustAdd = () => {
  const { Title } = Typography;
  const { Option } = Select;
  const { TextArea } = Input;
  const { Link } = Anchor;
  const [custForm] = Form.useForm();

  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [messageApi] = useContext(MessageContext);

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'contactInfo', title: 'Contact Information' },
    { link: 'address', title: 'Address' },
    { link: 'employment', title: 'Employment Details' },
    { link: 'position', title: 'Position' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.5);
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => messageApi.destroy('serverErr'), 3000);
  };

  return (
    <Form name='custForm' layout='vertical' size='small' form={custForm}>
      <Layout>
        <Col xs={16} xl={19} className='center-flex'>
          <MainCardContainer>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='basicInfo'>
                  Basic Information
                </Title>
                <Form.Item
                  label='Customer Name'
                  name='custNm'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the customer name.',
                    },
                  ]}
                >
                  <Input
                    placeholder='e.g. Tan Yuan Jie'
                    style={{ width: '40%' }}
                  />
                </Form.Item>

                <Form.Item
                  label='Gender'
                  name='gender'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the customer gender.',
                    },
                  ]}
                >
                  <Radio.Group options={genderCat} />
                </Form.Item>
                <Form.Item
                  label='Birthdate'
                  name='birthdate'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the customer birthdate.',
                    },
                  ]}
                >
                  <DatePicker style={{ width: '40%' }} />
                </Form.Item>

                <Form.Item label='Marital Status' name='maritalStat'>
                  <Radio.Group options={maritalStatCat} />
                </Form.Item>
              </Space>
            </MainCard>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='contactInfo'>
                  Contact Information
                </Title>

                <Space direction='vertical' size={15} className='full-width'>
                  <Form.Item
                    label='Phone Number'
                    name='phoneNum'
                    rules={[
                      {
                        required: true,
                        message: "Please enter the customer's phone number.",
                      },
                    ]}
                  >
                    <MaskedInput
                      prefix='(+60)'
                      mask='11-111 1111'
                      placeholderChar=' '
                      placeholder='12-345 6789'
                      style={{ width: '20%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label='Email Address'
                    name='email'
                    rules={[
                      {
                        required: true,
                        message: "Please enter the customer's email address.",
                      },
                    ]}
                  >
                    <Input
                      type='email'
                      placeholder='e.g. xxxxx@gmail.com'
                      style={{ width: '40%' }}
                    />
                  </Form.Item>
                </Space>
              </Space>
            </MainCard>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='address'>
                  Address
                </Title>
                <Form.Item
                  label='State'
                  name='state'
                  rules={[
                    {
                      required: true,
                      message: "Please select the customer's state.",
                    },
                  ]}
                  style={{ width: '25%' }}
                >
                  <Select
                    placeholder='Please select the state'
                    onChange={(value: string) => {
                      setState(value);
                      custForm.resetFields(['city', 'postcode']);
                      setCity('');
                    }}
                  >
                    {sortByOrder(getStates()).map((state: string) => (
                      <Option key={state}>{state}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='City'
                  name='city'
                  rules={[
                    {
                      required: true,
                      message: "Please select the customer's city.",
                    },
                  ]}
                  style={{ width: '25%' }}
                >
                  <Select
                    placeholder='Please select the city'
                    disabled={!state}
                    onChange={(value: string) => {
                      setCity(value);
                      custForm.resetFields(['postcode']);
                    }}
                  >
                    {sortByOrder(getCities(state)).map((city: string) => (
                      <Option key={city}>{city}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Postal Code'
                  name='postcode'
                  rules={[
                    {
                      required: true,
                      message: "Please select the customer's postal code.",
                    },
                  ]}
                  style={{ width: '25%' }}
                >
                  <Select
                    placeholder='Please select the postal code'
                    disabled={!state || !city}
                  >
                    {sortByOrder(getPostcodes(state, city)).map(
                      (postcode: string) => (
                        <Option value={postcode} key={postcode}>
                          {postcode}
                        </Option>
                      )
                    )}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Address'
                  name='address'
                  rules={[
                    {
                      required: true,
                      message: "Please enter the customer's address.",
                    },
                  ]}
                  style={{ width: '60%' }}
                >
                  <TextArea
                    rows={4}
                    placeholder="Please enter customer's address"
                    showCount
                    maxLength={128}
                    autoSize={{ minRows: 4, maxRows: 12 }}
                  />
                </Form.Item>
              </Space>
            </MainCard>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='employment'>
                  Employment Details
                </Title>
                <Form.Item
                  label='Current Occupation'
                  name='occupation'
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter the customer's current occupation.",
                    },
                  ]}
                >
                  <Input
                    placeholder='e.g. Marketing Manager'
                    style={{ width: '40%' }}
                  />
                </Form.Item>
                <Form.Item label='Company Name' name='company'>
                  <Input
                    placeholder='e.g. SHRF Food Industries Sdn Bhd'
                    style={{ width: '40%' }}
                  />
                </Form.Item>
              </Space>
            </MainCard>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='position'>
                  Position
                </Title>
                <Form.Item
                  label="Customer's Position"
                  name='position'
                  rules={[
                    {
                      required: true,
                      message: "Please select the customer's position.",
                    },
                  ]}
                >
                  <Radio.Group options={custPositionCat} />
                </Form.Item>
                <Form.Item
                  label='Status'
                  name='status'
                  rules={[
                    {
                      required: true,
                      message: "Please select the customer's status.",
                    },
                  ]}
                >
                  <Radio.Group options={custStatusCat} />
                </Form.Item>
              </Space>
            </MainCard>
            <AffixAction offsetBottom={0} label='Customer' />
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

export default CustAdd;
