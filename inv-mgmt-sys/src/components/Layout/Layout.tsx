import { Layout as AntdLayout } from 'antd';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Sider from './Sider';
import Footer from './Footer';
import './Layout.less';
interface CustomLayoutProps {
  children?: React.ReactNode;
}

const Layout = (props: CustomLayoutProps) => {
  const { Content } = AntdLayout;
  return (
    <AntdLayout>
      <Helmet>
        <meta name='viewport' content='width=1600'></meta>
      </Helmet>
      <Sider />
      <AntdLayout>
        <Header />
        <Content className='content'>{props.children}</Content>
        <Footer />
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
