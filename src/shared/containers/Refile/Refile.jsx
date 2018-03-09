import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClearItemStatusForm from './ClearItemStatusForm';
import RefileErrorsForm from './RefileErrorsForm';

class Refile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.baseState = this.state;
  }

  componentWillReceiveProps(nextProps) {
    // Update the inert flag when the form is in a processing/loading state
    if (nextProps.isFormProcessing === true) {
      this.refileForms.inert = true;
    } else {
      this.refileForms.inert = false;
    }
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id} ref={(elem) => { this.refileForms = elem; }}>
        <ClearItemStatusForm
          isFormProcessing={this.props.isFormProcessing}
          setApplicationLoadingState={this.props.setApplicationLoadingState}
        />
        <RefileErrorsForm
          isFormProcessing={this.props.isFormProcessing}
          setApplicationLoadingState={this.props.setApplicationLoadingState}
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
  className: '',
  id: ''
};

export default Refile;
