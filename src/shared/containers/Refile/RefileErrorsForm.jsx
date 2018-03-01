import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';
import FormField from '../../components/FormField/FormField';

class RefileErrorsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formFields: {
        startDate: '',
        endDate: '',
      },
      fieldErrors: {},
      formResult: {}
    };
    this.baseState = this.state;
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
      case 'startDate':
        // if (!isBarcodeValid(state.formFields[fieldName])) {
        //   this.setFieldError(fieldName, state, 'The barcode field must be 14 numerical characters');
        //   if (focusOnError === true) {
        //     this.focusOnField(fieldName);
        //   }
        // } else {
        //   this.removeFieldError(fieldName, state);
        // }
        break;
      case 'endDate':
        // if (!isBarcodeValid(state.formFields[fieldName])) {
        //   this.setFieldError(fieldName, state, 'The barcode field must be 14 numerical characters');
        //   if (focusOnError === true) {
        //     this.focusOnField(fieldName);
        //   }
        // } else {
        //   this.removeFieldError(fieldName, state);
        // }
        break;
      default:
        break;
    }
  }

  /**
  * @desc Handles returning the correct DOM for the Refile Errors form
  */
  renderRefileErrorsFrom() {
    return(
      <form onSubmit={this.props.onSubmit} ref={(elem) => { this.refileForm = elem; }}>
        <FormField
          className="nypl-text-field"
          id="startDate"
          type="text"
          label="StartDate"
          fieldName="startDate"
          instructionText="Please enter a 14 digit barcode"
          value={this.state.formFields.startDate}
          handleOnChange={this.props.handleOnChange}
          handleOnBlur={this.props.handleInputBlur}
          errorField={this.state.fieldErrors.startDate}
          fieldRef={(input) => { this.startDate = input; }}
          isRequired
        />
        <span>to</span>
        <FormField
          className="nypl-text-field"
          id="endDate"
          type="text"
          label="EndDate"
          fieldName="endDate"
          instructionText="Please enter a 14 digit barcode"
          value={this.state.formFields.endDate}
          handleOnChange={this.props.handleOnChange}
          handleOnBlur={this.props.handleInputBlur}
          errorField={this.state.fieldErrors.endDate}
          fieldRef={(input) => { this.endDate = input; }}
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
    );
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id}>
        <h3>Refile Errors</h3>
        <p>Enter dates below to see errors for a specific date range</p>
        {this.renderRefileErrorsFrom()}
      </div>
    );
  }
}

RefileErrorsForm.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isFormProcessing: PropTypes.bool,
  setApplicationLoadingState: PropTypes.func
};

RefileErrorsForm.defaultProps = {
  className: 'transfer-metadata-view',
  id: 'transfer-metadata-view'
};

export default RefileErrorsForm;
