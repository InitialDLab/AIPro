import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { login } from './actions/utilActions';
import { Link, Redirect } from 'react-router-dom';

class LoginPage extends Component {
    state = {
        username: '',
        password: ''
    }

    setValue = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        if (this.props.loggedIn === true) {
            return <Redirect to='/' />
        };
        
        return (
            <div style={{margin: 'auto', width: '200px'}}>
                <FormControl style={{marginTop: '100px'}}>
                    <Typography variant='h6'>Login</Typography>
                    <TextField label='Username' name='username' onChange={this.setValue} />
                    <TextField type='password' label='Password' onChange={this.setValue} name='password' />
                    <Divider />
                    <Typography style={{marginTop: '15px'}} variant='caption'>Don't have an account yet? Sign up <Link to='/signup'>here</Link></Typography>
                    <Button style={{marginTop: '15px'}} onClick={() => this.props.login(this.state.username, this.state.password)} color='primary' variant='contained'>Login</Button>
                </FormControl>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loggedIn: state.loggedIn
    };
}

const mapDispatchToProps = {
    login
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);
