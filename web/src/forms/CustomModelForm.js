import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, FormControl } from '@material-ui/core';
import { updateModule, updateOutput } from '../actions/pipelineActions';

class CustomModelForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        this.props.updateModule('models', this.props.index, attribute, value);
        if (attribute === 'alias') {
            this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, value)
        }
    }
    
    render() {
        return (
            <FormControl>
                <TextField name='alias' value={this.props.alias} onChange={this.handleChange} label='Module name' />
                <TextField name='module_file_path' value={this.props.module_file_path} onChange={this.handleChange} label='Module file path' />
                <TextField name='module_classname' value={this.props.module_classname} onChange={this.handleChange} label='Module class name' />
                <TextField name='method_name' value={this.props.method_name} onChange={this.handleChange} label='Method name' />
                <TextField name='input_attribute' value={this.props.input_attribute} onChange={this.handleChange} label='Input attribute' />
                <TextField name='output_attribute' value={this.props.output_attribute} onChange={this.handleChange} label='Output attribute' />
                <TextField name='preprocessor' value={this.props.preprocessor} onChange={this.handleChange} label='Preprocessor name' />
            </FormControl>
        );
    }
}

const mapStateToProps = state => {
    const category = state.currentModule.category;
    const index = state.currentModule.index;
    const parentIndex = state.currentModule.parentIndex;
    const parentCategory = state.currentModule.parentCategory;
    const parentOutputIndex = state.currentModule.parentOutputIndex;
    const currentModule = state.currentPipeline[category][index];

    const props = Object.assign({
        index,
        parentIndex,
        parentCategory,
        parentOutputIndex,
    }, currentModule);

    return props;
}

const mapDispatchToProps = dispatch => {
    return {
        updateModule: (category, index, attribute, value) => dispatch(updateModule(category, index, attribute, value)),
        updateOutput: (category, index, outputIndex, outputAlias) => dispatch(updateOutput(category, index, outputIndex, outputAlias)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomModelForm);