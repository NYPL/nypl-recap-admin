// React Dependencies
import React from 'react';
import { renderToString } from 'react-dom/server';
// Routing Modules
import { match, RouterContext } from 'react-router';
import routes from '../../../shared/routes';
// App Config
import config from '../../../../config/appConfig';

export function renderAdminView(req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  // const iso = new Iso();

  // alt.bootstrap(JSON.stringify(res.locals.data || {}));

  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    // in case of error display the error message
    if (err) {
      return res.status(500).send(err.message);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return res.status(404).send('Not Found');
    }

    const applicationMarkup = renderToString(<RouterContext {...renderProps} />);
    //iso.add(markup, alt.flush());

    return res.render('index', {
      markup: applicationMarkup, //iso.render(),
      isProduction,
      appTitle: config.appTitle,
      favicon: config.favIconPath,
    });
  });
}
