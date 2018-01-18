import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import SidebarNavigation from '../SidebarNavigation/SidebarNavigation';

class ApplicationContainer extends Component {
  render() {
    return (
      <div id="recap-admin" className="recap-admin">
        <SidebarNavigation />
        <main>
          {renderRoutes(this.props.route.routes)}
        </main>
      </div>
    );
  }
}

export default ApplicationContainer;
