import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, FormControl, Button } from '@material-ui/core';
import { updateOutput, saveModule } from '../actions/pipelineActions';

class APIModelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                alias: this.props.alias,
                input_attribute: this.props.input_attribute,
                output_attribute: this.props.output_attribute,
                http_method: this.props.http_method,
                endpoint: this.props.endpoint,
                image_location_attr: this.props.image_location_attr,
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
        moduleData.type = 'APIModel';
        moduleData.outputs = this.props.outputs;
        const alias = this.state.data.alias;
        this.props.saveModule('models', this.props.index, moduleData);
        this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, alias);
    }

    componentDidUpdate(prevProps) {
        const data = Object.assign({}, this.state.data);
        let updated = false;
        for (let key of Object.keys(this.props)) {
            if (prevProps[key] !== this.props[key]) {
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
                <TextField name='input_attribute' value={this.state.data.input_attribute} onChange={this.handleChange} label='Input attribute' />
                <TextField name='output_attribute' value={this.state.data.output_attribute} onChange={this.handleChange} label='Output attribute' />
                <TextField name='http_method' value={this.state.data.http_method} onChange={this.handleChange} label='HTTP Method' />
                <TextField name='endpoint' value={this.state.data.endpoint} onChange={this.handleChange} label='API Endpoint' />
                <TextField name='preprocessor_filename' value={this.state.data.preprocessor_filename} onChange={this.handleChange} label='Preprocessor Filename' />
                <TextField name='preprocessor_classname' value={this.state.data.preprocessor_classname} onChange={this.handleChange} label='Preprocessor Class Name' />
                <TextField name='preprocessor_method_name' value={this.state.data.preprocessor_method_name} onChange={this.handleChange} label='Preprocessor Method Name' />
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
        updateOutput: (category, index, outputIndex, outputAlias) => dispatch(updateOutput(category, index, outputIndex, outputAlias)),
        saveModule: (category, index, moduleData) => dispatch(saveModule(category, index, moduleData)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(APIModelForm);