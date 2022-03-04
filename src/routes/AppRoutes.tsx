import PageLoad from '@components/Loading/PageLoad';
import SessionExpModal from '@components/Modal/AuthModal/SessionExtendModal';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthRoute from './AuthRoute';
import routeList from './routeList';
import routeRedirectList from './routeRedirectList';
import { useEffect, useState } from 'react';
import { verifyTknAPI } from '@api/services/authAPI';

export default function AppRoute() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    verifyTknAPI().finally(() => {
      setLoading(false);
    });
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
              element={
                <>
                  {loading ? <PageLoad /> : route.component}
                  <SessionExpModal />
                </>
              }
            />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}
