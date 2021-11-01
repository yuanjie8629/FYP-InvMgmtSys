import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import routeList from './RouteList';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/dashboard' />
        </Route>
        {routeList.map((route) => (
          <Route key={route.path} path={route.path} component={route.component} />
        ))}
      </Switch>
    </Router>
  );
}
