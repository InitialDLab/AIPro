import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, FormControl, Button } from '@material-ui/core';
import { updateModule, updateOutput, saveModule } from '../actions/pipelineActions';

class CustomModelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                alias: this.props.alias,
                model_path: '',
                module_file_path: this.props.module_file_path,
                module_classname: this.props.module_classname,
                method_name: this.props.method_name,
                input_attribute: this.props.input_attribute,
                output_attribute: this.props.output_attribute,
                preprocessor_filename: this.props.preprocessor_filename,
                preprocessor_method_name: this.props.preprocessor_method_name,
                preprocessor_classname: this.props.preprocessor_classname,
            }
        }
    }
    
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        const data = Object.assign({}, this.state.data);
        data[attribute] = value;
        this.setState({...this.state, data});
    }

    handleSave = () => {
        const moduleData = this.state.data;
        moduleData.type = 'CustomModel';
        moduleData.outputs = this.props.outputs;
        const alias = this.state.data.alias;
        this.props.saveModule('models', this.props.index, moduleData);
        this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, alias);
    }

    componentDidUpdate(prevProps) {
        const data = Object.assign({}, this.state.data);
        let updated = false;
        for (let key of Object.keys(this.props)) {
            if (prevProps[key] != this.props[key]) {
                data[key] = this.props[key];
                updated = true;
            }
        }
        if (updated) {
            this.setState({...this.state, data});
        }
    }
    
    render() {
        return (
            <FormControl>
                <TextField name='alias' value={this.state.data.alias} onChange={this.handleChange} label='Module name' />
                <TextField name='model_path' value={this.state.data.model_path} onChange={this.handleChange} label='Model path' />
                <TextField name='module_file_path' value={this.state.data.module_file_path} onChange={this.handleChange} label='Module file path' />
                <TextField name='module_classname' value={this.state.data.module_classname} onChange={this.handleChange} label='Module class name' />
                <TextField name='method_name' value={this.state.data.method_name} onChange={this.handleChange} label='Method name' />
                <TextField name='input_attribute' value={this.state.data.input_attribute} onChange={this.handleChange} label='Input attribute' />
                <TextField name='output_attribute' value={this.state.data.output_attribute} onChange={this.handleChange} label='Output attribute' />
                <TextField name='preprocessor_filename' value={this.state.data.preprocessor_filename} onChange={this.handleChange} label='Preprocessor filename' />
                <TextField name='preprocessor_method_name' value={this.state.data.preprocessor_method_name} onChange={this.handleChange} label='Preprocessor method name' />
                <TextField name='preprocessor_classname' value={this.state.data.preprocessor_classname} onChange={this.handleChange} label='Preprocessor class name' />
                <Button onClick={this.handleSave} variant='contained' color='primary'>Save</Button>
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
        saveModule: (category, index, moduleData) => dispatch(saveModule(category, index, moduleData)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomModelForm);