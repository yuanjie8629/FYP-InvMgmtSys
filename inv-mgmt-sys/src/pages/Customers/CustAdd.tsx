import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall/UploadPicWall';
import AffixAdd from '@components/Affix/AffixAdd';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Anchor,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Typography,
} from 'antd';
import { MaskedInput } from 'antd-mask-input';
import profilePic from '@assets/avatar.png';
import { getStates, getCities, getPostcodes } from 'malaysia-postcodes';
import { sortByOrder } from '@utils/sortUtils';
import {
  custPositionCat,
  custStatusCat,
  genderCat,
  maritalStatCat,
  ynOptions,
} from '@utils/optionUtils';

const CustAdd = () => {
  const { Title } = Typography;
  const { Option } = Select;
  const { TextArea } = Input;
  const { Link } = Anchor;
  const [custForm] = Form.useForm();

  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [courtFlag, setCourtFlag] = useState(false);
  const [criminalFlag, setCriminalFlag] = useState(false);
  const [relativeFlag, setRelativeFlag] = useState(false);

  const [fileList, setFileList]: any = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: profilePic,
    },
  ]);

  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'contactInfo', title: 'Contact Information' },
    { link: 'address', title: 'Address' },
    { link: 'employment', title: 'Employment Details' },
    { link: 'position', title: 'Position' },
    { link: 'declaration', title: 'Declaration Form' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.5);
  }, []);

  return (
    <Form name='custForm' layout='vertical' size='small' form={custForm}>
      <Layout>
        <Col xs={16} xl={19} className='centerFlex'>
          <MainCardContainer func='add' className='cust-add'>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='basicInfo' style={{ fontWeight: 500 }}>
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
                  label='Customer Photo'
                  name='custImg'
                  rules={[
                    {
                      required: true,
                      message: 'Please upload the customer photo.',
                    },
                  ]}
                >
                  <UploadPicWall
                    fileList={fileList}
                    onChange={(info) => {
                      setFileList([...info.fileList]);
                    }}
                    maxCount={1}
                    accept='.jpg'
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
                <Title level={4} id='contactInfo' style={{ fontWeight: 500 }}>
                  Contact Information
                </Title>
                <div>
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
                  <Divider />
                  <Space direction='vertical' size={15} className='full-width'>
                    <Title level={5} style={{ fontWeight: 500 }}>
                      Emergency Contact
                    </Title>

                    <Form.Item
                      label='Name'
                      name='emerg'
                      rules={[
                        {
                          required: true,
                          message:
                            'Please enter the name of the emergency contact.',
                        },
                      ]}
                    >
                      <Input
                        placeholder='e.g. Loo Phaik Cheng'
                        style={{ width: '40%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label='Relationship'
                      name='relationship'
                      rules={[
                        {
                          required: true,
                          message:
                            'Please justify the relationship with the emergency contact.',
                        },
                      ]}
                    >
                      <Input
                        placeholder='e.g. Mother'
                        style={{ width: '40%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label='Contact Number'
                      name='emrgContact'
                      rules={[
                        {
                          required: true,
                          message:
                            'Please provide the contact number of the emergency contact.',
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
                  </Space>
                </div>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='address' style={{ fontWeight: 500 }}>
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
                <Title level={4} id='employment' style={{ fontWeight: 500 }}>
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
                <Title level={4} id='position' style={{ fontWeight: 500 }}>
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

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='declaration' style={{ fontWeight: 500 }}>
                  Declaration Form
                </Title>
                <Form.Item
                  label='Has the customer been declared bankrupt? '
                  name='bankrupt'
                  rules={[
                    {
                      required: true,
                      message: 'Please answer the above question.',
                    },
                  ]}
                >
                  <Radio.Group options={ynOptions} />
                </Form.Item>

                <Form.Item
                  label='Has the customer been charged in court?'
                  name='court'
                  rules={[
                    {
                      required: true,
                      message: 'Please answer the above question.',
                    },
                  ]}
                >
                  <Radio.Group
                    options={ynOptions}
                    onChange={(e: any) => setCourtFlag(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label='Please include any guilty pleas or convictions based on the plea bargain or pretrial diversion program:'
                  name='courtDesc'
                  rules={[
                    {
                      required: true,
                      message: 'Please answer the above question.',
                    },
                  ]}
                  style={{ marginLeft: 10, width: '60%' }}
                  hidden={!courtFlag}
                >
                  <TextArea
                    rows={4}
                    showCount
                    maxLength={128}
                    autoSize={{ minRows: 4, maxRows: 12 }}
                  />
                </Form.Item>
                <Form.Item
                  label='Do the customer has any criminal record or any pending criminal case?'
                  name='criminal'
                  rules={[
                    {
                      required: true,
                      message: 'Please answer the above question.',
                    },
                  ]}
                >
                  <Radio.Group
                    options={ynOptions}
                    onChange={(e: any) => setCriminalFlag(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label='Please explain:'
                  name='criminalDesc'
                  rules={[
                    {
                      required: true,
                      message: 'Please answer the above question.',
                    },
                  ]}
                  style={{ marginLeft: 10, width: '60%' }}
                  hidden={!criminalFlag}
                >
                  <TextArea
                    rows={4}
                    showCount
                    maxLength={128}
                    autoSize={{ minRows: 4, maxRows: 12 }}
                  />
                </Form.Item>
                <Form.Item
                  label='Are any relatives or family members of the customer currently employed as the agent or drop-shipper in Sharifah Food?'
                  name='relative'
                  rules={[
                    {
                      required: true,
                      message: 'Please answer the above question.',
                    },
                  ]}
                >
                  <Radio.Group
                    options={ynOptions}
                    onChange={(e: any) => setRelativeFlag(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label='Please specify the name(s) of relative(s) or family member(s):'
                  name='relativeDesc'
                  rules={[
                    {
                      required: true,
                      message: 'Please answer the above question.',
                    },
                  ]}
                  style={{ marginLeft: 10, width: '60%' }}
                  hidden={!relativeFlag}
                >
                  <TextArea
                    rows={4}
                    showCount
                    maxLength={128}
                    autoSize={{ minRows: 4, maxRows: 12 }}
                  />
                </Form.Item>
              </Space>
            </MainCard>
            <AffixAdd offsetBottom={0} label='Product' />
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
