import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
// React Router & App Routes
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { renderRoutes } from 'react-router-config';
import routes from '../shared/routes';

import configureStore from '../shared/store/configureStore';
// Styles
import './styles/main.scss';

// Initialize store
const store = configureStore();

console.log(store);

const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  );
}

window.onload = () => {
  require('wicg-inert');

  hydrate(
    <BrowserRouter>
      <Provider store={store}>
        {renderRoutes(routes)}
      </Provider>
    </BrowserRouter>,
    document.getElementById('nypl-recap-admin')
  );
};
