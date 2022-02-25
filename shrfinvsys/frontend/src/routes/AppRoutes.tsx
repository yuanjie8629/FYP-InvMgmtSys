import { refreshTknAPI } from '@/api/services/authAPI';
import SessionModal from '@/components/Modal/AuthModal/SessionModal';
import moment from 'moment';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthRoute from './AuthRoute';
import routeList from './routeList';
import routeRedirectList from './routeRedirectList';
export default function AppRoute() {
  useEffect(() => {
    const checkSession = () => {
      const exp: number = JSON.parse(
        localStorage.getItem('usr') !== 'expired' && localStorage.getItem('usr')
      )?.exp;
      if (moment().isAfter(moment.unix(exp))) {
        refreshTknAPI();
      }
    };
    checkSession();
    setInterval(checkSession, 60000);
  }, []);
  return (
    <Router>
      <Routes>
        <Route element={<AuthRoute />}>
          {routeRedirectList.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<Navigate to={route.redirect} replace />}
            />
          ))}
          {routeList.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
      </Routes>
      <SessionModal visible={localStorage.getItem('usr') === 'expired'} />
    </Router>
  );
}
