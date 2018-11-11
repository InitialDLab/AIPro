import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class PipelineSidebar extends Component {
    render() {
        return (
            <div style={{width: '250px', height: '100vh', position: 'absolute'}}>
                <FormControl>
                    <Typography variant='h6'>{this.props.type}</Typography>
                    <TextField label='Some text' />
                    <Button variant='contained' color='primary'>Save</Button>
                </FormControl>
            </div>
        )
    }
}

export default PipelineSidebar;