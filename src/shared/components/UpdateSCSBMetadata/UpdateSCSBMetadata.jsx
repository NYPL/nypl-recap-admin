import React from 'react';
import PropTypes from 'prop-types';
import UpdateMetadataTabs from '../UpdateMetadataTabs/UpdateMetadataTabs';
import UpdateItemXMLForm from '../../containers/UpdateItemXMLForm/UpdateItemXMLForm';

class UpdateSCSBMetadata extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.id} style={{border: '1px dashed black'}}>
        <UpdateMetadataTabs />
        <UpdateItemXMLForm />
      </div>  
    );
  }
}

UpdateSCSBMetadata.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

UpdateSCSBMetadata.defaultProps = {
  className: 'update-scsb-metadata',
};

export default UpdateSCSBMetadata;


