import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from  'axios';
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';
import FormField from '../../components/FormField/FormField';
import moment from 'moment';
import { map as _map } from 'underscore';

class RefileErrorsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formFields: {
        startDate: moment().subtract(1, 'day').format('MM/DD/YYYY'),
        endDate: moment().format('MM/DD/YYYY'),
        offset: 0,
      },
      fieldErrors: {},
      formResult: {},
      refileErrorResults: [],
      refileErrorResultsTotal: 0,
      pageOfRefileErrorResults: 1,
    };
    this.baseState = this.state;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.clickSubmit = this.clickSubmit.bind(this);
    this.hitPageButtonPre = this.hitPageButtonPre.bind(this);
    this.hitPageButtonNext = this.hitPageButtonNext.bind(this);
  }

  componentDidMount() {
    this.handleFormSubmit();
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
        // TODO: implement validations, make sure 1) there's value; 2) the value is in the valid format
        break;
      case 'endDate':
        // TODO: implement validations, make sure 1) there's value; 2) the value is in the valid format
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

  clickSubmit(event) {
    event.preventDefault();
    this.handleFormSubmit();
  }

  hitPageButtonPre() {
    if (parseInt(this.state.formFields.offset, 10) <= 0) {
      return;
    }

    this.setState({
      formFields: {
        startDate: this.state.formFields.startDate,
        endDate: this.state.formFields.endDate,
        offset: this.state.formFields.offset - 25,
      },
      pageOfRefileErrorResults: this.state.pageOfRefileErrorResults - 1
    }, () => { this.handleFormSubmit(); });
  }

  hitPageButtonNext() {
    console.log(this.state.formFields.offset);
    console.log(this.state.refileErrorResultsTotal);

    if (parseInt(this.state.refileErrorResultsTotal, 10) <= parseInt(this.state.formFields.offset, 10)) {
      return;
    }

    this.setState({
      formFields: {
        startDate: this.state.formFields.startDate,
        endDate: this.state.formFields.endDate,
        offset: this.state.formFields.offset + 25,
      },
      pageOfRefileErrorResults: this.state.pageOfRefileErrorResults + 1
    }, () => { this.handleFormSubmit(); });
  }

  /**
  * @desc Handles sending the form field payload from the state to the proper API endpoint. All
  * fields are validated prior to executing the ajax call. Updates the form state booleans and result
  * based on successful or error responses
  * @param {object} event - contains the current event context of the field
  */
  handleFormSubmit() {
    event.preventDefault();

    // TODO: execute validations here
    // Iterate through patron fields and ensure all fields are valid
    // forIn(this.state.formFields, (value, key) => {
    //   this.validateField(key, this.state, true);
    // });

    if (isEmpty(this.state.fieldErrors)) {
      const {
        type,
        formFields: {
          startDate,
          endDate,
          offset,
        }
      } = this.state;

      // Update the Parent Container Loading State
      this.props.setApplicationLoadingState(true);

      // The format of start date and end date should be MM/DD/YYYY
      return axios.post(
        '/get-refile-errors',
        {
          startDate,
          endDate,
          offset,
        }
      ).then(response => {
        console.log('Form Successful Response: ', response);
        this.props.setApplicationLoadingState(false);

        this.setState({
          ...this.baseState,
          formResult: { processed: true },
          refileErrorResultsTotal: response.data.data.totalCount,
          refileErrorResults: response.data.data.data,
          formFields: {
            startDate: this.state.formFields.startDate,
            endDate: this.state.formFields.endDate,
            offset: this.state.formFields.offset,
          },
          pageOfRefileErrorResults: this.state.pageOfRefileErrorResults,
        });
      }).catch(error => {
        console.log('Form Error Response: ', error);
        this.props.setApplicationLoadingState(false);
        this.setState({...this.state, formResult: { processed: false, response: error } });
      });
    }
  }

  /**
  * @desc Handles returning the correct DOM for the Refile Errors form
  */
  renderRefileErrorsFrom() {
    return(
      <form onSubmit={this.clickSubmit}>
        <FormField
          className="nypl-text-field"
          id="startDate"
          type="text"
          label="StartDate"
          fieldName="startDate"
          instructionText="Please enter a date as the follow format MM/DD/YYYY"
          value={this.state.formFields.startDate}
          handleOnChange={this.handleInputChange}
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
          instructionText="Please enter a date as the follow format MM/DD/YYYY"
          value={this.state.formFields.endDate}
          handleOnChange={this.handleInputChange}
          handleOnBlur={this.handleInputBlur}
          errorField={this.state.fieldErrors.endDate}
          fieldRef={(input) => { this.endDate = input; }}
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
    );
  }

  renderRefileErrorResults() {
    const itemRows = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      this.state.refileErrorResults.map((item, i) =>
        <tr key={i}>
          <td>{item.id}</td>
          <td>{item.itemBarcode}</td>
          <td>{(item.updatedDate) ? item.createdDate.split('T')[0] : ''}</td>
          <td>{(item.updatedDate) ? item.updatedDate.split('T')[0] : ''}</td>
        </tr>
      ) : null;

    return (
      <table>
        <caption className="hidden">Refile Error Details</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Barcodes</th>
            <th scope="col">Created Date</th>
            <th scope="col">Updated Date</th>
          </tr>
        </thead>
        <tbody>
          {itemRows}
        </tbody>
      </table>
    );
  }

  render() {
    const itemStart = this.state.formFields.offset;
    const currentPage = this.state.pageOfRefileErrorResults;
    return (
      <div className={this.props.className} id={this.props.id}>
        <h3>Refile Errors</h3>
        <p>Enter dates below to see errors for a specific date range</p>
        {this.renderRefileErrorsFrom()}
        <div>
          {this.renderRefileErrorResults()}
        </div>
        <button onClick={this.hitPageButtonPre}>Previous</button>
        <p>Page {currentPage} of {Math.ceil((parseInt(this.state.refileErrorResultsTotal, 10) / 25))}</p>
        <button onClick={this.hitPageButtonNext}>Next</button>
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
  className: '',
  id: ''
};

export default RefileErrorsForm;
