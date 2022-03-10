import { DescriptionListDataProps } from '@components/List/DescriptionList';
import { Modal as AntdModal, ModalProps } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import ActivateModal from '../ActionModal/ActivateModal';
import DeleteModal from '../ActionModal/DeleteModal';
import HideModal from '../ActionModal/HideModal';
import BulkUpdateModal from './BulkUpdateModal';

export type ActionModalPayload = {
  onOk?: () => void;
  onCancel?: () => void;
  onUpdate?: (data) => void;
};

export const ActionModalComponent = {
  delete: DeleteModal,
  hide: HideModal,
  activate: ActivateModal,
  bulkUpd: BulkUpdateModal,
};

export type ActionModalType = 'activate' | 'delete' | 'hide' | 'bulkUpd';

export interface ActionModalContentProps {
  recordType?: string;
  loading?: boolean;
  dataSource?: DescriptionListDataProps[];
  onOk?: () => void;
  onCancel?: () => void;
  onUpdate?: (data) => void;
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
    { recordType = 'record', dataSource, onUpdate, ...props }: ActionModalProps,
    _ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState<ActionModalType>(null);
    const payloadRef = useRef<ActionModalPayload>({});

    useEffect(() => {
      ActionModal.show = (
        type: ActionModalType,
        payload: ActionModalPayload
      ) => {
        setVisible(true);
        setModalType(type);
        payloadRef.current = payload;
      };
    }, []);

    const loadParentFunc = (method?) => {
      console.log(method);
      let load = async () => {
        setLoading(true);
        return method;
      };
      load().then(() => setVisible(false));
    };

    const handleOk = (method?: () => void) => () => {
      loadParentFunc(method());
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
          onOk={handleOk(payloadRef.current?.onOk)}
          onCancel={handleCancel(payloadRef.current?.onCancel)}
          onUpdate={(data) => {
            loadParentFunc(onUpdate(data));
          }}
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
