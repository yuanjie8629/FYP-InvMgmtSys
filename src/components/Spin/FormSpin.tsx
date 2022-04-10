import { Modal, ModalProps, Space, Spin, Typography } from 'antd';
import './Spin.less';

interface FormSpinProps extends ModalProps {
  children?: React.ReactNode;
}

const FormSpin = ({ visible, ...props }: FormSpinProps) => {
  const { Text } = Typography;
  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      maskClosable={false}
      mask={null}
      width={130}
      centered
      bodyStyle={{
        height: 130,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      style={{ opacity: 0.8 }}
      wrapClassName='form-spin-modal'
      zIndex={100}
      {...props}
    >
      <Space direction='vertical' align='center'>
        <Spin spinning />
        <Text type='secondary'>Loading...</Text>
      </Space>
    </Modal>
  );
};

export default FormSpin;
