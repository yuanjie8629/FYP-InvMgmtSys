import React, { useEffect, useState } from 'react';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import UploadPicWall from '@components/Upload/UploadPicWall';
import Table from '@components/Table/Table';
import AffixAdd from '@components/Affix/AffixAdd';
import {
  Anchor,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
} from 'antd';

const PackAdd = () => {
  const { Text, Title, Paragraph } = Typography;
  const { Link } = Anchor;
  const [hideEndTime, setHideEndTime] = useState(true);
  const [fileList, setFileList]: any = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://www.sharifahfood.com/wp-content/uploads/2020/10/BG-3.png',
    },
  ]);

  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );

  const anchorList = [
    { link: 'basicInfo', title: 'Basic Information' },
    { link: 'products', title: 'Products' },
    { link: 'pricing', title: 'Pricing' },
    { link: 'inv', title: 'Inventory' },
    { link: 'shipping', title: 'Shipping' },
    { link: 'availPeriod', title: 'Available Period' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.4);
  }, []);

  return (
    <Layout>
      <div className='pack-mgmt'>
        <Form name='packForm' layout='vertical' size='small'>
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
                        label='Package Name'
                        name='packName'
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder='e.g. Promo Raya Qurban'
                          style={{ width: '40%' }}
                        />
                      </Form.Item>

                      <Form.Item
                        label='Package Image'
                        name='packImg'
                        rules={[{ required: true }]}
                      >
                        <UploadPicWall
                          fileList={fileList}
                          onChange={(info) => {
                            setFileList([...info.fileList]);
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Package Description'
                        name='packDesc'
                        rules={[{ required: true }]}
                      >
                        <Input.TextArea style={{ height: 200 }} />
                      </Form.Item>
                      <Form.Item label='Package Status' name='packStat'>
                        <Checkbox>Hidden</Checkbox>
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
                        id='products'
                        style={{ fontWeight: 500 }}
                      >
                        Products
                      </Title>

                      <Form.Item label='Products To Be Included' name='prodName'>
                        <Input
                          placeholder='Product Name'
                          style={{ width: '40%' }}
                        />
                        <Paragraph className='color-grey'>
                          Note: Selected products will be displayed below.
                        </Paragraph>
                      </Form.Item>
                      <Table />
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
                      <Title level={4} id='pricing' style={{ fontWeight: 500 }}>
                        Pricing
                      </Title>
                      <Row gutter={30}>
                        <Col>
                          <Form.Item
                            label='Price'
                            name='packPrice'
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              addonBefore='RM'
                              precision={2}
                              min={0}
                              placeholder='Input'
                            ></InputNumber>
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item
                            label='Special Price'
                            name='packSPrice'
                            tooltip={{
                              title: 'Discounted Price',
                            }}
                          >
                            <InputNumber
                              addonBefore='RM'
                              precision={2}
                              min={0}
                              placeholder='Input'
                            ></InputNumber>
                          </Form.Item>
                        </Col>
                      </Row>
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
                        Inventory
                      </Title>

                      <Form.Item
                        label='Stock Keeping Unit (SKU)'
                        name='packSKU'
                        rules={[{ required: true }]}
                        style={{ width: '40%' }}
                      >
                        <Input placeholder='e.g. SHRF-PP-PRQ' />
                      </Form.Item>

                      <Form.Item
                        label='Stock Quantity'
                        name='packQuantity'
                        rules={[{ required: true }]}
                      >
                        <InputNumber min={0} defaultValue={0}></InputNumber>
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
                        id='shipping'
                        style={{ fontWeight: 500 }}
                      >
                        Shipping
                      </Title>
                      <Form.Item
                        label='Weight (kg)'
                        name='packWeight'
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
                        name='packDimension'
                        rules={[{ required: true }]}
                      >
                        <Space size={10}>
                          <InputNumber
                            min={0}
                            placeholder='Length'
                            addonAfter='cm'
                          ></InputNumber>
                          <Text className='color-grey'>x</Text>
                          <InputNumber
                            min={0}
                            placeholder='Width'
                            addonAfter='cm'
                          ></InputNumber>
                          <Text className='color-grey'>x</Text>
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
                <Row justify='center' className='width-full'>
                  <ContainerCard>
                    <Space
                      direction='vertical'
                      size={20}
                      className='width-full'
                    >
                      <Title
                        level={4}
                        id='availPeriod'
                        style={{ fontWeight: 500 }}
                      >
                        Available Period
                      </Title>
                      <Form.Item
                        label='Start Time'
                        name='packStartTime'
                        rules={[{ required: true }]}
                      >
                        <DatePicker
                          showTime
                          placeholder='Select Date and Time'
                        />
                      </Form.Item>
                      <Checkbox
                        onChange={() =>
                          hideEndTime
                            ? setHideEndTime(false)
                            : setHideEndTime(true)
                        }
                      >
                        Set End Time
                      </Checkbox>

                      <Form.Item
                        label='End Time'
                        name='packEndTime'
                        hidden={hideEndTime}
                      >
                        <DatePicker
                          showTime
                          placeholder='Select Date and Time'
                        />
                      </Form.Item>
                    </Space>
                  </ContainerCard>
                </Row>
              </Space>
              <AffixAdd offsetBottom={0} label='Package' />
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

export default PackAdd;
