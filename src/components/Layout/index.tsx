import React, { Suspense, useState } from 'react';
import { Layout as AntdLayout, Row, RowProps } from 'antd';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Sider from './Sider';
import Footer from './Footer';
import './Layout.less';
import PageLoad from '@components/Loading/PageLoad';

export interface CustomLayoutProps extends RowProps {
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  children?: React.ReactNode;
}

const Layout = ({ justify = 'center', ...props }: CustomLayoutProps) => {
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);
  const { Content } = AntdLayout;
  return (
    <AntdLayout hasSider>
      <Helmet>
        <meta name='viewport' content='width=1600' />
      </Helmet>
      <Sider
        onCollapse={(collapsed) => {
          setIsSiderCollapsed(collapsed);
        }}
      />
      <AntdLayout>
        <Header collapsed={isSiderCollapsed} />
        <Suspense fallback={<PageLoad />}>
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
