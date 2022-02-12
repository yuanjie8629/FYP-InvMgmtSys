import {
  DescriptionListDataProps,
  TitleTextProps,
} from '@/components/List/DescriptionList';
import { Modal as AntdModal, ModalProps } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import DeleteModal from './DeleteModal';
import HideModal from './HideModal';

export type Payload = {
  onOk?: () => void;
  onCancel?: () => void;
};

export const ActionModalType = {
  delete: DeleteModal,
  hide: HideModal,
};

export interface ActionModalContentProps {
  type?: string;
  dataSource?: DescriptionListDataProps[];
  titleProps?: TitleTextProps;
  descProps?: TitleTextProps;
  multi?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

export type ActionModalProps = Omit<ModalProps, 'onOk' | 'onCancel'> &
  ActionModalContentProps;

type ActionModalReturnType = React.FC<Partial<ActionModalProps>> & {
  show?: (type: string, payload?: Payload, multiItem?: boolean) => void;
};

const Modal: ActionModalReturnType = memo(
  (
    {
      type,
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
    const [modalType, setModalType] = useState('');
    const payloadRef = useRef<Payload>({});

    useEffect(() => {
      Modal.show = (
        type: string,
        payload: Payload,
        multiItem: boolean = false
      ) => {
        setVisible(true);
        setModalType(type);
        multiItem ? setMultiItem(true) : setMultiItem(false);
        payloadRef.current = payload;
      };
    }, []);

    const handleOk = (method?: () => void) => () => {
      let asyncFunc = async () => {
        setLoading(true);
        return method && method();
      };
      asyncFunc().then(() => setVisible(false));
    };

    const handleCancel = (method?: () => void) => () => {
      method && method();
      setVisible(false);
    };

    const renderModal = () => {
      const ModalRender = ActionModalType[modalType]
        ? ActionModalType[modalType]
        : null;
      return (
        <ModalRender
          type={type}
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
