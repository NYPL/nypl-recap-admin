import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';

class ApplicationContainer extends Component {
  render() {
    return (
      <div className='app-container'>
        <SidebarNavigation />
        <main>
          {renderRoutes(this.props.route.routes)}
        </main>
      </div>
    );
  }
}

export default ApplicationContainer;
