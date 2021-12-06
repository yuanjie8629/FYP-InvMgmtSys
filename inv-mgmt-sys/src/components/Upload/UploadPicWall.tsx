import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import {
  Upload as AntdUpload,
  UploadProps as AntdUploadProps,
  Modal,
} from 'antd';

const UploadPicWall = (props: AntdUploadProps) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const getBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const uploadButton = <MdAdd size={50} color='#D1D5DB' />;

  return (
    <>
      <AntdUpload
        action='https://run.mocky.io/v3/74b79e58-0491-4fe0-ae9c-738eab6c90ba'
        listType='picture-card'
        onPreview={handlePreview}
        multiple
        {...props}
      >
        {props.fileList !== undefined && props.fileList.length >= 8 ? null : uploadButton}
      </AntdUpload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadPicWall;
