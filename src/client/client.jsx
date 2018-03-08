import React from 'react';
import { hydrate } from 'react-dom';
// React Router & App Routes
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { renderRoutes } from 'react-router-config';
import routes from '../shared/routes';
// Styles
import './styles/main.scss';

const Root = ({ store }) => {
  return (
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  );
}

window.onload = () => {
  require('wicg-inert');

  hydrate(
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>,
    document.getElementById('nypl-recap-admin')
  );
};
