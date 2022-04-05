import { Form, Typography, Space, Modal, Input, Alert } from 'antd';
import Button from '@components/Button';
import { useContext, useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { adminUpdateAPI } from '@api/services/adminAPI';
import { removeInvalidData } from '@utils/arrayUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { AccSettingsModalProps } from './AccSettings';

const ChangeEmailModal = ({ onUpdate, ...props }: AccSettingsModalProps) => {
  const { Text, Title } = Typography;
  const [changeEmailForm] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [messageApi] = useContext(MessageContext);

  const handleChangeEmail = (values) => {
    values = removeInvalidData(values);
    setSubmitLoading(true);
    adminUpdateAPI(values)
      .then((res) => {
        setSubmitLoading(false);
        showSuccessChangeMsg();
        onUpdate();
        changeEmailForm.resetFields();
        props.onCancel(null);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.data?.error === 'invalid_password') {
            setErrMsg('The password entered is invalid');
            setSubmitLoading(false);
            return;
          }
          setSubmitLoading(false);
          showServerErrMsg();
        }
      });
  };

  const showSuccessChangeMsg = () => {
    messageApi.open({
      type: 'success',
      content: 'Your email has been updated.',
    });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Modal centered footer={null} {...props}>
      <Space direction='vertical' size={20} className='full-width'>
        <Title level={4} className='center-flex'>
          Change Email
        </Title>
        <Form
          name='changeEmail'
          form={changeEmailForm}
          layout='vertical'
          onFinish={handleChangeEmail}
        >
          <Space direction='vertical' size={10} className='full-width'>
            {errMsg && (
              <Alert
                message={<Text type='danger'>{errMsg}</Text>}
                type='error'
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}
            <Form.Item
              label='Email Address'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please enter your new email address.',
                },
              ]}
            >
              <Input type='email' placeholder='Enter new email address' />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please enter your password.',
                },
              ]}
            >
              <Input.Password
                onChange={() => {
                  setErrMsg('');
                }}
              />
            </Form.Item>
            <Button
              htmlType='submit'
              type='primary'
              block
              loading={submitLoading}
            >
              Change Email
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default ChangeEmailModal;
