import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class UpdateMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'transfer',
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

  handleFormSubmit(event) {
    event.preventDefault();

    if (this.areFormFieldsValid(this.state)) {
      const { type } = this.state;

      if (type === 'transfer') {
        const { barcodes, protectCGD } = this.state;
        const sanitizedBarcodes = this.sanitizeBarcodesList(barcodes);
        console.log('sanitized barcodes list', sanitizedBarcodes);

        return axios.post('/update-metadata', {
          barcodes: sanitizedBarcodes,
          protectCGD,
          email: 'johndoe@example.com',
          action: type
        }).then(response => {
          console.log({
            barcodes: sanitizedBarcodes,
            protectCGD,
            email: 'johndoe@example.com',
            action: type
          });

          console.log('Form Submission Response: ', response);
        }).catch(error => {
          console.log('Form Error: ', error);
        });
      }
    }
  }

  validateBarcodesList(barcodesList) {
    if (barcodesList && Array.isArray(barcodesList) && barcodesList.length > 0 && barcodesList[0].value !== '') {
      return true;
    }
    return false;
  }

  areFormFieldsValid(formState) {
    const { type } = formState;

    // Handle validations based on form type
    if (type === 'transfer') {
      const { barcodes } = formState;
      return this.validateBarcodesList(barcodes);
    }
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

  sanitizeBarcodesList(barcodesArray) {
    return barcodesArray.map(item => item.value);
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
        {
          this.state.barcodes.map((barcode, index) => (
            <div key={index}>
              <label htmlFor={`barcode-${index + 1}`}>
                {index > 0 ? '' : 'Barcode'}
              </label>
              <input
                id={`barcode-${index + 1}`}
                type="text"
                placeholder={index > 0 ? `Barcode #${index + 1}` : 'Barcode'}
                value={barcode.value}
                onChange={this.handleBarcodesInputChange(index)}
                pattern="[0-9]{14}"
                maxLength="14"
              />
              {
                (index > 0) &&
                <button type="button" onClick={this.removeBarcodeField.bind(this, index)}>-</button>
              }
            </div>
          ))
        }
        {
          this.state.barcodes.length < 10 &&
          <button type="button" onClick={this.addBarcodeField}>
            Add New Barcode
          </button>
        }
        <div>
          <label htmlFor="protectCGD">Protect CGD</label>
          <input
            id="protectCGD"
            name="protectCGD"
            type="checkbox"
            checked={this.state.protectCGD}
            onChange={this.handleInputChange}
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }

  render() {
    console.log(this.state);

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
