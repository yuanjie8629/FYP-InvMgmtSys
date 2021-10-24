import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Login from '@pages/Login/Login';
import Dashboard from '@pages/Dashboard/Dashboard';


export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/dashboard' />
        </Route>
        <Route path='/login' component={Login}></Route>
        <Route path='/dashboard' component={Dashboard}></Route>
      </Switch>
    </Router>
  );
}
