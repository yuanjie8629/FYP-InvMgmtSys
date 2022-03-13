import { Col, Row, Form, Typography, Space, Input, message } from 'antd';
import Button from '@components/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainCard from '@components/Card/MainCard';
import ColorCard from '@components/Card/ColorCard';
import { useEffect, useState } from 'react';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { IconBaseProps } from 'react-icons';
import { useForm } from 'antd/lib/form/Form';
import {
  checkLength,
  hasDigit,
  hasLowerCaseLetter,
  hasSymbolLetter,
  hasUpperCaseLetter,
} from '@utils/strUtils';
import { resetPassAPI, validateForgotPassTknAPI } from '@api/services/authAPI';
import SuccessModal from '@components/Modal/SuccessModal';
import PageLoad from '@components/Loading/PageLoad';

const ResetPass = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassForm] = useForm();
  const [hasNumberic, setHasNumeric] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [passInRange, setPassInRange] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [resetErrMsg, setResetErrMsg] = useState([]);

  useEffect(() => {
    if (!searchParams.has('token')) {
      navigate('/');
    } else {
      setPageLoading(true);
      validateForgotPassTknAPI(searchParams.get('token'))
        .catch(() => {
          navigate('/');
        })
        .finally(() => {
          setPageLoading(false);
        });
    }
  }, [navigate, searchParams]);

  const passValidation = [
    {
      code: 'password_length_validation',
      message: '8 to 16 characters',
      validation: passInRange,
    },
    {
      code: 'password_no_number',
      message: 'At least 1 digit',
      validation: hasNumberic,
    },
    {
      code: 'password_no_upper',
      message: 'At least 1 uppercase letter',
      validation: hasUpperCase,
    },
    {
      code: 'password_no_lower',
      message: 'At least 1 lowercase letter',
      validation: hasLowerCase,
    },
    {
      code: 'password_no_symbol',
      message: 'At least 1 symbol',
      validation: hasSymbol,
    },
  ];

  const Icon = ({ match, ...props }: IconBaseProps & { match: boolean }) =>
    match ? (
      <MdCheckCircle className='color-success' />
    ) : (
      <MdCancel className='color-error' />
    );

  interface PassCriteriaListProps {
    errMsg: string;
    validation: boolean;
  }

  const PassCriteriaList = ({ errMsg, validation }: PassCriteriaListProps) => {
    return (
      <Row align='middle' gutter={5}>
        <Col className='center-flex'>
          <Icon match={validation} />
        </Col>
        <Col>
          <Text>{errMsg}</Text>
        </Col>
      </Row>
    );
  };

  const handleResetPass = (values) => {
    setSubmitLoading(true);
    resetPassAPI({
      token: searchParams.get('token'),
      password: values.password,
    })
      .then(() => setSuccessModal(true))
      .catch((err) => {
        if (err.response?.status === 400)
          setResetErrMsg(err.response?.data.password);
        else {
          message.error('Error encountered. Please try again.');
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return !pageLoading ? (
    <Form
      name='resetPass'
      form={resetPassForm}
      layout='vertical'
      onFinish={handleResetPass}
    >
      <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
        <Col style={{ width: 450 }}>
          <MainCard>
            <Space direction='vertical' size={15} className='full-width'>
              <Title level={4} className='center-flex'>
                Reset Password
              </Title>
              <Space
                direction='vertical'
                size={0}
                align='center'
                className='full-width'
              >
                <Text>Create a new password for</Text>
                <Text className='color-primary'>
                  {searchParams.get('email')}
                </Text>
              </Space>
              <ColorCard backgroundColor='grey' bodyStyle={{ padding: 15 }}>
                <Space direction='vertical' size={0}>
                  <Text>
                    Your password must fulfill the following criteria:
                  </Text>
                  {passValidation.map((err, index) => (
                    <PassCriteriaList
                      key={`passCriteriaList-${index}`}
                      errMsg={err.message}
                      validation={err.validation}
                    />
                  ))}
                </Space>
              </ColorCard>
              <Space direction='vertical' size={10} className='full-width'>
                <Form.Item
                  name='password'
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        if (value.trim() === '')
                          return Promise.reject(
                            new Error('Please enter new password.')
                          );

                        if (
                          !(
                            hasNumberic &&
                            hasUpperCase &&
                            hasLowerCase &&
                            hasSymbol
                          )
                        ) {
                          return Promise.reject(
                            new Error(
                              'The password must follow the criteria above.'
                            )
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                  validateStatus={resetErrMsg.length > 0 && 'error'}
                  help={resetErrMsg.map((errMsg) => (
                    <ul className='text-sm'>
                      <li style={{ textAlign: 'justify' }}>{errMsg}</li>
                    </ul>
                  ))}
                >
                  <Input.Password
                    placeholder='Password'
                    maxLength={16}
                    onChange={(e) => {
                      const pass = e.target.value.trim();
                      resetPassForm.setFieldsValue({
                        password: pass,
                      });
                      if (hasDigit(pass)) setHasNumeric(true);
                      else setHasNumeric(false);
                      if (hasUpperCaseLetter(pass)) setHasUpperCase(true);
                      else setHasUpperCase(false);
                      if (hasLowerCaseLetter(pass)) setHasLowerCase(true);
                      else setHasLowerCase(false);
                      if (hasSymbolLetter(pass)) setHasSymbol(true);
                      else setHasSymbol(false);
                      if (checkLength(pass, 8, 16)) setPassInRange(true);
                      else setPassInRange(false);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name='confirmPass'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter again the password entered.',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Password must be the same.')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder='Confirm Password'
                    maxLength={16}
                  />
                </Form.Item>
                <Button
                  htmlType='submit'
                  type='primary'
                  block
                  loading={submitLoading}
                >
                  Reset Password
                </Button>
              </Space>
            </Space>
          </MainCard>
        </Col>
      </Row>
      <SuccessModal
        visible={successModal}
        title='Reset Password Successful'
        subTitle='You can now use the new password to login your account.'
        extra={[
          <Button type='primary' onClick={() => navigate('')}>
            Go to Login
          </Button>,
        ]}
      />
    </Form>
  ) : (
    <PageLoad />
  );
};

export default ResetPass;
