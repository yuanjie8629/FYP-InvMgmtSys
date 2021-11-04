import { Layout } from 'antd';
import CopyrightCircleOutlined from '@ant-design/icons/CopyrightOutlined';
import './Layout.less';
const CustomFooter = () => {
  const { Footer } = Layout;
  return (
    <Footer className='footer'>
      <CopyrightCircleOutlined className='footer-icon' /> 2021 Sharifah Food.
      All rights reserved.
    </Footer>
  );
};

export default CustomFooter;
