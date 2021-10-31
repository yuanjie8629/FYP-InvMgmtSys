import { Layout } from 'antd';
import Header from './Header';
import Sider from './Sider';
import Footer from './Footer';

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
        <Content>{props.children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
