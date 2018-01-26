import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

class UpdateMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'update',
      barcodes: [],
      incorrect_barcodes: [],
      protectCGD: false,
      isFormProcessing: false,
      formResult: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  /**
  * @desc Iterates through a given array and places correctly formed barcodes into the appropriate
  * array. In addition, incorrect barcodes are placed in their independent array.
  * @param {array} array - list containing barcodes of type string
  * @param {integer} barcodeLength - maximum barcode length
  * @return {object} object containing the result of correct/incorrect barcodes as arrays
  */
  sanitizeBarcodesArray(array, barcodeLength = 14) {
    const correctArray = [];
    const incorrectArray = [];
    for (let value of array) {
      if (typeof value === 'string' && value.trim() !== '') {
        const cleanedValue = value.replace(/[^\d]/g, '');

        if (cleanedValue !== '' && cleanedValue.length === barcodeLength) {
          correctArray.push(cleanedValue);
        } else {
          incorrectArray.push(value);
        }
      }
    }

    return {
      correct_barcodes: correctArray,
      incorrect_barcodes: incorrectArray
    };
  }

  /**
  * @desc Handles updating the state for the given field name based on the value changes
  * @param {object} event - contains the current event context of the input field
  */
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  /**
  * @desc Handles updating the state for the given field name based on the value changes. Currently,
  * updates the state of correct and incorrect barcodes for the textarea field.
  * @param {object} event - contains the current event context of the field
  */
  handleInputBlur(event) {
  const { target: { type, name, value, checked }} = event;
  const fieldValue = type === 'checkbox' ? checked : value;

    if (type === 'textarea' && name === 'barcodes') {
      const lines = fieldValue.trim().split(/\n/);
      const { correct_barcodes, incorrect_barcodes } = this.sanitizeBarcodesArray(lines);

      if (!isEqual(correct_barcodes, this.state.barcodes)) {
        this.setState((state) => ({ barcodes: [...state.barcodes, ...correct_barcodes] }));
      }

      // Override the incorrect barcodes on every blur event if they are not the same
      if (!isEqual(incorrect_barcodes, this.state.incorrect_barcodes)) {
        this.setState({ incorrect_barcodes: incorrect_barcodes });
      }

      // Only update the textarea with incorrect barcodes
      if (!isEmpty(incorrect_barcodes)) {
        const updatedTextAreaValues = incorrect_barcodes.join('\n');
        event.target.value = updatedTextAreaValues;
      }
    }
  }

  /**
  * @desc Handles sending the form field payload from the state to the proper API endpoint. All
  * fields are validated prior to executing the ajax call. Updates the form state booleans and result
  * based on successful or error responses
  * @param {object} event - contains the current event context of the field
  */
  handleFormSubmit(event) {
    event.preventDefault();

    if (this.areFormFieldsValid(this.state)) {
      const { type, barcodes, protectCGD } = this.state;
      this.setState({ isFormProcessing: true });

      return axios.post('/update-metadata', {
        barcodes,
        protectCGD,
        email: 'johndoe@example.com',
        action: type
      }).then(response => {
        console.log('Form Successful Response: ', response);

        this.setState({
          isFormProcessing: false,
          formResult: { processed: true }
        });
      }).catch(error => {
        console.log('Form Error Response: ', error);

        this.setState({
          isFormProcessing: false,
          formResult: { processed: false, response: error }
        });
      });
    }
  }

  /**
  * @desc Verifies that there are no incorrect_barcodes and that the correct_barcodes array contains
  * values in order to process proper data upon submission
  * @param {object} state - current form state object
  * @return {boolean} if formState fields are valid returns true, otherwise it will default to false
  */
  areFormFieldsValid(formState) {
    const { barcodes, incorrect_barcodes } = formState;
    return !isEmpty(barcodes) && isEmpty(incorrect_barcodes) ? true : false;
  }

  renderUpdateMetadataForm() {
    const areBarcodesInvalid = (this.state.incorrect_barcodes.length > 0);
    const barcodesInvalidClass = areBarcodesInvalid ? 'error' : '';
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div>
          <label htmlFor="barcodes">Barcode(s)</label>
          <textarea
            className={`barcodes ${barcodesInvalidClass}`}
            id="barcodes"
            name="barcodes"
            onBlur={this.handleInputBlur}
          />
          {
            areBarcodesInvalid &&
            <div className="field-errors">
              <p>The remaining barcode(s) are incorrect, please verify that each barcode is 14 numerical digits</p>
            </div>
          }
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
