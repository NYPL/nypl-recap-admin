import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from  'axios';
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';
import { isBarcodeValid } from '../../utils/ValidationUtils';
import FormField from '../../components/FormField/FormField';
import ClearItemStatusForm from './ClearItemStatusForm';
import RefileErrorsForm from './RefileErrorsForm';

class Refile extends Component {
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
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
  * @desc Handles updating the state based on the validation function executed in the setState
  * anonymous function.
  * @param {object} event - contains the current event context of the input field
  */
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
          barcode
        }
      } = this.state;

      // Update the Parent Container Loading State
      this.props.setApplicationLoadingState(true);

      return axios.post('/transfer-metadata', {
        barcodes: [barcode],
        bibRecordNumber,
        protectCGD,
        email: 'johndoe@example.com',
        action: type
      }).then(response => {
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
        <ClearItemStatusForm
          onSubmit={this.handleFormSubmit}
          handleOnChange={this.handleInputChange}
          handleOnBlur={this.handleInputBlur}
          value={this.state.formFields.barcode}
          errorField={this.state.fieldErrors.barcode}
          fieldRef={(input) => { this.startDate = input; }}
          disabled={this.props.isFormProcessing}
        />
        <RefileErrorsForm
          onSubmit={this.handleFormSubmit}
          handleOnChange={this.handleInputChange}
          handleOnBlur={this.handleInputBlur}
          value={this.state.formFields.barcode}
          errorField={this.state.fieldErrors.barcode}
          fieldRef={(input) => { this.startDate = input; }}
          disabled={this.props.isFormProcessing}
        />
      </div>
    );
  }
}

Refile.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isFormProcessing: PropTypes.bool,
  setApplicationLoadingState: PropTypes.func
};

Refile.defaultProps = {
  className: 'transfer-metadata-view',
  id: 'transfer-metadata-view'
};

export default Refile;
