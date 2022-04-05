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
import { findRoutePath } from '@utils/routingUtils';
import ScrollToTop from './ScrollToTop';

export default function AppRoute() {
  const [loading, setLoading] = useState(false);
  const [sessionExp, setSessionExp] = useState(false);
  useEffect(() => {
    setLoading(true);
    verifyTknAPI()
      .then(() => {
        setSessionExp(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setSessionExp(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <ScrollToTop>
        <Routes>
          {sessionExp && (
            <Route element={<Navigate to={findRoutePath('login')} />} />
          )}
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
                  loading ? (
                    <PageLoad />
                  ) : (
                    <>
                      {route.component}
                      <SessionExpModal />
                    </>
                  )
                }
              />
            ))}
          </Route>
        </Routes>
      </ScrollToTop>
    </Router>
  );
}
