import Button from '@/components/Button';
import { Col, Modal, ModalProps, Row, Space, Typography } from 'antd';
import { useState } from 'react';

interface SessionModalProps extends ModalProps {}

const SessionModal = ({ visible, ...props }: SessionModalProps) => {
  const { Text } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(visible);

  const handleClose = () => {
    localStorage.clear();
    setIsModalVisible(false);
  };

  return (
    <Modal
      visible={isModalVisible}
      footer={null}
      centered
      onOk={handleClose}
      onCancel={handleClose}
      {...props}
    >
      <Space direction='vertical' size={20} className='full-width'>
        <Text>Your session is expired. Please login again.</Text>
        <Row gutter={20} justify='end'>
          <Col>
            <Button type='primary' onClick={handleClose}>
              OK
            </Button>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
};

export default SessionModal;
