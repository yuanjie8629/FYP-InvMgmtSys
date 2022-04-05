import { Modal, ModalProps, Result } from 'antd';
import { useState } from 'react';

interface SuccessModalProps extends ModalProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
}

const SuccessModal = ({
  title,
  subTitle,
  extra,
  visible,
  onOk,
  onCancel,
  ...props
}: SuccessModalProps) => {
  const [showModal, setShowModal] = useState(visible);

  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <Modal
      visible={showModal || visible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
    >
      <Result
        status='success'
        title={title}
        subTitle={subTitle}
        extra={extra}
      />
    </Modal>
  );
};

export default SuccessModal;
