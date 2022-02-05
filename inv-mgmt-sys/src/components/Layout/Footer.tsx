import { Layout } from 'antd';
import CopyrightCircleOutlined from '@ant-design/icons/CopyrightOutlined';
import { getYr } from '@utils/dateUtils';

const Footer = () => {
  const { Footer } = Layout;
  return (
    <Footer className='footer'>
      <CopyrightCircleOutlined className='footer-icon' /> {getYr()} Sharifah
      Food. All rights reserved.
    </Footer>
  );
};

export default Footer;
