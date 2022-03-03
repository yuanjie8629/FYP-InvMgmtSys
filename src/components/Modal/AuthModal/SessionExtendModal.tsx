import React, { useEffect, useState } from 'react';
import { Col, Modal, ModalProps, Row, Space, Typography } from 'antd';
import moment from 'moment';
import { logoutAPI, refreshTknAPI } from '@api/services/authAPI';
import Button from '@components/Button';
import { useTimer } from 'react-timer-hook';
import { useLocation, useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { getSessionExp } from '@utils/storageUtils';
import { useIdleTimer } from 'react-idle-timer';
import { MdAccessTimeFilled } from 'react-icons/md';

interface SessionExtendModalProps extends ModalProps {}

const SessionExtendModal = ({ visible, ...props }: SessionExtendModalProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { Text, Title } = Typography;
  const [showModal, setShowModal] = useState(visible);
  const [loading, setLoading] = useState(false);

  const idleTimer = useIdleTimer({
    timeout: 1000,
  });

  const timer = useTimer({
    expiryTimestamp:
      getSessionExp() &&
      moment.unix(getSessionExp()).subtract(15, 'second').toDate(),
    onExpire: () => {
      if (!(idleTimer.isIdle() || showModal))
        refreshTknAPI().then(() => {
          setShowModal(false);
          timer.restart(
            moment.unix(getSessionExp()).subtract(15, 'second').toDate()
          );
        });
      else {
        navigate(findRoutePath('login'));
        logoutAPI();
      }
    },
  });

  useEffect(() => {
    if (
      timer.days <= 0 &&
      timer.hours <= 0 &&
      timer.minutes < 1 &&
      location.pathname !== findRoutePath('login') &&
      idleTimer.isIdle()
    )
      setShowModal(true);
  }, [idleTimer, location.pathname, timer.days, timer.hours, timer.minutes]);

  const extendPageSession = () => {
    setLoading(true);
    refreshTknAPI().then(() => {
      timer.restart(
        moment.unix(getSessionExp()).subtract(15, 'second').toDate()
      );
      setShowModal(false);
      setLoading(false);
    });
  };

  const handleClose = () => {
    navigate(findRoutePath('login'));
    logoutAPI();
    setShowModal(false);
  };

  return (
    <Modal
      visible={showModal || visible}
      footer={null}
      centered
      onOk={extendPageSession}
      maskClosable={false}
      closable={false}
      {...props}
    >
      <Space direction='vertical' size={20} className='full-width'>
        <Space size={10}>
          <MdAccessTimeFilled size={25} className='color-error' />
          <Text strong>Your session will be expired in</Text>
        </Space>
        <Space align='center' className='center-flex'>
          <Row align='bottom' gutter={5}>
            <Col>
              <Title level={4}>{timer.minutes}</Title>
            </Col>
            <Col>
              <Title level={5}>Minutes</Title>
            </Col>
          </Row>
          <Row align='bottom' gutter={5}>
            <Col>
              <Title level={4}>{timer.seconds}</Title>
            </Col>
            <Col>
              <Title level={5}>Seconds</Title>
            </Col>
          </Row>
        </Space>
        <Text>Do you want to extend your session?</Text>
        <Row gutter={20} justify='end'>
          <Col>
            <Button color='error' onClick={handleClose}>
              Log Out
            </Button>
          </Col>
          <Col>
            <Button
              type='primary'
              onClick={extendPageSession}
              loading={loading}
            >
              Stay Logged In
            </Button>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
};

export default SessionExtendModal;
