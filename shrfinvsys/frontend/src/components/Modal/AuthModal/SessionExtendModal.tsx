import React, { useEffect, useState } from 'react';
import { Col, Modal, ModalProps, Row, Space, Typography } from 'antd';
import moment from 'moment';
import { logoutAPI, refreshTknAPI } from '@/api/services/authAPI';
import Button from '@/components/Button';
import { useTimer } from 'react-timer-hook';
import { useLocation } from 'react-router-dom';
import { findRoutePath } from '@/utils/routingUtils';
import { getSessionExp } from '@/utils/storageUtils';
import { useIdleTimer } from 'react-idle-timer';

interface SessionExtendModalProps extends ModalProps {}

const SessionExtendModal = ({ visible, ...props }: SessionExtendModalProps) => {
  const location = useLocation();
  const { Text } = Typography;
  const [showModal, setShowModal] = useState(visible);
  const [loading, setLoading] = useState(false);

  const timer = useTimer({
    expiryTimestamp: moment
      .unix(getSessionExp())
      .subtract(15, 'second')
      .toDate(),
    onExpire: () => {
      logoutAPI();
      window.location.href = '';
    },
    autoStart: true,
  });

  const idleTimer = useIdleTimer({
    timeout: 1000,
  });

  useEffect(() => {
    if (
      timer.minutes <= 1 &&
      location.pathname !== findRoutePath('login') &&
      (idleTimer.isIdle() ||
        moment
          .unix(getSessionExp())
          .subtract(15, 'second')
          .diff(moment(), 'millisecond') <= idleTimer.getRemainingTime())
    )
      setShowModal(true);
  }, [idleTimer, location.pathname, timer.minutes]);

  const extendPageSession = () => {
    setLoading(true);
    refreshTknAPI().then(() => {
      setShowModal(false);
      timer.restart(
        moment.unix(getSessionExp()).subtract(15, 'second').toDate()
      );
      setLoading(false);
    });
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Modal
      visible={showModal}
      footer={null}
      centered
      onOk={extendPageSession}
      maskClosable={false}
      closable={false}
      {...props}
    >
      <Space direction='vertical' size={20} className='full-width'>
        <Text>
          Your session will be expired in {timer.seconds} seconds.
          <br />
          Do you want to extend your session?
        </Text>
        <Row gutter={20} justify='end'>
          <Col>
            <Button onClick={handleClose}>No</Button>
          </Col>
          <Col>
            <Button
              type='primary'
              onClick={extendPageSession}
              loading={loading}
            >
              Yes
            </Button>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
};

export default SessionExtendModal;
