import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
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
  Space,
  Typography,
} from 'antd';
import { genderCat } from '@utils/optionUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { custDetailsAPI } from '@api/services/custAPI';
import { useParams } from 'react-router-dom';
import FormSpin from '@components/Spin/FormSpin';
import moment from 'moment';

const CustView = () => {
  const { Title } = Typography;
  const { Link } = Anchor;
  const { id } = useParams();
  const [custForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [messageApi] = useContext(MessageContext);
  const anchorList = [
    { link: 'custInfo', title: 'Customer Information' },
    {
      link: 'posInfo',
      title: 'Order-related Information',
    },
  ];

  const getCustRegDetails = (isMounted = true) => {
    setLoading(true);
    custDetailsAPI(id)
      .then((res) => {
        if (isMounted) {
          let { last_login, date_joined, birthdate, last_order_dt, ...data } =
            res.data;

          if (last_order_dt) {
            data.last_order_dt = moment(last_order_dt, 'DD-MM-YYYY');
          }

          if (birthdate) {
            data.birthdate = moment(birthdate, 'DD-MM-YYYY');
          }
          if (date_joined) {
            data.date_joined = moment(date_joined, 'DD-MM-YYYY');
          }
          if (last_login) {
            data.last_login = moment(last_login, 'DD-MM-YYYY');
          }

          Object.keys(data).forEach((datum) => {
            if (
              data[datum] === undefined ||
              data[datum] === null ||
              data[datum] === ''
            ) {
              data[datum] = 'Not Set';
            }
          });

          custForm.setFieldsValue(data);

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
    setTargetOffset(window.innerHeight / 1.5);
    if (id) {
      getCustRegDetails(isMounted);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Form name='custForm' layout='vertical' size='small' form={custForm}>
      <Layout>
        <FormSpin visible={loading} />
        <Col xs={16} xl={19} className='center-flex'>
          <MainCardContainer>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='custInfo'>
                  Customer Information
                </Title>
                <Form.Item label='Customer Name' name='name'>
                  <Input style={{ width: '40%' }} disabled />
                </Form.Item>
                <Form.Item label='Customer Email' name='email'>
                  <Input type='email' style={{ width: '40%' }} disabled />
                </Form.Item>
                <Form.Item label='Gender' name='gender'>
                  <Radio.Group options={genderCat} disabled />
                </Form.Item>
                <Form.Item label='Birthdate' name='birthdate'>
                  {custForm.getFieldValue('birthdate') ? (
                    <DatePicker style={{ width: '40%' }} disabled />
                  ) : (
                    <Input
                      disabled
                      placeholder='Not Set'
                      style={{ width: '40%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item label='Registration Date' name='date_joined'>
                  {custForm.getFieldValue('date_joined') ? (
                    <DatePicker style={{ width: '40%' }} disabled />
                  ) : (
                    <Input
                      disabled
                      placeholder='Not Set'
                      style={{ width: '40%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item label='Last Login Date' name='last_login'>
                  {custForm.getFieldValue('last_login') ? (
                    <DatePicker style={{ width: '40%' }} disabled />
                  ) : (
                    <Input
                      disabled
                      placeholder='Not Set'
                      style={{ width: '40%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label='Active'
                  name='is_active'
                  valuePropName='checked'
                >
                  <Checkbox disabled>Active</Checkbox>
                </Form.Item>
              </Space>
            </MainCard>

            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='posInfo'>
                  Order-related Information
                </Title>
                <Form.Item
                  label='Monthly Order Value'
                  name='order_value_per_month'
                >
                  <InputNumber
                    prefix='RM'
                    precision={2}
                    style={{ width: '40%' }}
                    disabled
                  />
                </Form.Item>

                <Form.Item label='Last Order Date' name='last_order_dt'>
                  {custForm.getFieldValue('last_order_dt') ? (
                    <DatePicker style={{ width: '40%' }} disabled />
                  ) : (
                    <Input
                      disabled
                      placeholder='Not Set'
                      style={{ width: '40%' }}
                    />
                  )}
                </Form.Item>
              </Space>
            </MainCard>
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

export default CustView;
