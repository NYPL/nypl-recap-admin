import React from 'react';
import { render } from 'react-dom';
// React Router & App Routes
import { Router, browserHistory } from 'react-router';
import routes from '../shared/routes';
// Styles
import './styles/main.scss';

window.onload = () => {
  render(
    <Router history={browserHistory} routes={routes} />,
    document.getElementById('nypl-recap-admin')
  );
  // Iso.bootstrap((state, container) => {
  //   alt.bootstrap(state);
  //
  //   render(
  //     <Router history={browserHistory} routes={routes} />,
  //     container
  //   );
  //
  //   // Router.run(routes, Router.HistoryLocation, function (Handler) {
  //   //   var node = React.createElement(Handler)
  //   //   React.render(node, container)
  //   // })
  // });
};
