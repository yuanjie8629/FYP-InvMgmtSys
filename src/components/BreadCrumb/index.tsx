import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import breadcrumbNameMap from './breadCrumpList';
import { checkURL } from '@utils/routingUtils';

const BreadCrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i: any) => i);

  const extraBreadcrumbItems = pathSnippets.map((_: any, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

    return breadcrumbNameMap.hasOwnProperty(checkURL(url)) &&
      url !== '/dashboard' ? (
      <AntdBreadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[checkURL(url)]}</Link>
      </AntdBreadcrumb.Item>
    ) : (
      <AntdBreadcrumb.Item key='none'></AntdBreadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <AntdBreadcrumb.Item key='/dashboard'>
      <Link to='/dashboard'>Dashboard</Link>
    </AntdBreadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <AntdBreadcrumb
      separator={
        <CaretRightOutlined style={{ position: 'relative', top: '-2px' }} />
      }
    >
      {breadcrumbItems}
    </AntdBreadcrumb>
  );
};

export default BreadCrumb;
