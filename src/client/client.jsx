import React from 'react';
import { hydrate } from 'react-dom';
// React Router & App Routes
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { renderRoutes } from 'react-router-config';
import routes from '../shared/routes';
// Styles
import './styles/main.scss';

const AppRouter = () => {
  return (
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  );
}

window.onload = () => {
  require('wicg-inert');
  hydrate(<AppRouter />, document.getElementById('nypl-recap-admin'));
};
