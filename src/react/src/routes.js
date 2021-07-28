import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';


import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import Create from './pages/Create';

import NotFound from './pages/404';

const Routes = () => {
  return (
    <Switch>

      <Route path="/dashboard" component={Dashboard} />
      <Route path="/post/index" component={Index} />
      <Route path="/:pageType/create" component={Create} />

      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
