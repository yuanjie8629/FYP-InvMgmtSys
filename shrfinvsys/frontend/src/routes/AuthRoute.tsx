import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { findRoutePath } from '@/utils/routingUtils';

const AuthRoute = ({ children }: { children?: JSX.Element }) => {
  const location = useLocation();
  const access = localStorage.getItem('access_token');
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
