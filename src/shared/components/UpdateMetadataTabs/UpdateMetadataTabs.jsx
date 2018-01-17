import React from 'react';
import PropTypes from 'prop-types';

class UpdateMetadataTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ul>
        <li><Link to="/update-metadata/update-item-xml">Update Item XML from Sierra</Link></li>
        {/* <li><Link to="/update-scsb-metadata/transfer-barcode">Transfer Barcode & Update XML</Link></li> */}
      </ul>
    );
  }
}

UpdateMetadataTabs.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

UpdateMetadataTabs.defaultProps = {
  className: 'main-panel',
};

export default UpdateMetadataTabs;


