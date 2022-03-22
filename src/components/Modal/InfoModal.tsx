import { Modal, ModalProps, Result } from 'antd';
import { useState } from 'react';

interface InfoModalProps extends ModalProps {
  title: string;
  subTitle?: string;
  extra?: React.ReactNode;
}

const InfoModal = ({
  title,
  subTitle,
  extra,
  visible,
  onOk,
  onCancel,
  ...props
}: InfoModalProps) => {
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
        status='info'
        title={title}
        subTitle={subTitle}
        extra={extra}
      />
    </Modal>
  );
};

export default InfoModal;
