import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, FormControl, Button } from '@material-ui/core';
import { updateModule, updateOutput, saveModule } from '../actions/pipelineActions';

class CustomEntityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                alias: this.props.alias,
                input_attribute: this.props.input_attribute,
                output_attribute: this.props.output_attribute,
                classname: this.props.classname,
                filename: this.props.filename,
                function: this.props.function,
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
        moduleData.type = 'CustomEntity';
        moduleData.outputs = this.props.outputs;
        const alias = this.state.data.alias;
        this.props.saveModule('custom_entities', this.props.index, moduleData);
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
                <TextField name='filename' value={this.state.data.filename} onChange={this.handleChange} label='Filename' />
                <TextField name='classname' value={this.state.data.classname} onChange={this.handleChange} label='Class name' />
                <TextField name='function' value={this.state.data.function} onChange={this.handleChange} label='Function name' />
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
)(CustomEntityForm);