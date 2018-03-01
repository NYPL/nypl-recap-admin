import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { refileErrorsAction } from '../../actions/refileActions';

class Refile extends Component {
  componentDidMount() {

  }

  render() {
    console.log(this.props);
    return (
      <div>Hello World</div>
    );
  }
}

export default connect(stateToProps)(Refile);
