import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UpdateMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'transfer-barcode',
      barcodes: [
        {
          value: ''
        }
      ],
      barcode: '',
      customerCode: '',
      bibRecordNumber: '',
      protectCGD: true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.addBarcodeField = this.addBarcodeField.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleFormSubmit() {
    console.log(this.state);
  }

  renderFormField({ inputRef, ...rest }) {
    return (
      <input ref={inputRef} {...rest} />
    );
  }

  handleBarcodesInputChange(index) {
    return (evt) => {
      const updatedBarcodes = this.state.barcodes.map((barcode, idx) => {
        if (index !== idx) {
          return barcode;
        }

        return { ...barcode, value: evt.target.value };
      });

      this.setState({ barcodes: updatedBarcodes });
    }
  }

  addBarcodeField() {
    this.setState({ barcodes: this.state.barcodes.concat([{ value: '' }]) });
  }

  removeBarcodeField(index) {
    this.setState({ barcodes: this.state.barcodes.filter((elem, idx) => index !== idx ) });
  }

  renderTransferBarcodeForm() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        {this.state.barcodes.map((barcode, index) => (
          <li key={index}>
            <input
              type="text"
              placeholder={index > 0 ? `Barcode #${index + 1}` : 'Barcode'}
              value={barcode.value}
              onChange={this.handleBarcodesInputChange(index)}
            />
            {
              (index > 0) &&
              <button type="button" onClick={this.removeBarcodeField.bind(this, index)}>-</button>
            }
          </li>
        ))}
        {this.state.barcodes.length < 10 &&
          <button type="button" onClick={this.addBarcodeField}>
            Add New Barcode
          </button>
        }
        <div>
          <label htmlFor="barcode">Barcode</label>
          <input
            id="barcode"
            name="barcode"
            type="text"
            value={this.state.barcode}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="customerCode">Customer Code</label>
          <input
            id="customerCode"
            name="customerCode"
            type="text"
            value={this.state.customerCode}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="protectCGD">Protect CGD</label>
          <input
            id="protectCGD"
            name="protectCGD"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange}
          />
        </div>
        <input type="submit" value="Submit" />
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
