import React from 'react';
import PropTypes from 'prop-types';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>Sidebar</h2>
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
