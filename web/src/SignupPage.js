import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { signup } from './actions/utilActions';
import { Link, Redirect } from 'react-router-dom';

class SignupPage extends Component {
    state = {
        username: '',
        password: '',
        email: ''
    }

    handleChange = event => {
        this.setState({...this.state, [event.target.name]: event.target.value});
    }
    
    render() {
        if (this.props.loggedIn === true) {
            return <Redirect to='/' />
        };

        return (
            <div style={{margin: 'auto', width: '200px'}}>
                <FormControl style={{marginTop: '100px'}}>
                    <Typography variant='h6'>Sign up</Typography>
                    <TextField label='Username' name='username' onChange={this.handleChange} />
                    <TextField type='password' label='Password' name='password' onChange={this.handleChange} />
                    <TextField label='Email' name='email' onChange={this.handleChange} />
                    <Divider />
                    <Typography style={{marginTop: '15px'}} variant='caption'>Already have an account? <Link to='/login'>sign in</Link> here</Typography>
                    <Button style={{marginTop: '15px'}} variant='contained' color='primary' onClick={() => this.props.signup(this.state.username, this.state.password, this.state.email)}>Sign up</Button>
                </FormControl>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loggedIn: state.loggedIn
    };
};

const mapDispatchToProps = {
    signup
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupPage);