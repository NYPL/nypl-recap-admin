import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UpdateMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'transfer-barcode',
      barcode: '',
      customerCode: '',
      bibRecordNumber: '',
      cgdProtectionEnabled: true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleFormSubmit() {

  }

  renderTransferBarcodeForm() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <label>
          Barcode
          <input
            name="barcode"
            type="text"
            value={this.state.barcode}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Barcode
          <input
            name="barcode"
            type="text"
            value={this.state.barcode}
            onChange={this.handleInputChange}
          />
        </label>
      </form>
    );
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>Update SCSB Metadata</h2>
        {this.renderTransferBarcodeForm()}
      </div>
    );
  }
}

UpdateMetadata.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string
};

UpdateMetadata.defaultProps = {
  className: 'update-metadata-view',
  id: 'update-metadata-view'
};

export default UpdateMetadata;
