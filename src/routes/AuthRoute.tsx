import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { checkURL, findRoutePath } from '@utils/routingUtils';
import Cookies from 'js-cookie';
import routeList from './routeList';

const AuthRoute = (_props) => {
  const location = useLocation();
  const notProtectedRoute = routeList
    .filter((route) => route.protected === false)
    .map((filteredRoute) => filteredRoute.path);
  const access = Cookies.get('access_token');
  if (!(access || notProtectedRoute.includes(checkURL(location.pathname)))) {
    return (
      <Navigate
        to={findRoutePath('login')}
        state={{ from: location }}
        replace
      />
    );
  }

  if (access && notProtectedRoute.includes(location.pathname)) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
