import { Layout } from 'antd';
import Header from '@components/Header/Header';
import Sider from '@components/Sider/Sider';
import Footer from '@components/Footer/Footer';

const CustomLayout = () => {
  const { Content } = Layout;
  return (
    <Layout>
      <Sider />
      <Layout>
        <Header />
        <Content>Content</Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
