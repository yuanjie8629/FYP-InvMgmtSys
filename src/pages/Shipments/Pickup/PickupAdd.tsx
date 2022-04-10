import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import AffixAction from '@components/Affix/AffixAction';
import MainCardContainer from '@components/Container/MainCardContainer';
import { Anchor, Col, Form, Input, Space, Typography } from 'antd';
import { removeInvalidData } from '@utils/arrayUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import FormSpin from '@components/Spin/FormSpin';
import '@components/Input/InputNumberRange/InputNumberRange.less';
import { pickupLocAddAPI } from '@api/services/shipmentAPI';

const PickupAdd = () => {
  const { Title } = Typography;

  const { Link } = Anchor;
  const [pickupForm] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [messageApi] = useContext(MessageContext);
  const navigate = useNavigate();
  const anchorList = [
    { link: 'pickupLocInfo', title: 'Pickup Location Information' },
  ];

  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.5);
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const handleSubmit = (values) => {
    values = removeInvalidData(values);
    setSubmitLoading(true);
    pickupLocAddAPI(values)
      .then((res) => {
        setSubmitLoading(false);
        navigate(findRoutePath('pickupAddSuccess'));
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
      name='pickupForm'
      layout='vertical'
      size='small'
      form={pickupForm}
      onFinish={handleSubmit}
      scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
    >
      <Layout>
        <Col xs={16} xl={19} className='center-flex'>
          <MainCardContainer>
            <FormSpin visible={submitLoading} />
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='pickupLocInfo'>
                  Pickup Location Information
                </Title>
                <Form.Item
                  label='Location'
                  name='location'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the pickup location.',
                    },
                  ]}
                  style={{ width: '40%' }}
                >
                  <Input placeholder='Input' />
                </Form.Item>
              </Space>
            </MainCard>

            <AffixAction
              offsetBottom={0}
              label='Pickup Location'
              loading={submitLoading}
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

export default PickupAdd;
