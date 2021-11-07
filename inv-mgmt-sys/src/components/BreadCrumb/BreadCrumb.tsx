import { Breadcrumb } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import breadcrumbNameMap from './BreadCrumpList';

const CustomBreadCrumb = withRouter((props) => {
  const { location } = props;
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    if (breadcrumbNameMap.hasOwnProperty(url) && url !== '/dashboard') {
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
        </Breadcrumb.Item>
      );
    } else return <Breadcrumb.Item key='none'></Breadcrumb.Item>;
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key='/dashboard'>
      <Link to='/'>Dashboard</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <Breadcrumb
      separator={
        <CaretRightOutlined style={{ position: 'relative', top: '-2px' }} />
      }
    >
      {breadcrumbItems}
    </Breadcrumb>
  );
});

export default CustomBreadCrumb;
