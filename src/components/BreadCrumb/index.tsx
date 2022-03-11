import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import breadcrumbNameMap from './breadCrumpList';

const BreadCrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i: any) => i);

  const extraBreadcrumbItems = pathSnippets.map((_: any, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let splitURL = url.split('/');
    if (new RegExp(/^[0-9]*$/).test(splitURL[splitURL.length - 1])) {
      let newURL = url.replace(/\d/g, '') + ':id';
      return (
        <AntdBreadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[newURL]}</Link>
        </AntdBreadcrumb.Item>
      );
    }
    return breadcrumbNameMap.hasOwnProperty(url) && url !== '/dashboard' ? (
      <AntdBreadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
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
