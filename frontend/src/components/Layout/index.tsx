import React, { Suspense } from 'react';
import { Layout as AntdLayout, Row, RowProps, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Sider from './Sider';
import Footer from './Footer';
import './Layout.less';

export interface CustomLayoutProps extends RowProps {
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  children?: React.ReactNode;
}

const Layout = ({ justify = 'center', ...props }: CustomLayoutProps) => {
  const { Content } = AntdLayout;
  return (
    <AntdLayout hasSider>
      <Helmet>
        <meta name='viewport' content='width=1600' />
      </Helmet>
      <Sider />
      <AntdLayout>
        <Header />
        <Suspense
          fallback={
            <div className='center-flex height-fill-vp'>
              <Spin size='large' />
            </div>
          }
        >
          <Content className='content' style={{ minWidth: 1280 }}>
            <Row justify={justify} {...props}>
              {props.children}
            </Row>
          </Content>
          <Footer />
        </Suspense>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;