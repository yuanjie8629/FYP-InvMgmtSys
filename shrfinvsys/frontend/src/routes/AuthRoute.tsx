import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { findRoutePath } from '@/utils/routingUtils';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { refreshTknAPI } from '@/api/services/authAPI';

const AuthRoute = ({ children }: { children?: JSX.Element }) => {
  const location = useLocation();

  useEffect(() => {
    refreshTknAPI();
  }, [location.pathname]);

  const access = Cookies.get('access_token');
  if (!(access || location.pathname === findRoutePath('login'))) {
    return (
      <Navigate
        to={findRoutePath('login')}
        state={{ from: location }}
        replace
      />
    );
  }

  if (access && location.pathname === findRoutePath('login')) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
