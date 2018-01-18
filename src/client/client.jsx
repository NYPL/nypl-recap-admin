import React from 'react';
import { render } from 'react-dom';
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
  render(<AppRouter />, document.getElementById('nypl-recap-admin'));
};
