import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import { updateModule, updateOutput } from '../actions/pipelineActions';

class FilterForm extends Component {
    state = {
        alias: '',
        condition: '',
        attribute: '',
        value: '',
    };

    handleChange = event => {
        if (event.target.name === 'alias') {
            this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, event.target.value);
        }
        this.props.updateModule('filters', this.props.index, event.target.name, event.target.value);
    }

    render() {
        return (
            <FormControl>
                <Typography>Filter module</Typography>
                <TextField value={this.props.attrs.alias} name='alias' onChange={this.handleChange} label='Alias' />
                <TextField value={this.props.attrs.attribute} name='attribute' onChange={this.handleChange} label='Attribute' />
                <Select onChange={this.handleChange} label='Filter type' name='condition' value={this.props.attrs.condition}>
                    <MenuItem value={'gt'}>Greater than</MenuItem>
                    <MenuItem value={'lt'}>Less than</MenuItem>
                    <MenuItem value={'eq'}>Equals</MenuItem>
                    <MenuItem value={'neq'}>Not Equal to</MenuItem>
                </Select>
                <TextField value={this.props.attrs.value} name='value' onChange={this.handleChange} label='Value' />
                <Button variant='contained' color='primary' onClick={this.props.save}>Save</Button>
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
        updateModule: (category, index, attribute, value) => dispatch(updateModule(category, index, attribute, value)),
        updateOutput: (category, index, outputIndex, outputAlias) => dispatch(updateOutput(category, index, outputIndex, outputAlias)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatch
)(FilterForm);
