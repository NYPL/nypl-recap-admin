import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  }

  componentWillReceiveProps(nextProps) {
    // Update the inert flag when the form is in a processing/loading state
    if (nextProps.isFormProcessing === true) {
      this.refileForm.inert = true;
    } else {
      this.refileForm.inert = false;
    }
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
  * @desc Handles deleting the passed state object property only if defined
  * @param {string} field - the string name of the fieldErrors property
  * @param {object} state - the current state object
  */
  removeFieldError(field, state) {
    const currentState = state;
    // Only remove and update state existing field errors
    if (currentState.fieldErrors[field]) {
      delete currentState.fieldErrors[field];
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
      currentState.fieldErrors[field] = errorString;
    }
  }

  /**
  * @desc Handles validating the given fieldName based on the validation rules for the type of input
  * @param {string} fieldName - the string name of the input field
  * @param {object} state - the current state object
  * @param {boolean} focusOnError - flag utilized to execute focusOnField() if true (default: false)
  */
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
      default:
        break;
    }
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

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h2>Refile</h2>
        <h3>Set Item Status</h3>
        <p>Clear an "in transit" or "checked out" item status in Sierra</p>
        <form onSubmit={this.props.onSubmit} ref={(elem) => { this.refileForm = elem; }}>
          <FormField
            className="nypl-text-field"
            id="barcode"
            type="text"
            label="Barcode"
            fieldName="barcode"
            instructionText="Make sure the item is available in SCSB first"
            value={this.state.formFields.barcode}
            handleOnChange={this.props.handleOnChange}
            handleOnBlur={this.props.handleOnBlur}
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
              disabled={this.props.disabled}
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
  className: 'transfer-metadata-view',
  id: 'transfer-metadata-view'
};

export default ClearItemStatusForm;
