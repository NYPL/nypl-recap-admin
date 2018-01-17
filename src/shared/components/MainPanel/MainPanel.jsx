import React from 'react';
import PropTypes from 'prop-types';
import Dashboard from '../../Dashboard/Dashboard';

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main className={this.props.className} id={this.props.id} style={{border: '1px dashed black'}}>
        <Dashboard />  
      </main>  
    );
  }
}

MainPanel.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

MainPanel.defaultProps = {
  className: 'main-panel',
};

export default MainPanel;

