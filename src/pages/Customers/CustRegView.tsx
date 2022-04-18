import React, { useContext, useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
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
import { sortByOrder } from '@utils/arrayUtils';
import {
  custPositionCat,
  custStatusCat,
  genderCat,
  maritalStatCat,
} from '@utils/optionUtils';
import { MessageContext } from '@contexts/MessageContext';
import { actionSuccessMsg, serverErrMsg } from '@utils/messageUtils';
import { custRegDetailsAPI, custRegUpdAPI } from '@api/services/custAPI';
import { useParams } from 'react-router-dom';
import { getCities, getPostcodes, getStates } from '@utils/addressUtils';
import FormSpin from '@components/Spin/FormSpin';
import moment from 'moment';
import AffixCustReg from '@components/Affix/AffixCustReg';
import InfoModal from '@components/Modal/InfoModal';
import Button from '@components/Button';

const CustRegView = () => {
  const { Title } = Typography;
  const { Option } = Select;
  const { TextArea } = Input;
  const { Link } = Anchor;
  const { id } = useParams();
  const [custForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [postcode] = useState([]);
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [accept, setAccept] = useState<boolean>();

  const getCustRegDetails = (isMounted = true) => {
    setLoading(true);
    custRegDetailsAPI(id)
      .then((res) => {
        if (isMounted) {
          let { postcode, created_at, birthdate, ...data } = res.data;
          setState(postcode.state);
          setCity(postcode.city);
          data.state = postcode.state;
          data.city = postcode.city;
          data.postcode = postcode.postcode;
          data.birthdate = moment(birthdate, 'DD-MM-YYYY');
          data.created_at = moment(created_at, 'DD-MM-YYYY');
          if (data.accept === true) {
            data.accept = 'true';
          } else if (data.accept === false) {
            data.accept = 'false';
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

  const showActionSuccessMsg = (action: 'accept' | 'reject') => {
    messageApi.open(actionSuccessMsg('Customer', action, 1));
  };

  const handleCustReg = () => {
    setSubmitLoading(true);
    custRegUpdAPI([{ id: id, accept: accept }])
      .then(() => {
        setSubmitLoading(false);
        showActionSuccessMsg(accept ? 'accept' : 'reject');
        getCustRegDetails();
      })
      .catch((err) => {
        if (err.response?.status !== 401) setSubmitLoading(false);
        else {
          showServerErrMsg();
        }
      });
  };

  const ConfirmSubmissionButton = [
    <Button
      color='error'
      onClick={() => {
        setShowConfirm(false);
      }}
      style={{ width: '20%' }}
    >
      No
    </Button>,
    <Button
      type='primary'
      htmlType='submit'
      color='info'
      onClick={() => {
        setShowConfirm(false);
        handleCustReg();
      }}
      style={{ width: '20%' }}
    >
      Yes
    </Button>,
  ];

  return (
    <Form name='custForm' layout='vertical' size='small' form={custForm}>
      <Layout>
        <FormSpin visible={loading || submitLoading} />
        <Col xs={16} xl={19} className='center-flex'>
          <MainCardContainer>
            <MainCard>
              <Space direction='vertical' size={20} className='full-width'>
                <Title level={4} id='basicInfo'>
                  Basic Information
                </Title>
                <Form.Item
                  label='Customer Name'
                  name='name'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the customer name.',
                    },
                  ]}
                >
                  <Input style={{ width: '40%' }} disabled />
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
                  <Radio.Group options={genderCat} disabled />
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
                  <DatePicker style={{ width: '40%' }} disabled />
                </Form.Item>

                <Form.Item
                  label='Marital Status'
                  name='marital_status'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your marital status.',
                    },
                  ]}
                >
                  <Radio.Group options={maritalStatCat} disabled />
                </Form.Item>
                <Form.Item label='Registration Date' name='created_at'>
                  <DatePicker style={{ width: '40%' }} disabled />
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
                    name='phone_num'
                    rules={[
                      {
                        required: true,
                        message: "Please enter the customer's phone number.",
                      },
                    ]}
                  >
                    <Input disabled style={{ width: '20%' }} />
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
                    <Input type='email' disabled style={{ width: '40%' }} />
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
                  style={{ width: '30%' }}
                >
                  <Select
                    showSearch
                    filterOption
                    disabled
                    onChange={(value: string) => {
                      setState(value);
                      custForm.resetFields(['city', 'postcode']);
                      setCity('');
                    }}
                  >
                    {sortByOrder(getStates(postcode)).map((state: string) => (
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
                  style={{ width: '30%' }}
                >
                  <Select
                    showSearch
                    filterOption
                    disabled
                    onChange={(value: string) => {
                      setCity(value);
                      custForm.resetFields(['postcode']);
                    }}
                  >
                    {sortByOrder(getCities(postcode, state)).map(
                      (city: string) => (
                        <Option key={city}>{city}</Option>
                      )
                    )}
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
                  style={{ width: '30%' }}
                >
                  <Select showSearch filterOption disabled>
                    {sortByOrder(getPostcodes(postcode, city)).map(
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
                    disabled
                    rows={4}
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
                  <Input disabled style={{ width: '40%' }} />
                </Form.Item>
                <Form.Item label='Company Name' name='comp_name'>
                  <Input disabled style={{ width: '40%' }} />
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
                  <Radio.Group options={custPositionCat} disabled />
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
                  initialValue='active'
                >
                  <Radio.Group options={custStatusCat} disabled />
                </Form.Item>
              </Space>
            </MainCard>
            <AffixCustReg
              offsetBottom={0}
              loading={submitLoading}
              disabled={loading}
              accept={custForm.getFieldValue('accept')}
              onClick={(accept) => {
                setAccept(accept);
                setShowConfirm(true);
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
        <InfoModal
          visible={showConfirm}
          onCancel={() => {
            setShowConfirm(false);
          }}
          title='Are you sure to submit?'
          subTitle='The customer will receive an email on the decision.'
          extra={ConfirmSubmissionButton}
        />
      </Layout>
    </Form>
  );
};

export default CustRegView;
