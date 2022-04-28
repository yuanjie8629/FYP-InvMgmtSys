import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import {
  Anchor,
  Col,
  Descriptions,
  Divider,
  List,
  Row,
  Skeleton,
  Space,
  Steps,
  Typography,
} from 'antd';
import { MessageContext } from '@contexts/MessageContext';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { useParams } from 'react-router-dom';
import {
  orderCancelAPI,
  orderDetailsAPI,
  orderInvoiceAPI,
  orderPickupUpdAPI,
  orderTrackNumUpdAPI,
} from '@api/services/orderAPI';
import {
  HiCheckCircle,
  HiClipboardCheck,
  HiCube,
  HiTruck,
  HiXCircle,
} from 'react-icons/hi';
import AffixOrder from '@components/Affix/AffixOrder';
import { ActionModal } from '@components/Modal';
import { getOrderDetails } from './orderUtils';
import Button from '@components/Button';
import { saveAs } from 'file-saver';

const OrderView = () => {
  const { Text, Title } = Typography;
  const { Link } = Anchor;
  const { Step } = Steps;
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [messageApi] = useContext(MessageContext);
  const [selected, setSelected] = useState<any>();

  const getOrderData = (isMounted = true) => {
    setLoading(true);
    orderDetailsAPI(id)
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    setTargetOffset(window.innerHeight / 2.5);
    if (id) {
      getOrderData(isMounted);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showActionSuccessMsg = (
    action: 'update' | 'invoice',
    isMulti: boolean = true
  ) => {
    messageApi.open(
      actionSuccessMsg(
        action === 'invoice' ? 'Invoice' : 'Order',
        action,
        isMulti ? selected.length : 1
      )
    );
  };

  const anchorList = [
    { link: 'orderInfo', title: 'Order Information' },
    { link: 'orderStatus', title: 'Order Status' },
    {
      link: 'shipmentInfo',
      title: data['pickup'] ? 'Pickup Information' : 'Shipping Information',
    },
    { link: 'orderSummary', title: 'Order Summary' },
  ];

  const shipmentSteps = [
    { status: 'toShip', value: 0 },
    { status: 'shipping', value: 1 },
    { status: 'completed', value: 2 },
  ];

  const pickupSteps = [
    { status: 'toPickup', value: 1 },
    { status: 'completed', value: 2 },
  ];

  const ListItem = (item) => (
    <List.Item>
      <Row justify='space-between' className='full-width'>
        <Col xs={16}>
          <Space align='start' className='full-width'>
            <img
              src={item.thumbnail}
              alt={item.id}
              width={124}
              style={{ border: '1px solid #e5e7eb' }}
            />
            <Space
              direction='vertical'
              size={10}
              className='full-width'
              style={{ textAlign: 'start' }}
            >
              <Text strong className='text-lg'>
                {item.name}
              </Text>
              <Space size={10} className='full-width'>
                <Text type='secondary'>Quantity:</Text>
                <Text strong className='text-lg'>
                  {item.quantity}
                </Text>
              </Space>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space
            direction='vertical'
            size={0}
            className='full-width'
            style={{ textAlign: 'end' }}
          >
            <Text
              type={item.special_price ? 'secondary' : undefined}
              strong
              className='text-lg'
              delete={item.special_price}
            >
              RM {item.price}
            </Text>
            {item.special_price && (
              <Text strong className='color-primary text-lg'>
                RM {item.special_price}
              </Text>
            )}
          </Space>
        </Col>
      </Row>
    </List.Item>
  );

  return (
    <Layout>
      <Col xs={16} xl={19} className='center-flex'>
        <MainCardContainer>
          <MainCard>
            <Space direction='vertical' size={20} className='full-width'>
              <Title level={5} id='orderInfo'>
                Order Information
              </Title>

              {loading ? (
                <Skeleton
                  active
                  title={null}
                  paragraph={{ rows: 4, width: '100%' }}
                />
              ) : (
                <Descriptions column={1} bordered>
                  <Descriptions.Item
                    label='Order Number'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    #{id}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Order Date'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['order_time']}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Customer Email'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['email']}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Space>
          </MainCard>
          <MainCard>
            <Space direction='vertical' size={20} className='full-width'>
              <Title level={5} id='orderStatus'>
                Order Status
              </Title>

              {loading ? (
                <Skeleton
                  active
                  title={null}
                  paragraph={{ rows: 2, width: '100%' }}
                />
              ) : data['shipment'] ? (
                <Steps
                  labelPlacement='vertical'
                  size='small'
                  current={
                    shipmentSteps.find((step) => step.status === data['status'])
                      ?.value
                  }
                >
                  {data['status'] === 'cancel' ? (
                    <Step
                      icon={<HiXCircle />}
                      title='Cancelled'
                      status='error'
                    />
                  ) : (
                    <Step
                      icon={<HiClipboardCheck />}
                      title={data['status'] !== 'unpaid' ? 'Paid' : 'Unpaid'}
                      status={data['status'] === 'unpaid' ? 'error' : undefined}
                    />
                  )}
                  <Step icon={<HiTruck />} title='Shipped' />
                  <Step icon={<HiCheckCircle />} title='Completed' />
                </Steps>
              ) : (
                <Steps
                  labelPlacement='vertical'
                  current={
                    pickupSteps.find((step) => step.status === data['status'])
                      ?.value
                  }
                >
                  {data['status'] === 'cancel' ? (
                    <Step
                      icon={<HiXCircle />}
                      title='Cancelled'
                      status='error'
                    />
                  ) : (
                    <Step
                      icon={<HiClipboardCheck />}
                      title={data['status'] !== 'unpaid' ? 'Paid' : 'Unpaid'}
                      status={data['status'] === 'unpaid' ? 'error' : undefined}
                    />
                  )}
                  <Step icon={<HiCube />} title='To Pickup' />
                  <Step icon={<HiCheckCircle />} title='Completed' />
                </Steps>
              )}
            </Space>
          </MainCard>
          <MainCard>
            <Space direction='vertical' size={20} className='full-width'>
              <Title level={5} id='shipmentInfo'>
                {data['pickup'] ? 'Pickup Information' : 'Shipping Information'}
              </Title>

              {loading ? (
                <Skeleton
                  active
                  title={null}
                  paragraph={{ rows: 6, width: '100%' }}
                />
              ) : data['pickup'] ? (
                <Descriptions column={1} bordered>
                  <Descriptions.Item
                    label='Contact Name'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['pickup']?.contact_name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Contact Number'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['pickup']?.contact_num}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Location'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['pickup']?.location}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Pickup Date'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['pickup'].pickup_dt ? (
                      data['pickup']?.pickup_dt
                    ) : (
                      <Text type='secondary'>Pending pickup</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Descriptions column={1} bordered>
                  <Descriptions.Item
                    label='Contact Name'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['shipment']?.contact_name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Contact Number'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['shipment']?.contact_num}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Address'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['shipment']?.address}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='State'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['shipment']?.postcode?.state}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='City'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['shipment']?.postcode?.city}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Postcode'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['shipment']?.postcode?.postcode}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label='Tracking Number'
                    span={12}
                    style={{ fontWeight: 600 }}
                  >
                    {data['shipment']?.track_num ? (
                      <Button
                        type='link'
                        color='info'
                        onClick={() => {
                          window['linkTrack'](data['shipment']?.track_num);
                        }}
                      >
                        #{data['shipment']?.track_num}
                      </Button>
                    ) : (
                      <Text type='danger'>Pending</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Space>
          </MainCard>
          <MainCard>
            <Space direction='vertical' size={20} className='full-width'>
              <Title level={5} id='orderSummary'>
                Order Summary
              </Title>
              <Divider style={{ margin: 0 }} />
              {loading ? (
                <Skeleton
                  active
                  avatar={{ shape: 'square', size: 124 }}
                  paragraph={{ rows: 2 }}
                />
              ) : (
                <List dataSource={data['item']} renderItem={ListItem} />
              )}

              <Divider style={{ margin: 0 }} />
              <div>
                <Row justify='space-between' style={{ margin: '15px 0' }}>
                  <Col>
                    <Text className='text-lg'>Subtotal</Text>
                  </Col>
                  <Col>
                    <Text strong className='text-lg'>
                      {loading || !data['subtotal']
                        ? 'Loading...'
                        : `RM ${data['subtotal']}`}
                    </Text>
                  </Col>
                </Row>
                {!data['pickup'] && (
                  <Row
                    justify='space-between'
                    align='bottom'
                    style={{ margin: '15px 0' }}
                  >
                    <Col>
                      <Text className='text-lg'>Shipping</Text>
                    </Col>
                    <Col>
                      {loading || !data['shipment']?.ship_fee ? (
                        <Text strong className='text-lg'>
                          Loading...
                        </Text>
                      ) : (
                        <Text strong className='text-lg'>
                          RM {data['shipment']?.ship_fee}
                        </Text>
                      )}
                    </Col>
                  </Row>
                )}
                {data['discount'] > 0 && (
                  <Row justify='space-between' style={{ margin: '15px 0' }}>
                    <Col>
                      <Text className='text-lg'>
                        Discount {data['voucher'] ? `(${data['voucher']})` : ''}
                      </Text>
                    </Col>
                    <Col>
                      <Text strong className='text-lg'>
                        {loading || !data['discount']
                          ? 'Loading...'
                          : `- RM ${data['discount']}`}
                      </Text>
                    </Col>
                  </Row>
                )}
                <Divider style={{ margin: 0 }} />
                <Row justify='space-between' style={{ margin: '15px 0' }}>
                  <Col>
                    <Text strong className='text-lg color-primary'>
                      Total
                    </Text>
                  </Col>
                  <Col>
                    <Text strong className='text-lg color-primary'>
                      {loading || !data['total_amt']
                        ? 'Loading...'
                        : `RM ${data['total_amt']}`}
                    </Text>
                  </Col>
                </Row>
              </div>
            </Space>
          </MainCard>
          <AffixOrder
            offsetBottom={0}
            disabled={loading}
            trackNum={data['shipment'] !== undefined}
            pickup={data['pickup'] !== undefined}
            status={data['status']}
            onClick={(type) => {
              if (type === 'cancel') {
                setSelected(getOrderDetails([data]));
                ActionModal.show('cancel', {
                  onOk: async () => {
                    await orderCancelAPI([{ id: data['id'] }])
                      .then(() => {
                        getOrderData();
                        showActionSuccessMsg('update', false);
                      })
                      .catch((err) => {
                        if (err.response?.status !== 401) {
                          showServerErrMsg();
                        }
                      });
                  },
                });
              } else if (type === 'trackNum') {
                setSelected(getOrderDetails([data]));
                ActionModal.show('orderBulkUpd', {
                  onOk: async (data) => {
                    await orderTrackNumUpdAPI(data)
                      .then(() => {
                        getOrderData();
                        showActionSuccessMsg('update', false);
                      })
                      .catch((err) => {
                        if (err.response?.status !== 401) {
                          showServerErrMsg();
                        }
                      });
                  },
                });
              } else if (type === 'pickup') {
                setSelected(getOrderDetails([data]));
                ActionModal.show('pickup', {
                  onOk: async () => {
                    await orderPickupUpdAPI([{ id: data['id'] }])
                      .then(() => {
                        getOrderData();
                        showActionSuccessMsg('update', false);
                      })
                      .catch((err) => {
                        if (err.response?.status !== 401) {
                          showServerErrMsg();
                        }
                      });
                  },
                });
              } else if (type === 'invoice') {
                setSelected(getOrderDetails([data]));
                ActionModal.show('invoice', {
                  onOk: async () => {
                    await orderInvoiceAPI(data['id'])
                      .then((res) => {
                        saveAs(res.data, `${data['id']}.pdf`);
                        showActionSuccessMsg('invoice', false);
                      })
                      .catch((err) => {
                        if (err.response?.status !== 401) {
                          showServerErrMsg();
                        }
                      });
                  },
                });
              }
            }}
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
      <ActionModal recordType='order' dataSource={selected} />
    </Layout>
  );
};

export default OrderView;
