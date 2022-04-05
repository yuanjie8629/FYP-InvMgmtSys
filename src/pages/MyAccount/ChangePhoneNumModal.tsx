import { Form, Typography, Space, Modal, Input, Alert } from 'antd';
import Button from '@components/Button';
import { useContext, useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { adminUpdateAPI } from '@api/services/adminAPI';
import { removeInvalidData } from '@utils/arrayUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { MaskedInput } from 'antd-mask-input';
import { AccSettingsModalProps } from './AccSettings';

const ChangePhoneNumModal = ({ onUpdate, ...props }: AccSettingsModalProps) => {
  const { Text, Title } = Typography;
  const [changePhoneNumForm] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [messageApi] = useContext(MessageContext);

  const handleChangePhoneNum = (values) => {
    values = removeInvalidData(values);
    setSubmitLoading(true);
    adminUpdateAPI(values)
      .then((res) => {
        setSubmitLoading(false);
        showSuccessChangeMsg();
        onUpdate();
        changePhoneNumForm.resetFields();
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
      content: 'Your phone number has been updated.',
    });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Modal centered footer={null} {...props}>
      <Space direction='vertical' size={20} className='full-width'>
        <Title level={4} className='center-flex'>
          Change Phone Number
        </Title>
        <Form
          name='changePhoneNum'
          form={changePhoneNumForm}
          layout='vertical'
          onFinish={handleChangePhoneNum}
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
              label='Phone Number'
              name='phone_num'
              rules={[
                {
                  required: true,
                  message: 'Please enter your new phone number.',
                },
              ]}
            >
              <MaskedInput
                prefix='(+6)'
                mask='111-111 1111'
                placeholderChar=' '
                placeholder='012-345 6789'
              />
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
              Change Phone Number
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default ChangePhoneNumModal;
