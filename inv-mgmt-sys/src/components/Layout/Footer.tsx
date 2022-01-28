import { Layout } from 'antd';
import CopyrightCircleOutlined from '@ant-design/icons/CopyrightOutlined';

const Footer = () => {
  const { Footer } = Layout;
  return (
    <Footer className='footer'>
      <CopyrightCircleOutlined className='footer-icon' /> 2022 Sharifah Food.
      All rights reserved.
    </Footer>
  );
};

export default Footer;
