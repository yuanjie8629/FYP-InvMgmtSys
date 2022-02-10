import React, { memo, useState, useRef, useEffect } from 'react';
import { Avatar, Modal, ModalProps, Space, Typography } from 'antd';
import Button from '../../Button';
import { HiTrash } from 'react-icons/hi';

type Payload = {
  onOk?: () => void;
  onCancel?: () => void;
};

interface DeleteModalProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  label?: string;
  children?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

type ModalType = React.FC<DeleteModalProps> & {
  show?: (payload?: Payload) => void;
};

const DeleteModal: ModalType = memo(
  (
    {
      children,
      label = 'Do you really want to delete the selected record?',
      onOk = () => '',
      onCancel = () => '',
      loading,
      ...props
    }: DeleteModalProps,
    ref
  ) => {
    const { Text, Title } = Typography;
    const [visible, setVisible] = useState(false);
    const payloadRef = useRef<Payload>({});

    useEffect(() => {
      DeleteModal.show = (payload: Payload) => {
        setVisible(true);
        payloadRef.current = payload;
      };
    }, []);

    const handleOk = (method?: () => void) => () => {
      method && method();
      onOk();
    };

    const handleCancel = (method?: () => void) => () => {
      setVisible(false);
      method && method();
      onCancel();
    };

    return (
      <Modal
        visible={visible}
        onOk={handleOk(payloadRef.current?.onOk)}
        onCancel={handleCancel(payloadRef.current?.onCancel)}
        footer={null}
        {...props}
      >
        <Space
          direction='vertical'
          align='center'
          size={30}
          className='full-width'
        >
          <Space
            direction='vertical'
            align='center'
            size={15}
            className='full-width'
            style={{ textAlign: 'center' }}
          >
            <Avatar
              size={80}
              icon={<HiTrash className='color-error' />}
              className='centerFlex bg-red-200'
            />
            <Title level={3}>Delete</Title>
            <Text type='secondary' className='text-lg'>
              This process cannot be undone.
              <br />
              {label}
            </Text>
          </Space>
          {children}
          <Space size={20}>
            <Button
              type='primary'
              color='grey'
              onClick={handleCancel(payloadRef.current?.onCancel)}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              color='error'
              onClick={handleOk(payloadRef.current?.onOk)}
              loading={loading}
            >
              Delete
            </Button>
          </Space>
        </Space>
      </Modal>
    );
  }
);

export default DeleteModal;
