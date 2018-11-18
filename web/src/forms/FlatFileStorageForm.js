import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { updateModule, updateOutput } from '../actions/pipelineActions';
import { connect } from 'react-redux';

class FlatFileStorageForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        this.props.updateModule('storage', this.props.index, attribute, value);
        if (attribute === 'alias') {
            this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, value);
        }
    }
    
    render() {
        const inputStyle = {
            padding: '10px',
            marginBottom: '20px'
        };
        return (
            <FormControl>
                <TextField onChange={this.handleChange} style={inputStyle} value={this.props.alias} name='alias' label='Module name' />
                <TextField onChange={this.handleChange} style={inputStyle} value={this.props.filename} name='filename' label='Filename' />
            </FormControl>
        )
    }
}

const mapStateToProps = state => {
    const moduleType = state.currentModule.category, index = state.currentModule.index;
    const currentModule = state.currentPipeline[moduleType][index];

    return {
        alias: currentModule.alias,
        filename: currentModule.filename,
        index,
        parentCategory: state.currentModule.parentCategory,
        parentIndex: state.currentModule.parentIndex,
        parentOutputIndex: state.currentModule.parentOutputIndex,
    };
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
)(FlatFileStorageForm);
