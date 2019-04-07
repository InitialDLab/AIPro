import React, { Component } from 'react';
import { TextField, FormControl } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateModule } from '../actions/pipelineActions';

class StreamingImagesAPIForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        this.props.updateModule('data_sources', this.props.index, attribute, value);
    }
    
    render() {
        return (
            <FormControl>
                <TextField name='alias' value={this.props.alias} onChange={this.handleChange} label='Alias'/>
                <TextField name='url' value={this.props.url} onChange={this.handleChange} label='Request endpoint' />
            </FormControl>
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
)(StreamingImagesAPIForm);
