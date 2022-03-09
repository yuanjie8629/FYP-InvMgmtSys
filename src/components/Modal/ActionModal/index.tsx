import {
  DescriptionListDataProps,
  TitleTextProps,
} from '@components/List/DescriptionList';
import { Modal as AntdModal, ModalProps } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import ActivateModal from './ActivateModal';
import DeleteModal from './DeleteModal';
import HideModal from './HideModal';

export type ActionModalPayload = {
  onOk?: () => void;
  onCancel?: () => void;
};

export const ActionModalComponent = {
  delete: DeleteModal,
  hide: HideModal,
  activate: ActivateModal,
};

export type ActionModalType = 'activate' | 'delete' | 'hide';

export interface ActionModalContentProps {
  recordType?: string;
  loading?: boolean;
  dataSource?: DescriptionListDataProps[];
  titleProps?: TitleTextProps;
  descProps?: TitleTextProps;
  onOk?: () => void;
  onCancel?: () => void;
}

export type ActionModalProps = Omit<ModalProps, 'onOk' | 'onCancel'> &
  ActionModalContentProps;

type ActionModalReturnProps = React.FC<Partial<ActionModalProps>> & {
  show?: (
    type: ActionModalType,
    ActionModalPayload?: ActionModalPayload
  ) => void;
};

const ActionModal: ActionModalReturnProps = memo(
  (
    {
      recordType = 'record',
      dataSource,
      titleProps,
      descProps,
      ...props
    }: ActionModalProps,
    _ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState<ActionModalType>(null);
    const payloadRef = useRef<ActionModalPayload>({});

    useEffect(() => {
      ActionModal.show = (
        type: ActionModalType,
        { ...payload }: ActionModalPayload
      ) => {
        setVisible(true);
        setModalType(type);
        payloadRef.current = payload;
      };
    }, []);

    const handleOk = (method?: () => void) => () => {
      let loadParentFunc = async () => {
        setLoading(true);
        return method && method();
      };
      loadParentFunc().then(() => setVisible(false));
    };

    const handleCancel = (method?: () => void) => () => {
      method && method();
      setVisible(false);
    };

    const renderModal = () => {
      const ModalRender = ActionModalComponent[modalType]
        ? ActionModalComponent[modalType]
        : null;
      return (
        <ModalRender
          recordType={recordType}
          loading={loading}
          dataSource={dataSource}
          titleProps={titleProps}
          descProps={descProps}
          onOk={handleOk(payloadRef.current?.onOk)}
          onCancel={handleCancel(payloadRef.current?.onCancel)}
        />
      );
    };

    return (
      <AntdModal
        visible={visible}
        onOk={handleOk(payloadRef.current?.onOk)}
        onCancel={handleCancel(payloadRef.current?.onCancel)}
        afterClose={() => setLoading(false)}
        footer={null}
        bodyStyle={{ padding: 30 }}
        destroyOnClose
        closable={!loading}
        maskClosable={!loading}
        centered
        {...props}
      >
        {renderModal()}
      </AntdModal>
    );
  }
);

export default ActionModal;
