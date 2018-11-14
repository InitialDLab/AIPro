import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import API from './API';

class FlatFileStorageForm extends Component {
    constructor(props) {
        super(props);
        this.updateFile = this.updateFile.bind(this);
    }
    
    state = {
        alias: this.props.alias,
        filename: this.props.filename,
        filetype: this.props.filetype ? this.props.filetype : 'json'
    };

    api = new API();

    updateValue = event => {
        console.log(event.target.value);
        this.setState({...this.state, [event.target.name]: event.target.value});
    }

    async updateFile(event) {
        console.log(event.target.files);
        const files = event.target.files;
        const file = files[0];
        let formData = new FormData();
        console.log(file);
        formData.append('file', file);
        formData.append('filename', file.name);
        
        await this.api.post('/upload', formData);
    }

    handleSave = () => {
        this.props.handleSave('storage', this.state.alias, this.state);
    }
    
    render() {
        const inputStyle = {
            padding: '10px',
            marginBottom: '20px'
        };
        return (
            <FormControl>
                <TextField onChange={this.updateValue} style={inputStyle} value={this.props.alias} name='alias' label='Alias' />
                <Input name='filename' onChange={this.updateFile} type='file' />
                <Select onChange={this.updateValue} name='filetype' style={inputStyle} label='File type' value={this.state.filetype}>
                    <MenuItem value={'csv'}>CSV</MenuItem>
                    <MenuItem value={'json'}>JSON</MenuItem>
                </Select>
                <Button variant='contained' color='primary' onClick={this.handleSave}>Save</Button>
            </FormControl>
        )
    }
}

export default FlatFileStorageForm;
