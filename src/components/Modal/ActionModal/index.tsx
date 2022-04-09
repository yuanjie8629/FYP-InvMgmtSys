import { DescriptionListDataProps } from '@components/List/DescriptionList';
import { Modal as AntdModal, ModalProps } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import ActivateModal from '../ActionModal/ActivateModal';
import DeleteModal from '../ActionModal/DeleteModal';
import HideModal from '../ActionModal/HideModal';
import AcceptModal from './AcceptModal';
import CancelModal from './CancelModal';
import InvBulkUpdateModal from './InvBulkUpdateModal';
import InvoiceModal from './InvoiceModal';
import OrderTrackNumUpdModal from './OrderTrackNumUpdModal';
import PickupModal from './PickupModal';
import RejectModal from './RejectModal';
import SuspendModal from './SuspendModal';

export type ActionModalPayload = {
  onOk?: (data?) => void;
  onCancel?: () => void;
};

export const ActionModalComponent = {
  delete: DeleteModal,
  hide: HideModal,
  activate: ActivateModal,
  invBulkUpd: InvBulkUpdateModal,
  orderBulkUpd: OrderTrackNumUpdModal,
  pickup: PickupModal,
  suspend: SuspendModal,
  accept: AcceptModal,
  reject: RejectModal,
  cancel: CancelModal,
  invoice: InvoiceModal,
};

export type ActionModalType =
  | 'activate'
  | 'delete'
  | 'hide'
  | 'invBulkUpd'
  | 'orderBulkUpd'
  | 'pickup'
  | 'suspend'
  | 'accept'
  | 'reject'
  | 'cancel'
  | 'invoice';

export interface ActionModalContentProps {
  recordType?: string;
  loading?: boolean;
  dataSource?: DescriptionListDataProps[];
  onOk?: (data?: any) => void;
  onCancel?: () => void;
  onUpdate?: (data: any) => void;
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
        : () => null;
      return (
        <ModalRender
          recordType={recordType}
          loading={loading}
          dataSource={dataSource}
          onOk={handleOk(payloadRef.current?.onOk)}
          onCancel={handleCancel(payloadRef.current?.onCancel)}
          onUpdate={(data) => {
            loadParentFunc(payloadRef.current?.onOk(data));
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
