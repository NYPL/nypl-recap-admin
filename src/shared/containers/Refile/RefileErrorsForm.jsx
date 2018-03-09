import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { forIn, map } from 'lodash';
import FormField from '../../components/FormField/FormField';
import moment from 'moment';

class RefileErrorsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formFields: {
        startDate: moment().subtract(1, 'day').format('MM/DD/YYYY'),
        endDate: moment().format('MM/DD/YYYY'),
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
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.clickSubmit = this.clickSubmit.bind(this);
    this.hitPageButton = this.hitPageButton.bind(this);
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
      this.setState({
        fieldErrors: {
          [field]: errorString
        }
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
  * @desc Handles updating the state for the given field name based on the value changes
  * @param {object} event - contains the current event context of the input field
  */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ formFields: {...this.state.formFields, [name]: value} });
  }

  isDateValid(date) {
    if (!date) {
      return false;
    }

    const dateArray = date.split('/');
    const date_matches = date.match(/^(\d{2})\/(\d{2})\/(?:\d{4})$/);

    if (!date_matches) {
      return false;
    }

    if (dateArray[0].length !== 2 || dateArray[1].length !== 2 || dateArray[2].length !== 4) {
        return false;
      }

    // Checks if the month is valid
    if (parseInt(dateArray[0], 10) < 1 || parseInt(dateArray[0], 10) > 12) {
      return false;
    }

    // Checks if the date is valid
    if (parseInt(dateArray[1], 10) < 1 || parseInt(dateArray[1], 10) > 31) {
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
    switch (fieldName) {
      case 'startDate':
        if (!this.isDateValid(state.formFields[fieldName])) {
          this.setFieldError(fieldName, state, 'Please enter the date following the format MM/DD/YYYY');

          return fieldName;

        } else {
          this.removeFieldError(fieldName, state);
        }
        break;
      case 'endDate':
        if (!this.isDateValid(state.formFields[fieldName])) {
          this.setFieldError(fieldName, state, 'Please enter the date following the format MM/DD/YYYY');

          return fieldName;
        } else {
          this.removeFieldError(fieldName, state);
        }
        break;
      default:
        return;
        break;
    }
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
  hitPageButton(type) {
    event.preventDefault();

    const resultLimit = this.state.formFields.resultLimit;
    const pageIncrement = 1;
    const offsetInt = parseInt(this.state.formFields.offset, 10);

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
      if (offsetInt <= 0) {
        return;
      }

      setStateForPagination();
    } else {
      if (parseInt(this.state.refileErrorResultsTotal, 10) <= offsetInt + resultLimit) {
        return;
      }

      setStateForPagination();
    }
  }

  /**
  * @desc Handles sending the form field payload from the state to the proper API endpoint. All
  * fields are validated prior to executing the ajax call. Updates the form state booleans and
  * result based on successful or error responses
  * @param {object} event - contains the current event context of the field
  */
  handleFormSubmit(resetDates) {
    let fieldErrorsArray = [];

    // Iterate through patron fields and ensure all fields are valid
    forIn(this.state.formFields, (value, key) => {
      fieldErrorsArray.push(this.validateField(key, this.state, true));

    });

    if (fieldErrorsArray.length) {
      this.focusOnField(fieldErrorsArray[0]);
    }

    if (isEmpty(this.state.fieldErrors)) {
      const {
        formFields: {
          startDate,
          endDate,
          resultLimit,
        },
      } = this.state;

      const offset = resetDates ? 0 : this.state.formFields.offset;

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
          pageOfRefileErrorResults: resetDates ? 1 : this.state.pageOfRefileErrorResults,
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
        <FormField
          className="nypl-text-field"
          id="startDate"
          type="text"
          label="StartDate"
          fieldName="startDate"
          instructionText="The start date as the format as MM/DD/YYYY"
          value={this.state.formFields.startDate}
          handleOnChange={this.handleInputChange}
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
          instructionText="The end date as the format as MM/DD/YYYY"
          value={this.state.formFields.endDate}
          handleOnChange={this.handleInputChange}
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

  /**
  * @desc Renders the results of refile errors
  */
  renderRefileErrorResults() {
    let resultContent = '';

    if (this.state.formResult.response) {
      resultContent = <p>The input dates have invlaid format or value, please check again.</p>;
      return resultContent;
    }

    const itemRows = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      map(this.state.refileErrorResults, (item, i) =>
        <tr key={i}>
          <td>{item.id}</td>
          <td>{item.itemBarcode}</td>
          <td>{(item.updatedDate) ? item.createdDate.split('T')[0] : ''}</td>
          <td>{(item.updatedDate) ? item.updatedDate.split('T')[0] : ''}</td>
        </tr>
      ) : null;

    resultContent = (itemRows) ? (
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
    ) : <p>There is no refile errors in the range of the selected dates.</p>;

    return resultContent;
  }

  render() {
    const totalResultCount = this.state.refileErrorResultsTotal;
    const itemStart = parseInt(this.state.formFields.offset, 10) + 1;
    const itemEnd = ((itemStart + 24) >= totalResultCount) ? totalResultCount : itemStart + 24;
    const currentPage = this.state.pageOfRefileErrorResults;
    const totalPageNumber = Math.ceil((parseInt(totalResultCount, 10) / 25));
    const displayFields = this.state.displayFields;
    const displayingText = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      <p>Displaying {itemStart}-{itemEnd} of {totalResultCount} errors from {displayFields.startDate}-{displayFields.endDate}</p> :
      null;
    const pageText = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      <p>Page {currentPage} of {totalPageNumber}</p> : null;
    const preButton = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      <button onClick={() => this.hitPageButton('pre')}>Previous</button> : null;
    const nextButton = (this.state.refileErrorResults && this.state.refileErrorResults.length) ?
      <button onClick={() => this.hitPageButton('next')}>Next</button> : null;

    return (
      <div className={this.props.className} id={this.props.id}>
        <h3>Refile Errors</h3>
        <p>Enter dates below to see errors for a specific date range</p>
        {this.renderRefileErrorsFrom()}
        <div>
          {displayingText}
          {this.renderRefileErrorResults()}
        </div>
        {preButton}
        {pageText}
        {nextButton}
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
