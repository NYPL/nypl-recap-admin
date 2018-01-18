// React Dependencies
import React from 'react';
import { renderToString } from 'react-dom/server';
// Routing Modules
import StaticRouter from 'react-router-dom/StaticRouter';
import { matchRoutes, renderRoutes } from 'react-router-config';
import routes from '../../../shared/routes';
// App Config
import config from '../../../../config/appConfig';

export function renderAdminView(req, res, next) {
  let context = {};
  const isProduction = process.env.NODE_ENV === 'production';
  const { appTitle, favIconPath } = config;

  const markup = renderToString(
    <StaticRouter location={req.url} context={context}>
      {renderRoutes(routes)}
    </StaticRouter>
  );

  return res.render('index', {
    markup,
    isProduction,
    appTitle,
    favicon: favIconPath,
  });
}
