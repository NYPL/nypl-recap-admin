import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UpdateMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>UpdateMetadata</h2>
      </div>
    );
  }
}

UpdateMetadata.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

UpdateMetadata.defaultProps = {
  className: 'update-metadata-view',
};

export default UpdateMetadata;
