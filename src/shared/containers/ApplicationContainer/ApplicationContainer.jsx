import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/Sidebar';

class ApplicationContainer extends React.Component {
  render() {
    return (
      <div id="recap-admin" className="recap-admin">
        <div><h1>Header</h1></div>
        <div>
          Sidebar goes here
        </div>
        {this.props.children}
        <div><h2>Footer</h2></div>
      </div>
    );
  }
}

ApplicationContainer.propTypes = {
  children: PropTypes.node,
};

export default ApplicationContainer;
