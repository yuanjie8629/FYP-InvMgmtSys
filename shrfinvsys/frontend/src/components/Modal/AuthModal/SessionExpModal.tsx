import Button from '@/components/Button';
import { clearStorage } from '@/utils/storageUtils';
import { Col, Modal, ModalProps, Row, Space, Typography } from 'antd';
import { useState } from 'react';

interface SessionExpModalProps extends ModalProps {}

const SessionExpModal = ({ visible, ...props }: SessionExpModalProps) => {
  const { Text } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(visible);

  const handleClose = () => {
    clearStorage();
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

export default SessionExpModal;
