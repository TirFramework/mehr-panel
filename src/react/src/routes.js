import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';


import Dashboard from './pages/Dashboard';
import Index from './pages/Index';

import NotFound from './pages/404';

const Routes = () => {
  return (
    <Switch>

      <Route path="/" component={Dashboard} />
      <Route path="/:slug/index" component={Index} />

      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
