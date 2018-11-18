import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import { updateModule } from '../actions/pipelineActions';

class FilterForm extends Component {
    state = {
        alias: '',
        condition: '',
        attribute: '',
        value: '',
    };

    handleChange = event => {
        // this.setState({...this.state, [event.target.name]: event.target.value});
        this.props.updateModule('filters', this.props.index, event.target.name, event.target.value);
    }

    render() {
        return (
            <FormControl>
                <Typography>Filter module</Typography>
                <TextField value={this.props.attrs.alias} name='alias' onChange={this.handleChange} label='Alias' />
                <TextField value={this.props.attrs.attribute} name='attribute' onChange={this.handleChange} label='Attribute' />
                <Select onChange={this.handleChange} label='Filter type' name='condition' value={this.props.attrs.condition}>
                    <MenuItem value={'>'}>Greater than</MenuItem>
                    <MenuItem value={'<'}>Less than</MenuItem>
                    <MenuItem value={'=='}>Equals</MenuItem>
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
        index
    }
}
const mapDispatch = dispatch => {
    return {
        updateModule: (category, index, attribute, value) => dispatch(updateModule(category, index, attribute, value))
    }
}
export default connect(
    mapStateToProps,
    mapDispatch
)(FilterForm);
