import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import {
  Upload as AntdUpload,
  UploadProps as AntdUploadProps,
  Modal,
} from 'antd';
import './UploadPicWall.less';
import ImgCrop from 'antd-img-crop';

interface UploadPicWallProps extends AntdUploadProps {}

const UploadPicWall = (props: UploadPicWallProps) => {
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

  const uploadButton = <MdAdd size={50} className='color-grey-300' />;

  return (
    <span className='upload-pic-wall'>
      <ImgCrop
        quality={0.8}
        aspect={1 / 1}
      >
        <AntdUpload
          accept='image/*'
          listType='picture-card'
          onPreview={handlePreview}
          multiple
          customRequest={(req) => {
            req.onSuccess('uploaded');
          }}
          {...props}
        >
          {props.fileList !== undefined && props.fileList.length >= 8
            ? null
            : uploadButton}
        </AntdUpload>
      </ImgCrop>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt='uploadPreviewImg' className='full-width' src={previewImage} />
      </Modal>
    </span>
  );
};

export default UploadPicWall;
