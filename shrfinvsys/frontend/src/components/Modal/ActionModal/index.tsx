import {
  DescriptionListDataProps,
  TitleTextProps,
} from '@/components/List/DescriptionList';
import { Modal as AntdModal, ModalProps } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import DeleteModal from './DeleteModal';
import HideModal from './HideModal';

export type ActionModalPayload = {
  onOk?: () => void;
  onCancel?: () => void;
  multiItem?: boolean;
};

export const ActionModalComponent = {
  delete: DeleteModal,
  hide: HideModal,
};

export type ActionModalType = 'delete' | 'hide';

export interface ActionModalContentProps {
  recordType?: string;
  loading?: boolean;
  dataSource?: DescriptionListDataProps[];
  titleProps?: TitleTextProps;
  descProps?: TitleTextProps;
  multi?: boolean;
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

const Modal: ActionModalReturnProps = memo(
  (
    {
      recordType = 'record',
      dataSource,
      titleProps,
      descProps,
      multi,
      ...props
    }: ActionModalProps,
    _ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [multiItem, setMultiItem] = useState(false);
    const [modalType, setModalType] = useState<ActionModalType>(null);
    const payloadRef = useRef<ActionModalPayload>({});

    useEffect(() => {
      Modal.show = (
        type: ActionModalType,
        { multiItem = false, ...ActionModalPayload }: ActionModalPayload
      ) => {
        setVisible(true);
        setModalType(type);
        multiItem ? setMultiItem(true) : setMultiItem(false);
        payloadRef.current = ActionModalPayload;
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
          multi={multiItem}
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
        {...props}
      >
        {renderModal()}
      </AntdModal>
    );
  }
);

export default Modal;
