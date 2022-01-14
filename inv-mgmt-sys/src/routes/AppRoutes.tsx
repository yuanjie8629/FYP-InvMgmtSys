import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import routeList from './routeList';
import routeRedirectList from './routeRedirectList';
export default function AppRoute() {
  return (
    <Router>
      <Routes>
        {routeRedirectList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Navigate to={route.redirect}/>}
          ></Route>
        ))}
        {routeList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.component}
          />
        ))}
      </Routes>
    </Router>
  );
}
