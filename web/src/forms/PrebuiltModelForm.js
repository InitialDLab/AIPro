import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateModule, updateOutput } from '../actions/pipelineActions';

class PrebuiltModelForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        this.props.updateModule('models', this.props.index, attribute, value);
        if (attribute === 'alias') {
            this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, value);
        }
    }
    
    render() {
        return (
            <div>
                <TextField name='alias' value={this.props.alias} onChange={this.handleChange} />
                <TextField name='subtype' value={this.props.subtype} onChange={this.handleChange} />
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
        updateOutput: (parentCategory, parentIndex, parentOutputIndex, outputAlias) => dispatch(updateOutput(parentCategory, parentIndex, parentOutputIndex, outputAlias)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatch
)(PrebuiltModelForm);
