import { Layout as AntdLayout } from 'antd';
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
      <Sider />
      <AntdLayout>
        <Header />
        <Content className='content'>
          {props.children}
        </Content>
        <Footer />
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
