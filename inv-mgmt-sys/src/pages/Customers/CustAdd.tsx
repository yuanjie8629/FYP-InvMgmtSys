import React, { useEffect, useState } from 'react';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall';
import AffixAdd from '@components/Affix/AffixAdd';
import {
  Anchor,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { MaskedInput } from 'antd-mask-input';
import profilePic from '@assets/avatar.png';
import { getStates, getCities, getPostcodes } from 'malaysia-postcodes';

const CustAdd = () => {
  const { Text, Title } = Typography;
  const { Option } = Select;
  const { TextArea } = Input;
  const { Link } = Anchor;
  const [custForm] = Form.useForm();

  const [state, setState] = useState('');
  const [city, setCity] = useState('');

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

  const genderCat = [
    { value: 'm', label: 'Male' },
    { value: 'f', label: 'Female' },
  ];

  const maritalStatCat = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'seperated', label: 'Seperated' },
    { value: 'divorced', label: 'Divorced' },
  ];

  const positionCat = [
    { value: 'agent', label: 'Agent' },
    { value: 'drpshpr', label: 'Dropshipper' },
  ];

  const statusCat = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const ynOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'contactInfo', title: 'Contact Information' },
    { link: 'address', title: 'Address' },
    { link: 'employment', title: 'Employment Details' },
    { link: 'position', title: 'Position' },
    { link: 'declaration', title: 'Declaration Form' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.3);
  }, []);

  return (
    <Layout>
      <div className='cust-add'>
        <Form name='custForm' layout='vertical' size='small' form={custForm}>
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
                        label='Customer Name'
                        name='custNm'
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder='e.g. Tan Yuan Jie'
                          style={{ width: '40%' }}
                        />
                      </Form.Item>

                      <Form.Item
                        label='Customer Photo'
                        name='custImg'
                        rules={[{ required: true }]}
                      >
                        <UploadPicWall
                          fileList={fileList}
                          onChange={(info) => {
                            setFileList([...info.fileList]);
                          }}
                          maxCount={1}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Gender'
                        name='gender'
                        rules={[{ required: true }]}
                      >
                        <Radio.Group options={genderCat} />
                      </Form.Item>
                      <Form.Item
                        label='Birthdate'
                        name='birthdate'
                        rules={[{ required: true }]}
                      >
                        <DatePicker style={{ width: '40%' }} />
                      </Form.Item>

                      <Form.Item label='Marital Status' name='maritalStat'>
                        <Radio.Group options={maritalStatCat} />
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
                      <Title
                        level={4}
                        id='contactInfo'
                        style={{ fontWeight: 500 }}
                      >
                        Contact Information
                      </Title>
                      <div>
                        <Space
                          direction='vertical'
                          size={15}
                          className='width-full'
                        >
                          <Form.Item
                            label='Phone Number'
                            name='phoneNum'
                            rules={[{ required: true }]}
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
                            rules={[{ required: true }]}
                          >
                            <Input
                              type='email'
                              placeholder='e.g. xxxxx@gmail.com'
                              style={{ width: '40%' }}
                            />
                          </Form.Item>
                        </Space>
                        <Divider />
                        <Space
                          direction='vertical'
                          size={15}
                          className='width-full'
                        >
                          <Title level={5} style={{ fontWeight: 500 }}>
                            Emergency Contact
                          </Title>

                          <Form.Item
                            label='Name'
                            name='emerg'
                            rules={[{ required: true }]}
                          >
                            <Input
                              placeholder='e.g. Loo Phaik Cheng'
                              style={{ width: '40%' }}
                            />
                          </Form.Item>

                          <Form.Item
                            label='Relationship'
                            name='relationship'
                            rules={[{ required: true }]}
                          >
                            <Input
                              placeholder='e.g. Mother'
                              style={{ width: '40%' }}
                            />
                          </Form.Item>

                          <Form.Item
                            label='Contact Number'
                            name='emrgContact'
                            rules={[{ required: true }]}
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
                  </ContainerCard>
                </Row>
                <Row justify='center'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title level={4} id='address' style={{ fontWeight: 500 }}>
                        Address
                      </Title>

                      <Form.Item
                        label='State'
                        name='state'
                        rules={[{ required: true }]}
                        style={{ width: '25%' }}
                      >
                        <Select
                          placeholder='Please select the state'
                          value={state}
                          onChange={(value: string) => {
                            setState(value);
                            custForm.resetFields(['city', 'postcode']);
                          }}
                        >
                          {getStates()
                            .sort((a: string, b: string) => a.localeCompare(b))
                            .map((state: string) => (
                              <Option key={state} value={state}>
                                {state}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label='City'
                        name='city'
                        rules={[{ required: true }]}
                        style={{ width: '25%' }}
                      >
                        <Select
                          placeholder='Please select the city'
                          disabled={state === ''}
                          onChange={(value: string) => {
                            setCity(value);
                            custForm.resetFields(['postcode']);
                          }}
                        >
                          {getCities(state)
                            .sort((a: string, b: string) => a.localeCompare(b))
                            .map((city: string) => (
                              <Option key={city}>{city}</Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label='Postal Code'
                        name='postcode'
                        rules={[{ required: true }]}
                        style={{ width: '25%' }}
                      >
                        <Select
                          placeholder='Please select the postal code'
                          disabled={state === '' || city === ''}
                        >
                          {getPostcodes(state, city)
                            .sort((a: string, b: string) => a.localeCompare(b))
                            .map((postcode: string) => (
                              <Option val={postcode} key={postcode}>
                                {postcode}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label='Address'
                        name='address'
                        rules={[{ required: true }]}
                        style={{ width: '60%' }}
                      >
                        <TextArea
                          rows={4}
                          placeholder="Please enter customer's address"
                          showCount
                          maxLength={128}
                        />
                      </Form.Item>
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
                        id='employment'
                        style={{ fontWeight: 500 }}
                      >
                        Employment Details
                      </Title>
                      <Form.Item
                        label='Current Occupation'
                        name='occupation'
                        rules={[{ required: true }]}
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
                        id='position'
                        style={{ fontWeight: 500 }}
                      >
                        Position
                      </Title>
                      <Form.Item
                        label="Customer's Position"
                        name='position'
                        rules={[{ required: true }]}
                      >
                        <Radio.Group options={positionCat} />
                      </Form.Item>
                      <Form.Item
                        label='Status'
                        name='status'
                        rules={[{ required: true }]}
                      >
                        <Radio.Group options={statusCat} />
                      </Form.Item>
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
                        id='declaration'
                        style={{ fontWeight: 500 }}
                      >
                        Declaration Form
                      </Title>
                      <Form.Item
                        label="Has the customer been declared bankrupt? "
                        name='bankrupt'
                        rules={[{ required: true }]}
                      >
                        <Radio.Group options={ynOptions} />
                      </Form.Item>
                      <Form.Item
                        label='Has the customer been charged in court? '
                        name='court'
                        rules={[{ required: true }]}
                      >
                        <Radio.Group options={ynOptions} />
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
      </div>
    </Layout>
  );
};

export default CustAdd;
