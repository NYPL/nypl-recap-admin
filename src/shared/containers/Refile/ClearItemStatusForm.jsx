import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from  'axios';
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';
import { isBarcodeValid } from '../../utils/ValidationUtils';
import FormField from '../../components/FormField/FormField';

class ClearItemStatusForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'refile',
      formFields: {
        barcode: ''
      },
      fieldErrors: {},
      formResult: {}
    };
    this.baseState = this.state;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  /**
  * @desc Handles updating the state for the given field name based on the value changes
  * @param {object} event - contains the current event context of the input field
  */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ formFields: {...this.state.formFields, [name]: value} });
  }

  /**
  * @desc Handles executing the focus() function for the given fieldName React ref instance
  * @param {string} fieldName - the ref string name
  */
  focusOnField(fieldName) {
    if (this[fieldName]) {
      this[fieldName].focus();
    }
  }

  /**
  * @desc Handles setting the passed field object property only it has not been defined in the
  * fieldErrors object
  * @param {string} field - the string name of the fieldErrors property
  * @param {object} state - the current state object
  * @param {string} errorString - the string representation for the error field to be presented in
  * the UI (default: Required field)
  */
  setFieldError(field, state, errorString = 'Required field') {
    const currentState = state;

    if (typeof currentState.fieldErrors === 'object' && isEmpty(currentState.fieldErrors[field])) {
      const currentFieldErrorsState = {...currentState.fieldErrors, [field]: errorString };

      this.setState({
        fieldErrors: currentFieldErrorsState,
      });
    }
  }

  /**
  * @desc Handles deleting the passed state object property only if defined
  * @param {string} field - the string name of the fieldErrors property
  * @param {object} state - the current state object
  */
  removeFieldError(field, state) {
    const currentState = state;
    // Only remove and update state existing field errors
    if (currentState.fieldErrors[field]) {
      delete currentState.fieldErrors[field];

      this.setState({
        fieldErrors: currentState.fieldErrors,
      });
    }
  }

  /**
  * @desc Handles validating the given fieldName based on the validation rules for the type of input
  * @param {string} fieldName - the string name of the input field
  * @param {object} state - the current state object
  */
  validateField(fieldName, state) {
    if (state.formFields[fieldName].length > 20) {
      this.setFieldError(fieldName, state, 'The barcode must be no longer than 20 digits');

      return fieldName;
    } else {
      this.removeFieldError(fieldName, state);
    }

    return;
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
  * @desc Handles sending the form field payload from the state to the proper API endpoint. All
  * fields are validated prior to executing the ajax call. Updates the form state booleans and result
  * based on successful or error responses
  * @param {object} event - contains the current event context of the field
  */
  handleFormSubmit(event) {
    event.preventDefault();

    // The array that stores the results after validating the inputs
    const fieldErrorsArray = [];

    // Iterate through patron fields and ensure all fields are valid
    forIn(this.state.formFields, (value, key) => {
      this.validateField(key, this.state, true);
      fieldErrorsArray.push(this.validateField(key, this.state));
    });

    if (fieldErrorsArray.length) {
      this.focusOnField(fieldErrorsArray[0]);
    }

    if (!fieldErrorsArray.length) {
      const {
        formFields: {
          barcode,
        }
      } = this.state;

      // Update the Parent Container Loading State
      this.props.setApplicationLoadingState(true);

      return axios.post(
        '/set-item-status',
        {
          barcode,
        }
      ).then(response => {
        console.log('Form Successful Response: ', response);
        this.props.setApplicationLoadingState(false);
        this.setState({...this.baseState, formResult: { processed: true } });
      }).catch(error => {
        console.log('Form Error Response: ', error);
        this.props.setApplicationLoadingState(false);
        this.setState({...this.state, formResult: { processed: false, response: error } });
      });
    }
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>Refile</h2>
        <h3>Set Item Status</h3>
        <p>Clear an "in transit" or "checked out" item status in Sierra</p>
        <form onSubmit={this.handleFormSubmit}>
          <FormField
            className="nypl-text-field"
            id="barcode"
            type="text"
            label="Barcode"
            fieldName="barcode"
            instructionText="Make sure the item is available in SCSB first"
            value={this.state.formFields.barcode}
            handleOnChange={this.handleInputChange}
            errorField={this.state.fieldErrors.barcode}
            fieldRef={(input) => { this.barcode = input; }}
            placeholder="Enter Barcode"
            isRequired
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
      </div>
    );
  }
}

ClearItemStatusForm.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isFormProcessing: PropTypes.bool,
  setApplicationLoadingState: PropTypes.func
};

ClearItemStatusForm.defaultProps = {
  className: '',
  id: ''
};

export default ClearItemStatusForm;
