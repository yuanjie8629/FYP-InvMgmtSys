import React, { Suspense } from 'react';
import { Layout as AntdLayout, Spin } from 'antd';
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
        <meta name='viewport' content='width=1600' />
      </Helmet>
      <Sider />
      <AntdLayout>
        <Header />
        <Suspense
          fallback={
            <div className='centerFlex height-fill-vp'>
              <Spin size='large' />
            </div>
          }
        >
          <Content
            className='content'
            style={{ minWidth: 1060 }} //1280px - sider width
          >
            {props.children}
          </Content>
          <Footer />
        </Suspense>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
