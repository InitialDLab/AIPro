import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import { updateModule, updateOutput, saveModule } from '../actions/pipelineActions';

class FilterForm extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            alias: this.props.attrs.alias,
            condition: this.props.attrs.condition,
            attribute: this.props.attrs.attribute,
            value: this.props.attrs.value,
        };
    }

    handleChange = event => {
        const newState = Object.assign({}, this.state);
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    handleSave = () => {
        const moduleData = Object.assign({}, this.state);
        moduleData.outputs = this.props.attrs.outputs;
        moduleData.type = 'Filter';
        this.props.saveModule('filters', this.props.index, moduleData);
        this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, this.state.alias)
    }

    componentDidUpdate(prevProps) {
        const data = Object.assign({}, this.state);
        let updated = false;
        for (let key of Object.keys(this.props.attrs)) {
            if (prevProps.attrs[key] != this.props.attrs[key]) {
                data[key] = this.props.attrs[key];
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
                <Typography>Filter module</Typography>
                <TextField value={this.state.alias} name='alias' onChange={this.handleChange} label='Alias' />
                <TextField value={this.state.attribute} name='attribute' onChange={this.handleChange} label='Attribute' />
                <Select onChange={this.handleChange} label='Filter type' name='condition' value={this.state.condition}>
                    <MenuItem value={'gt'}>Greater than</MenuItem>
                    <MenuItem value={'lt'}>Less than</MenuItem>
                    <MenuItem value={'eq'}>Equals</MenuItem>
                    <MenuItem value={'neq'}>Not Equal to</MenuItem>
                </Select>
                <TextField value={this.state.value} name='value' onChange={this.handleChange} label='Value' />
                <Button variant='contained' color='primary' onClick={this.handleSave}>Save</Button>
            </FormControl>
        );
    }
}
const mapStateToProps = state => {
    const currentModule = state.currentPipeline[state.currentModule.category][state.currentModule.index];
    const index = state.currentModule.index;
    const attrs = Object.assign({}, currentModule);

    return {
        attrs,
        index,
        parentIndex: state.currentModule.parentIndex,
        parentCategory: state.currentModule.parentCategory,
        parentOutputIndex: state.currentModule.parentOutputIndex,
    }
}
const mapDispatch = dispatch => {
    return {
        saveModule: (category, index, moduleData) => dispatch(saveModule(category, index, moduleData)),
        updateModule: (category, index, attribute, value) => dispatch(updateModule(category, index, attribute, value)),
        updateOutput: (category, index, outputIndex, outputAlias) => dispatch(updateOutput(category, index, outputIndex, outputAlias)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatch
)(FilterForm);
