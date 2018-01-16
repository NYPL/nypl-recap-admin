import React from 'react';
import { Route, IndexRoute } from 'react-router';
import ApplicationContainer from '../containers/ApplicationContainer/ApplicationContainer';
import Dashboard from '../components/Dashboard/Dashboard';
import NotFound from '../containers/NotFound/NotFound';

const routes = (
  <Route path="/" component={ApplicationContainer}>
    <IndexRoute component={NotFound} />
    <Route path="dashboard" component={Dashboard} />
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
