import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id} style={{border: '1px solid black'}}>
        <h2>Library Services Platform Admin</h2>
        <ul>
          <li>
            <Link to="/update-metadata">Update SCSB Metadata</Link>
          </li>
        </ul>
      </div>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

Sidebar.defaultProps = {
  className: 'sidebar',
};

export default Sidebar;
