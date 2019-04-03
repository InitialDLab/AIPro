import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import API from './API';
import { connect } from 'react-redux';
import { setCredentialAttribute } from './actions/utilActions';

class TwitterAccountForm extends Component {
    api = new API();

    handleFormSubmit = async () => {
        const requestBody = {
            account_type: 'twitter',
            username: this.props.username
        };
        Object.assign(requestBody, this.props.credentials.twitter);
        try {
            await this.api.post(`/${this.props.username}/account/twitter`, requestBody);
        } catch(err) {
            console.error('Problem posting to get twitter account, gonna remove this');
        }
    }

    handleChange = event => {
        const attribute = event.target.name;
        const value = event.target.value;
        this.props.setCredentialAttribute('twitter', attribute, value);
    }

    render() {
        return (
            <FormControl style={{margin: '20px'}}>
                <Typography variant='h6'>Twitter Account Credentials</Typography>
                <TextField value={this.props.credentials.twitter['api_key']} style={{paddingBottom: 10}} onChange={this.handleChange} name='api_key' required label='API Key' />
                <TextField value={this.props.credentials.twitter['api_secret']} style={{paddingBottom: 10}} onChange={this.handleChange} name='api_secret' required label='API Secret' />
                <TextField value={this.props.credentials.twitter['access_token']} style={{paddingBottom: 10}} onChange={this.handleChange} name='access_token' required label='Access Token' />
                <TextField value={this.props.credentials.twitter['access_token_secret']} style={{paddingBottom: 10}} onChange={this.handleChange} name='access_token_secret' required label='Access Token Secret' />
                <Button onClick={this.handleFormSubmit} variant='contained' color='primary' >Save</Button>
            </FormControl>
        );
    }
}
const mapProps = state => {
    return Object.assign({}, state.currentUser);
}
const mapDispatch = dispatch => {
    return {
        setCredentialAttribute: (credentialsType, credentialAttribute, credentialValue) => dispatch(setCredentialAttribute(credentialsType, credentialAttribute, credentialValue)),
    }
}

export default connect(
    mapProps,
    mapDispatch
)(TwitterAccountForm );
