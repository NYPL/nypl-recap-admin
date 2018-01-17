import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../../components/Sidebar/Sidebar';
import Dashboard from '../../components/Dashboard/Dashboard';

class ApplicationContainer extends React.Component {
  render() {
    return (
      <div id="recap-admin" className="recap-admin">
        <Sidebar />
        <Dashboard />
      </div>
    );
  }
}

ApplicationContainer.propTypes = {
  children: PropTypes.node,
};

export default ApplicationContainer;
