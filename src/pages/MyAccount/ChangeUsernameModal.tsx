import { Form, Typography, Space, Modal, Input, Alert } from 'antd';
import Button from '@components/Button';
import { useContext, useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { adminUpdateAPI } from '@api/services/adminAPI';
import { removeInvalidData } from '@utils/arrayUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { AccSettingsModalProps } from './AccSettings';

const ChangeUsernameModal = ({ onUpdate, ...props }: AccSettingsModalProps) => {
  const { Text, Title } = Typography;
  const [changeUsernameForm] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [messageApi] = useContext(MessageContext);

  const handleChangeUsername = (values) => {
    values = removeInvalidData(values);
    setSubmitLoading(true);
    adminUpdateAPI(values)
      .then((res) => {
        setSubmitLoading(false);
        showSuccessChangeMsg();
        onUpdate();
        changeUsernameForm.resetFields();
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
      content: 'Your username has been updated.',
    });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Modal centered footer={null} {...props}>
      <Space direction='vertical' size={20} className='full-width'>
        <Title level={4} className='center-flex'>
          Change Username
        </Title>
        <Form
          name='changeUsername'
          form={changeUsernameForm}
          layout='vertical'
          onFinish={handleChangeUsername}
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
              label='Username'
              name='username'
              rules={[
                {
                  required: true,
                  message: 'Please enter your new username.',
                },
              ]}
            >
              <Input placeholder='Enter new username' />
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
              Change Username
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default ChangeUsernameModal;
