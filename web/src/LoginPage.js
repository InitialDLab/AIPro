import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

class LoginPage extends Component {
    state = {
        username: '',
        password: ''
    }

    setValue = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    doLogin = () => {
        this.props.doLogin(this.state.username, this.state.password);
    }

    render() {
        return (
            <div style={{margin: 'auto', width: '200px'}}>
                <FormControl style={{marginTop: '100px'}}>
                    <TextField label='Username' name='username' onChange={this.setValue} />
                    <TextField type='password' label='Password' onChange={this.setValue} name='password' />
                    <Divider />
                    <Button style={{marginTop: '15px'}} onClick={this.doLogin} color='primary' variant='contained'>Login</Button>
                </FormControl>
            </div>
        )
    }
}

export default LoginPage;
