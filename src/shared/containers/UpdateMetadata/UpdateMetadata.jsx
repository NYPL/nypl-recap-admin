import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import FormField from '../../components/FormField/FormField';

class UpdateMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'update',
      barcodes: [],
      incorrect_barcodes: [],
      protectCGD: false,
      formResult: {},
      fieldErrors: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Update the inert flag when the form is in a processing/loading state
    if (nextProps.isFormProcessing === true) {
      this.updateForm.inert = true;
    } else {
      this.updateForm.inert = false;
    }
  }

  /**
  * @desc Generates an array from the field input value that matches numerical characters of
  * maximum barcodeLength. Iterates through the array and places correctly and/or incorrectly formed
  * barcodes into their appropriate arrays.
  * @param {string} inputValue - string value from input field
  * @param {integer} barcodeLength - maximum barcode length
  * @return {object} object containing the result of correct/incorrect barcodes as arrays
  */
  sanitizeBarcodesField(inputValue = '', barcodeLength = 14) {
    const correctArray = [];
    const incorrectArray = [];
    const barcodeRegex = new RegExp(`^\\d{${barcodeLength}}$`);
    // generate an array of barcodes, filter empty values
    const linesArray = inputValue.trim().split(/[\W\s]+/).filter(v => v);

    for (let value of linesArray) {
      if (value.match(barcodeRegex)) {
        correctArray.push(value);
      } else {
        incorrectArray.push(value);
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
      const { correct_barcodes, incorrect_barcodes } = this.sanitizeBarcodesField(fieldValue);

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
        this.setState({ fieldErrors: {
          [name]: 'The barcode(s) remaining are incorrect, each barcode must be 14 numerical digits'
        }});
      } else {
        // Reset the errors object
        this.setState({ fieldErrors: {} });
      }

      if (isEmpty(fieldValue)) {
        this.setState({ fieldErrors: { [name]: 'The barcode(s) field is required' } });
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
      this.props.setApplicationLoadingState(true);
      return axios.post('/update-metadata', {
        barcodes,
        protectCGD,
        email: 'johndoe@example.com',
        action: type
      }).then(response => {
        console.log('Form Successful Response: ', response);
        this.props.setApplicationLoadingState(false);
        // Reset the correct barcodes array
        this.setState({ barcodes: [], formResult: { processed: true } });
      }).catch(error => {
        console.log('Form Error Response: ', error);

        this.props.setApplicationLoadingState(false);
        this.setState({ formResult: { processed: false, response: error } });
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
    const { barcodes } = formState;
    return !isEmpty(barcodes) ? true : false;
  }

  /**
  * @desc Handles returning the correct DOM for the Form Submission API results
  */
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

  /**
  * @desc Handles returning the correct DOM for the Update Metadata form
  */
  renderUpdateMetadataForm() {
    return (
      <form onSubmit={this.handleFormSubmit} ref={(elem) => { this.updateForm = elem; }}>
        <FormField
          className="nypl-text-area-with-label"
          id="barcodes"
          label="Barcode(s)"
          fieldName="barcodes"
          type="textarea"
          handleOnBlur={this.handleInputBlur}
          errorField={this.state.fieldErrors.barcodes}
          fieldRef={(input) => { this.barcodes = input; }}
          isRequired
        />
        <FormField
          className="nypl-generic-checkbox"
          id="protectCGD"
          type="checkbox"
          label="Protect CGD"
          fieldName="protectCGD"
          checked={this.state.protectCGD}
          handleOnChange={this.handleInputChange}
        />
        <div className="nypl-submit-button-wrapper">
          <input
            className="nypl-primary-button"
            type="submit"
            value="Submit"
            disabled={this.props.isFormProcessing}
          />
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>Update SCSB Metadata</h2>
        {this.renderFormSubmissionResults()}
        {this.renderUpdateMetadataForm()}
      </div>
    );
  }
}

UpdateMetadata.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isFormProcessing: PropTypes.bool,
  setApplicationLoadingState: PropTypes.func
};

UpdateMetadata.defaultProps = {
  className: 'update-metadata-view',
  id: 'update-metadata-view'
};

export default UpdateMetadata;
