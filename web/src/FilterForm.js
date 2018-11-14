import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';

class FilterForm extends Component {
    state = {
        alias: '',
        comparison: '',
        value: ''
    };

    handleChange = event => {
        this.setState({...this.state, [event.target.name]: event.target.value});
    }

    render() {
        return (
            <FormControl>
                <Typography>Filter module</Typography>
                <TextField value={this.props.alias} name='alias' onChange={this.handleChange} label='Alias' />
                <Select onChange={this.handleChange} label='Filter type' name='comparison' value={this.props.comparison}>
                    <MenuItem value={'>'}>Greater than</MenuItem>
                    <MenuItem value={'<'}>Less than</MenuItem>
                    <MenuItem value={'=='}>Equals</MenuItem>
                </Select>
                <TextField value={this.props.value} name='value' label='Value' />
                <Button variant='contained' color='primary' onClick={this.props.save}>Save</Button>
            </FormControl>
        );
    }
}

export default FilterForm;
