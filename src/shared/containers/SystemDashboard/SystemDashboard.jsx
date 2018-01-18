import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SystemDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>System Dashboard</h2>
      </div>
    );
  }
}

SystemDashboard.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

SystemDashboard.defaultProps = {
  className: 'system-dashboard-view',
};

export default SystemDashboard;
