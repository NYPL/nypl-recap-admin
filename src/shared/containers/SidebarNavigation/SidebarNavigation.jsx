import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';

class SidebarNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav className={this.props.className} id={this.props.id}>
        <h2>Sidebar Navigation</h2>
        <ul>
          <li>
            <Link to="/systems-status">System Dashboard</Link>
          </li>
          <li>
            <Link to="/update-metadata">Update SCSB Metadata</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

SidebarNavigation.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

SidebarNavigation.defaultProps = {
  className: 'sidebar-navigation',
};

export default SidebarNavigation;
