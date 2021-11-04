import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import routeList from './RouteList';
import routeRedirectList from './RouteRedirectList';

export default function Routes() {
  return (
    <Router>
      <Switch>
        {routeRedirectList.map((route) => (
          <Route exact key={route.path} path={route.path}>
            <Redirect to={route.redirect} />
          </Route>
        ))}
        {routeList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            component={route.component}
          />
        ))}
      </Switch>
    </Router>
  );
}
