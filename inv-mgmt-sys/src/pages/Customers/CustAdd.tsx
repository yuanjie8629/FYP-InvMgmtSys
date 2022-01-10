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
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { MaskedInput } from 'antd-mask-input';
import profilePic from '@assets/avatar.png';

const CustAdd = () => {
  const { Text, Title } = Typography;
  const { Link } = Anchor;
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

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'pricing', title: 'Pricing' },
    { link: 'inv', title: 'Inventory' },
    { link: 'shipping', title: 'Shipping' },
  ];

  const stateSelection = [
    { value: 'johor', label: 'Johor' },
    { value: 'kedah', label: 'Kedah' },
    { value: 'kelantan', label: 'Kelantan' },
    { value: 'kl', label: 'Kuala Lumpur' },
    { value: 'labuan', label: 'Labuan' },
    { value: 'malacca', label: 'Malacca' },
    { value: 'negeriSembilan', label: 'Negeri Sembilan' },
    { value: 'pahang', label: 'Pahang' },
    { value: 'penang', label: 'Penang' },
    { value: 'perak', label: 'Perak' },
    { value: 'perlis', label: 'Perlis' },
    { value: 'putrajaya', label: 'Putrajaya' },
    { value: 'sabah', label: 'Sabah' },
    { value: 'sarawak', label: 'Sarawak' },
    { value: 'selangor', label: 'Selangor' },
    { value: 'terrengganu', label: 'Terengganu' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.65);
  }, []);

  return (
    <Layout>
      <div className='cust-add'>
        <Form name='custForm' layout='vertical' size='small'>
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
                      <Title level={4} id='inv' style={{ fontWeight: 500 }}>
                        Address
                      </Title>
                      <div>
                        <Form.Item
                          label='State'
                          name='state'
                          rules={[{ required: true }]}
                          style={{ width: '20%' }}
                        >
                          <Select
                            options={stateSelection}
                            placeholder='Please select the state'
                          />
                        </Form.Item>

                        <Form.Item
                          label='Stock Quantity'
                          name='prodQuantity'
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0} defaultValue={0}></InputNumber>
                        </Form.Item>

                        <Divider />
                        <Row gutter={30}>
                          <Col>
                            <Form.Item
                              label='Average Lead Time'
                              name='avgLeadTime'
                              tooltip={{
                                title: 'Average Lead Time',
                              }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='Input'
                                addonAfter='Days'
                              ></InputNumber>
                            </Form.Item>
                          </Col>
                          <Col>
                            <Form.Item
                              label='Maximum Lead Time'
                              name='maxLeadTime'
                              tooltip={{
                                title: 'Maximum Lead Time',
                              }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='Input'
                                addonAfter='Days'
                              ></InputNumber>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
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
                        id='shipping'
                        style={{ fontWeight: 500 }}
                      >
                        Shipping
                      </Title>
                      <Form.Item
                        label='Weight (kg)'
                        name='prodWeight'
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={0}
                          defaultValue={0}
                          style={{ width: '10%' }}
                        ></InputNumber>
                      </Form.Item>

                      <Form.Item
                        label='Dimension (cm)'
                        name='prodDimension'
                        rules={[{ required: true }]}
                      >
                        <Space size={10}>
                          <InputNumber
                            min={0}
                            placeholder='Length'
                            addonAfter='cm'
                          ></InputNumber>
                          <Text type='secondary'>x</Text>
                          <InputNumber
                            min={0}
                            placeholder='Width'
                            addonAfter='cm'
                          ></InputNumber>
                          <Text type='secondary'>x</Text>
                          <InputNumber
                            min={0}
                            placeholder='Height'
                            addonAfter='cm'
                          ></InputNumber>
                        </Space>
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
