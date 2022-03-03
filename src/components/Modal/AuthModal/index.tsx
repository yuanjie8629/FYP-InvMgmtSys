import { Modal as AntdModal, ModalProps } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import CheckEmailModal from './CheckEmailModal';
import ForgotPassModal from './ForgotPassModal';

export type AuthModalPayload = {
  onOk?: () => void;
  onCancel?: () => void;
  args?: any;
};

export const AuthModalComponent = {
  forgotPass: ForgotPassModal,
  checkEmail: CheckEmailModal,
};

export type AuthModalType = 'forgotPass' | 'checkEmail';

export interface AuthModalContentProps extends ModalProps {
  onOk?: () => void;
  onCancel?: () => void;
  args?: any;
}

export type AuthModalProps = Omit<ModalProps, 'onOk' | 'onCancel'> &
  AuthModalContentProps;

type AuthModalReturnProps = React.FC<Partial<AuthModalProps>> & {
  show?: (type: AuthModalType, AuthModalPayload?: AuthModalPayload) => void;
};

const AuthModal: AuthModalReturnProps = memo((props: AuthModalProps, _ref) => {
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<AuthModalType>(null);
  const [args, setArgs] = useState({});
  const payloadRef = useRef<AuthModalPayload>({});

  useEffect(() => {
    AuthModal.show = (type: AuthModalType, payload: AuthModalPayload) => {
      setVisible(true);
      setModalType(type);
      payloadRef.current = payload;
      setArgs(payload?.args);
    };
  }, []);

  const handleOk = (method?: () => void) => () => {
    method && method();
    setVisible(false);
  };

  const handleCancel = (method?: () => void) => () => {
    method && method();
    setVisible(false);
  };

  const renderModal = () => {
    const ModalRender = AuthModalComponent[modalType]
      ? AuthModalComponent[modalType]
      : null;
    return (
      <ModalRender
        onOk={handleOk(payloadRef.current?.onOk)}
        onCancel={handleCancel(payloadRef.current?.onCancel)}
        args={args}
      />
    );
  };

  return (
    <AntdModal
      visible={visible}
      onOk={handleOk(payloadRef.current?.onOk)}
      onCancel={handleCancel(payloadRef.current?.onCancel)}
      footer={null}
      bodyStyle={{ padding: 30 }}
      destroyOnClose
      centered
      {...props}
    >
      {renderModal()}
    </AntdModal>
  );
});

export default AuthModal;
