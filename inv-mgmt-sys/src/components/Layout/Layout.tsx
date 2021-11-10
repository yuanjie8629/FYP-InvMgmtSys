import { Layout } from 'antd';
import Header from './Header';
import Sider from './Sider';
import Footer from './Footer';
import './Layout.less';
interface CustomLayoutProps {
  children?: React.ReactNode;
}

const CustomLayout = (props: CustomLayoutProps) => {
  const { Content } = Layout;
  return (
    <Layout hasSider>
      <Sider />
      <Layout>
        <Header />
        <Content className='content'>
          {props.children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
