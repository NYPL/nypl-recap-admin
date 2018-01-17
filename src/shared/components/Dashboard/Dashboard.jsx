import React from 'react';
import PropTypes from 'prop-types';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="backButtonBox">
          <button onClick={() => { window.history.back(); }}>&lt;&lt; Go Back</button>
        </div>
        <div>
          <h2>Tabs go here</h2>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

Dashboard.defaultProps = {
  className: 'dashboard',
};

export default Dashboard;
