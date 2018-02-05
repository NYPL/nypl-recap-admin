import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from  'axios';
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';
import { isBarcodeValid, isBibRecordNumberValid } from '../../utils/ValidationUtils';

class TransferMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'transfer',
      formFields: {
        barcode: '',
        bibRecordNumber: '',
        protectCGD: false,
      },
      fieldErrors: {},
      isFormProcessing: false,
      formResult: {}
    };
    this.baseState = this.state;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  focusOnField(fieldName) {
    if (this[fieldName]) {
      this[fieldName].focus();
    }
  }

  removeFieldError(field, state) {
    const currentState = state;
    // Only remove and update state existing field errors
    if (currentState.fieldErrors[field]) {
      delete currentState.fieldErrors[field];
    }
  }

  setFieldError(field, state, errorString = 'Required field') {
    const currentState = state;

    if (typeof currentState.fieldErrors === 'object' && isEmpty(currentState.fieldErrors[field])) {
      currentState.fieldErrors[field] = errorString;
    }
  }

  validateField(fieldName, state, focusOnError = false) {
    switch (fieldName) {
      case 'barcode':
        if (!isBarcodeValid(state.formFields[fieldName])) {
          this.setFieldError(fieldName, state, 'The barcode field must be 14 numerical characters');
          if (focusOnError === true) {
            this.focusOnField(fieldName);
          }
        } else {
          this.removeFieldError(fieldName, state);
        }
        break;
      case 'bibRecordNumber':
        if (!isBibRecordNumberValid(state.formFields[fieldName])) {
          this.setFieldError(fieldName, state, 'The bibRecordNumber field is required');
          if (focusOnError === true) {
            this.focusOnField(fieldName);
          }
        } else {
          this.removeFieldError(fieldName, state);
        }
        break;
      default:
        break;
    }
  }

  /**
  * @desc Handles updating the state for the given field name based on the value changes
  * @param {object} event - contains the current event context of the input field
  */
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ formFields: {...this.state.formFields, [name]: value} });
  }

  handleInputBlur(event) {
    const { target, type } = event;
    const name = target.name;

    // React pattern to handle asynchronous state changes
    this.setState(prevState => {
      this.validateField(name, prevState);
      return prevState;
    });
  }

  /**
  * @desc Handles sending the form field payload from the state to the proper API endpoint. All
  * fields are validated prior to executing the ajax call. Updates the form state booleans and result
  * based on successful or error responses
  * @param {object} event - contains the current event context of the field
  */
  handleFormSubmit(event) {
    event.preventDefault();

    // Iterate through patron fields and ensure all fields are valid
    forIn(this.state.formFields, (value, key) => {
      this.validateField(key, this.state, true);
    });

    if (isEmpty(this.state.fieldErrors)) {
      const {
        type,
        formFields: {
          barcode, bibRecordNumber, protectCGD
        }
      } = this.state;

      this.setState({ isFormProcessing: true });

      return axios.post('/transfer-metadata', {
        barcodes: [barcode],
        bibRecordNumber,
        protectCGD,
        email: 'johndoe@example.com',
        action: type
      }).then(response => {
        console.log('Form Successful Response: ', response);
        this.setState({...this.baseState, formResult: { processed: true } });
      }).catch(error => {
        console.log('Form Error Response: ', error);
        this.setState({...this.state, formResult: { processed: false, response: error } });
      });
    }
  }

  renderFormSubmissionResults() {
    const { formResult } = this.state;
    let resultClass = 'nypl-form-success';
    let resultHeading = 'Success!';
    let resultText = 'Your form submission has been accepted';

    if (formResult && (formResult.processed === false || !isEmpty(formResult.response))) {
      resultClass = 'nypl-form-error';
      resultHeading = 'Error!';
      resultText = 'The API has encountered an error, please try again later.';
    }

    return !isEmpty(formResult) && (
      <div className={resultClass}>
        <h2>{resultHeading}</h2>
        <p>{resultText}</p>
      </div>
    );
  }

  renderTransferMetadataForm() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div>
          <label htmlFor="barcode">Barcode</label>
          <input
            id="barcode"
            name="barcode"
            type="text"
            value={this.state.formFields.barcode}
            onChange={this.handleInputChange}
            onBlur={this.handleInputBlur}
            ref={(input) => { this.barcode = input; }}
          />
        </div>
        <div>
          <label htmlFor="bibRecordNumber">Bib Record Number</label>
          <input
            id="bibRecordNumber"
            name="bibRecordNumber"
            type="text"
            value={this.state.formFields.bibRecordNumber}
            onChange={this.handleInputChange}
            onBlur={this.handleInputBlur}
            ref={(input) => { this.bibRecordNumber = input; }}
          />
        </div>
        <div>
          <label htmlFor="protectCGD">Protect CGD</label>
          <input
            id="protectCGD"
            name="protectCGD"
            type="checkbox"
            checked={this.state.formFields.protectCGD}
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
        <h2>Transfer Barcode & Update Metadata</h2>
        {this.renderFormSubmissionResults()}
        {this.renderTransferMetadataForm()}
      </div>
    );
  }
}

TransferMetadata.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string
};

TransferMetadata.defaultProps = {
  className: 'transfer-metadata-view',
  id: 'transfer-metadata-view'
};

export default TransferMetadata;
