import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../../components/Sidebar/Sidebar';

class ApplicationContainer extends React.Component {
  render() {
    return (
      <div id="recap-admin" className="recap-admin">
        <Sidebar />
        {this.props.children}
      </div>
    );
  }
}

ApplicationContainer.propTypes = {
  children: PropTypes.node,
};

export default ApplicationContainer;
