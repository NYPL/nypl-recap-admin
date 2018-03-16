import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { forIn, assign } from 'lodash';
import moment from 'moment';
import FormField from '../../components/FormField/FormField';
import { modelRefileErrorResponse } from './../../utils/modelRefileErrorDataUtils';


class RefileErrorsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formFields: {
        startDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        offset: 0,
        resultLimit: 25,
      },
      fieldErrors: {},
      formResult: {},
      refileErrorResults: [],
      refileErrorResultsTotal: 0,
      pageOfRefileErrorResults: 1,
      displayFields: {
        startDate: '',
        endDate: '',
      },
    };
    this.baseState = this.state;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.clickSubmit = this.clickSubmit.bind(this);
    this.hitPageLink = this.hitPageLink.bind(this);
  }

  componentDidMount() {
    this.handleFormSubmit();
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
      const currentFieldErrorsState = assign(currentState.fieldErrors, { [field]: errorString });

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
  * @desc Handles executing the focus() function for the given fieldName React ref instance
  * @param {string} fieldName - the ref string name
  */
  focusOnField(fieldName) {
    if (this[fieldName]) {
      this[fieldName].focus();
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
  * @desc Validates the input
  * @param {string} date - the string of the input value
  */
  isDateValid(date) {
    if (!date) {
      return false;
    }

    const dateArray = date.split('-');
    // Checks if it has a valid date format. The Regex check if the inputs are digits
    // and if they have right number of digits
    const dateMatches = date.match(/^(\d{4})\-(\d{2})\-(?:\d{2})$/);

    if (!dateMatches) {
      return false;
    }

    // Checks if the month is valid
    if (parseInt(dateArray[1], 10) < 1 || parseInt(dateArray[1], 10) > 12) {
      return false;
    }

    // Checks if the date is valid
    if (parseInt(dateArray[2], 10) < 1 || parseInt(dateArray[2], 10) > 31) {
      return false;
    }

    return true;
  }

  /**
  * @desc Handles validating the given fieldName based on the validation rules for the type of input
  * @param {string} fieldName - the string name of the input field
  * @param {object} state - the current state object
  */
  validateField(fieldName, state) {
    if (fieldName === 'startDate' || fieldName === 'endDate') {
      if (!this.isDateValid(state.formFields[fieldName])) {
        this.setFieldError(
          fieldName, state,
          'Please enter the date following the format MM/DD/YYYY'
        );

        return fieldName;
      }

      // If no errors anymore, removes the error from the state
      this.removeFieldError(fieldName, state);
    }

    return;
  }

  /**
  * @desc When the submit button is clicked, it handles the event and executes handleFormSubmit()
  * @param {event} event - the click event
  */
  clickSubmit(event) {
    event.preventDefault();
    this.handleFormSubmit(true);
  }

  /**
  * @desc When the pagination button is clicked, it handles the event and executes
  * handleFormSubmit()
  * @param {string} type - indicates if it is previous button or next button has been clicked
  */
  hitPageLink(type) {
    event.preventDefault();

    const resultLimit = this.state.formFields.resultLimit;
    const pageIncrement = 1;
    // Set new state values based on the results from the new request
    const setStateForPagination = () => {
      const pageDifference = (type === 'pre') ? -1 : 1;

      this.setState({
        formFields: {
          startDate: this.state.formFields.startDate,
          endDate: this.state.formFields.endDate,
          offset: this.state.formFields.offset + resultLimit * pageDifference,
          resultLimit,
        },
        pageOfRefileErrorResults:
          this.state.pageOfRefileErrorResults + pageIncrement * pageDifference,
      }, () => { this.handleFormSubmit(); });
    };

    if (type === 'pre') {
      setStateForPagination();
    } else {
      setStateForPagination();
    }
  }

  /**
  * @desc Handle sending the form field payload from the state to the proper API endpoint. All
  * fields are validated prior to executing the ajax call. Updates the form state booleans and
  * result based on successful or error responses
  * @param {boolean} resetOffset - if the request is from a new range of dates, we show the results
  * from the first page
  */
  handleFormSubmit(resetOffset) {
    // The array that stores the results after validating the date inputs
    const fieldErrorsArray = [];

    // Iterate through date fields and ensure all fields are valid
    forIn(this.state.formFields, (value, key) => {
      if (this.validateField(key, this.state)) {
        fieldErrorsArray.push(this.validateField(key, this.state));
      }
    });

    if (fieldErrorsArray.length) {
      this.focusOnField(fieldErrorsArray[0]);
    }

    if (!fieldErrorsArray.length) {
      const {
        formFields: {
          startDate,
          endDate,
          resultLimit,
        },
      } = this.state;

      const offset = resetOffset ? 0 : this.state.formFields.offset;

      // Update the Parent Container Loading State
      this.props.setApplicationLoadingState(true);

      // The format of start date and end date should be MM/DD/YYYY
      return axios.post(
        '/get-refile-errors',
        {
          startDate,
          endDate,
          offset,
          resultLimit,
        }
      ).then(response => {
        this.props.setApplicationLoadingState(false);

        this.setState({
          ...this.baseState,
          formResult: { processed: true },
          refileErrorResultsTotal: response.data.data.totalCount,
          refileErrorResults: response.data.data.data,
          formFields: {
            startDate: this.state.formFields.startDate,
            endDate: this.state.formFields.endDate,
            offset,
            resultLimit,
          },
          pageOfRefileErrorResults: resetOffset ? 1 : this.state.pageOfRefileErrorResults,
          displayFields: {
            startDate: this.state.formFields.startDate,
            endDate: this.state.formFields.endDate,
          },
        });
      }).catch(error => {
        console.log('Form Error Response: ', error);

        this.props.setApplicationLoadingState(false);
        this.setState({
          ...this.state,
          formResult: { processed: false, response: error },
          refileErrorResults: [],
        });
      });
    }
  }

  /**
  * @desc Handles returning the correct DOM for the Refile Errors form
  */
  renderRefileErrorsFrom() {
    return (
      <form onSubmit={this.clickSubmit}>
        <div className="nypl-name-field nypl-filter-date-field">
          <FormField
            id="startDate"
            className="recap-admin-date-field"
            type="date"
            label="Start Date"
            fieldName="startDate"
            instructionText="The start date as the format as MM/DD/YYYY"
            value={this.state.formFields.startDate}
            handleOnChange={this.handleInputChange}
            errorField={this.state.fieldErrors.startDate}
            fieldRef={(input) => { this.startDate = input; }}
            isRequired
          />
          <span className="date-divider">to</span>
          <FormField
            id="endDate"
            className="recap-admin-date-field"
            type="date"
            label="End Date"
            fieldName="endDate"
            instructionText="The end date as the format as MM/DD/YYYY"
            value={this.state.formFields.endDate}
            handleOnChange={this.handleInputChange}
            errorField={this.state.fieldErrors.endDate}
            fieldRef={(input) => { this.endDate = input; }}
            isRequired
          />
        </div>
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

  /**
  * @desc Renders the results of refile errors
  */
  renderRefileErrorResults() {
    let resultContent = null;

    // Renders the error instruction based on the response from the Node server
    if (this.state.formResult.response) {
      if (this.state.formResult.response.response.status === 400) {
        resultContent = 'The input dates have invalid format or value, please check again.';
      } else {
        resultContent = 'Internal server error. Please check your credentials or try again later.';
      }

      return (
        <p className="display-result-text">
          {resultContent}
        </p>
      );
    }

    const itemRows = modelRefileErrorResponse(this.state.refileErrorResults);

    resultContent = (itemRows.length) ? (
      <table className="result-table">
        <caption className="hidden">Refile Error Details</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Barcodes</th>
            <th scope="col">Created Date</th>
            <th scope="col">Updated Date</th>
            <th scope="col">AF</th>
            <th scope="col">NYPL Item?</th>
          </tr>
        </thead>
        <tbody className="result-table-body">
          {itemRows}
        </tbody>
      </table>
    ) :
      <p className="display-result-text">
        There is no refile errors in the range of the selected dates.
      </p>;

    return resultContent;
  }

  /**
  * @desc Renders the links to navigate through the pages of the results
  * Based on the current page, if it is the first page, then there will not be the previous link.
  * If it is the last page, then there will not be the next link.
  */
  renderPaginationLink(type) {
    const offsetInt = parseInt(this.state.formFields.offset, 10);
    const resultLimit = this.state.formFields.resultLimit;

    if (this.state.refileErrorResults && this.state.refileErrorResults.length) {
      if (type === 'pre') {
        if (offsetInt <= 0) {
          return;
        }
        return (
          <a
            className="previous-link pointer"
            onClick={() => this.hitPageLink('pre')}
            onKeyDown={() => this.hitPageLink('pre')}
            role="link"
            tabIndex="0"
          >
            Previous
          </a>
        );
      }

      if (parseInt(this.state.refileErrorResultsTotal, 10) <= offsetInt + resultLimit) {
        return;
      }
      return (
        <a
          className="next-link pointer"
          onClick={() => this.hitPageLink('next')}
          onKeyDown={() => this.hitPageLink('next')}
          role="link"
          tabIndex="0"
        >
          Next
        </a>
      );
    }
    return;
  }

  render() {
    const totalResultCount = this.state.refileErrorResultsTotal;
    const itemStart = parseInt(this.state.formFields.offset, 10) + 1;
    const itemEnd = ((itemStart + 24) >= totalResultCount) ? totalResultCount : itemStart + 24;
    const currentPage = this.state.pageOfRefileErrorResults;
    const totalPageNumber = Math.ceil((parseInt(totalResultCount, 10) / 25));
    const displayFields = this.state.displayFields;
    const displayingText = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      <p className="display-result-text">
        Displaying {itemStart}-{itemEnd} of {totalResultCount} errors from {displayFields.startDate}-{displayFields.endDate}
      </p> : null;
    const pageText = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      <span className="page-count">Page {currentPage} of {totalPageNumber}</span> : null;

    return (
      <div className={this.props.className} id={this.props.id}>
        <h3>Refile Errors</h3>
        <p>Enter dates below to see errors for a specific date range</p>
        {this.renderRefileErrorsFrom()}
        <div>
          {displayingText}
          {this.renderRefileErrorResults()}
        </div>
        <nav className="nypl-results-pagination">
          {this.renderPaginationLink('pre')}
          {pageText}
          {this.renderPaginationLink('next')}
        </nav>
      </div>
    );
  }
}

RefileErrorsForm.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isFormProcessing: PropTypes.bool,
  setApplicationLoadingState: PropTypes.func,
};

RefileErrorsForm.defaultProps = {
  className: '',
  id: '',
  isFormProcessing: false,
  setApplicationLoadingState: () => {},
};

export default RefileErrorsForm;
