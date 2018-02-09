import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

class FormField extends Component {
  renderInstructionText(text, fieldId = '') {
    return !isEmpty(text) && (
      <span
        className="nypl-field-status"
        id={`${fieldId}-status`}
        aria-live="assertive"
        aria-atomic="true"
      >
        {text}
      </span>
    );
  }

  renderErrorBox(errorText, fieldId = '') {
    return (
      <span
        className="nypl-field-status"
        id={`${fieldId}-status`}
        aria-live="assertive"
        aria-atomic="true"
      >
        {errorText}
      </span>
    );
  }

  renderInputHelpText(text, errorText, fieldId) {
    return !isEmpty(errorText) ?
      this.renderErrorBox(errorText, fieldId) : this.renderInstructionText(text, fieldId);
  }

  renderLabel() {
    return (
      <label htmlFor={this.props.id} id={`${this.props.id}-label`}>
        {
          this.props.type === 'checkbox' ?
            <span className="visuallyHidden">{this.props.label}</span> :
            <span>{this.props.label}</span>
        }
        {
          this.props.isRequired && <span className="nypl-required-field"> Required</span>
        }
      </label>
    );
  }

  renderInputField(type) {
    if (type === 'textarea') {
      return (
        <textarea
          id={this.props.id}
          name={this.props.fieldName}
          onBlur={this.props.handleOnBlur}
          onChange={this.props.handleOnChange}
          ref={this.props.fieldRef}
          aria-required={this.props.isRequired}
          aria-labelledby={
            (this.props.instructionText || this.props.errorField)
              ? `${this.props.id}-label ${this.props.id}-status`
              : `${this.props.id}-label`
          }
        />
      );
    }

    return (
      <input
        value={this.props.value}
        type={type}
        id={this.props.id}
        name={this.props.fieldName}
        aria-required={type === 'checkbox' ? null : this.props.isRequired}
        aria-labelledby={
          (this.props.instructionText || this.props.errorField)
            ? `${this.props.id}-label ${this.props.id}-status`
            : `${this.props.id}-label`
        }
        onChange={this.props.handleOnChange}
        checked={this.props.checked}
        maxLength={this.props.maxLength || null}
        onBlur={this.props.handleOnBlur}
        ref={this.props.fieldRef}
      />
    );
  }

  render() {
    const errorClass = !isEmpty(this.props.errorField) ? 'nypl-field-error' : '';

    return (
      <div className={`${this.props.className} ${errorClass}`}>
        {this.props.type === 'checkbox' ? this.renderInputField(this.props.type) : this.renderLabel()}
        {this.props.type === 'checkbox' ? this.renderLabel() : this.renderInputField(this.props.type)}
        {this.renderInputHelpText(this.props.instructionText, this.props.errorField, this.props.id)}
      </div>
    );
  }
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  errorField: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  className: PropTypes.string,
  fieldName: PropTypes.string,
  isRequired: PropTypes.bool,
  handleOnChange: PropTypes.func,
  handleOnBlur: PropTypes.func,
  checked: PropTypes.bool,
  instructionText: PropTypes.string,
  maxLength: PropTypes.number,
  fieldRef: PropTypes.func,
};

FormField.defaultProps = {
  className: '',
  value: '',
  isRequired: false,
  //errorState: {},
};

export default FormField;
