import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import Loader from '../../components/Loader/Loader';

class ApplicationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isFormProcessing: false };
    this.setApplicationLoadingState = this.setApplicationLoadingState.bind(this);
  }

  setApplicationLoadingState(isProcessing) {
    this.setState({ isFormProcessing: isProcessing });
  }

  render() {
    return (
      <div>
        <div className="nypl-full-width-wrapper">
          <div className="app-container nypl-row">
            <SidebarNavigation className="nypl-column-one-quarter" />
            <main className="nypl-column-three-quarters">
              {renderRoutes(
                this.props.route.routes,
                {
                  setApplicationLoadingState: this.setApplicationLoadingState,
                  isFormProcessing: this.state.isFormProcessing
                }
              )}
            </main>
          </div>
        </div>
        <Loader status={this.state.isFormProcessing} title="Processing data" />
      </div>
    );
  }
}

export default ApplicationContainer;
