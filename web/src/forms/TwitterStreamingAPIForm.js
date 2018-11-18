import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateModule } from '../actions/pipelineActions';

class TwitterStreamingAPIForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        this.props.updateModule('data_sources', this.props.index, attribute, value);
    }
    
    render() {
        return (
            <div>
                <TextField name='alias' value={this.props.alias} onChange={this.handleChange} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return Object.assign({}, state.currentModule);
}

const mapDispatch = dispatch => {
    return {
        updateModule: (type, index, attribute, value) => dispatch(updateModule(type, index, attribute, value)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatch
)(TwitterStreamingAPIForm);
