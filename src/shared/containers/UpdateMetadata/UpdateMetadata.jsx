import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isEqual from 'lodash/isEqual';

class UpdateMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateMetadataForm: {
        type: 'update',
        barcodes: [],
        protectCGD: false
      },
      transferBarcodeForm: {
        type: 'transfer',
        barcode: '',
        protectCGD: false
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTextareaOnBlur = this.handleTextareaOnBlur.bind(this);
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

      if (type === 'update') {
        const { barcodes, protectCGD } = this.state;

        return axios.post('/update-metadata', {
          barcodes,
          protectCGD,
          email: 'johndoe@example.com',
          action: type
        }).then(response => {
          console.log('Form Submission Response: ', response);
        }).catch(error => {
          console.log('Form Error: ', error);
        });
      }
    }
  }

  validateBarcodesList(list) {
    return (list && Array.isArray(list) && list.length > 0 && list[0] !== '') ? true : false;
  }

  areFormFieldsValid(formState) {
    const { type } = formState;

    // Handle validations based on form type
    if (type === 'update') {
      const { barcodes } = formState;
      return this.validateBarcodesList(barcodes);
    }
  }

  handleTextareaOnBlur(event) {
    const textAreaValue = event.target.value;

    if (typeof textAreaValue === 'string' && textAreaValue !== '') {
      const linesOfText = textAreaValue.trim().split(/\n/);

      const sanatizedBarcodes = linesOfText.filter(item => item !== (undefined || null || ''));
      //.map(item => item.replace(/(^[,\s]+)|([,\s]+$)/g, ''));
      // .filter(item => item.length === 14);

      const {
        updateMetadataForm: { barcodes }
      } = this.state;

      if (!isEqual(sanatizedBarcodes, barcodes)) {
        const newBarcodes = {...this.state.updateMetadataForm, barcodes: sanatizedBarcodes };
        this.setState({ updateMetadataForm: newBarcodes });
      }
    }
  }

  renderUpdateMetadataForm() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div>
          <label htmlFor="barcodes">Barcode(s)</label>
          <textarea
            id="barcodes"
            name="barcodes"
            onBlur={this.handleTextareaOnBlur}
          />
        </div>
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
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }

  render() {
    console.log(this.state);

    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>Update SCSB Metadata</h2>
        {this.renderUpdateMetadataForm()}
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
