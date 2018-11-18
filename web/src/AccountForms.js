import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import API from './API';
import { connect } from 'react-redux';
import { setCredentialAttribute } from './actions/utilActions';

class TwitterAccountForm extends Component {
    state = {
        api_key: '',
        api_secret: '',
        access_token: '',
        access_token_secret: ''
    };

    api = new API();

    handleFormSubmit = async () => {
        const requestBody = {
            account_type: 'TwitterStreamingAPI',
            username: this.props.username   
        };
        Object.assign(requestBody, this.state);
        try {
            await this.api.post('/account/twitter', requestBody);
        } catch(err) {
            console.error('Problem posting to get twitter account, gonna remove this');
        }
    }

    handleChange = event => {
        const attribute = event.target.name;
        const value = event.target.value;
        this.props.setCredentialAttribute('twitter', attribute, value);
        this.setState({...this.state, [attribute]: value });
    }

    async componentDidMount() {
        const account_type = 'Twitter streaming';
        const username = this.props.username;
        const url = encodeURI(`/account/${account_type}/${username}`);
        try{
            const account_info = await this.api.get(url);
            if (account_info.error) {
                console.error(account_info.message);
            }
            else {
                const tempState = this.state;
                Object.assign(tempState, account_info);
                this.setState(tempState);
            }
        } catch(err) {
            console.error('Error with getting Twitter account credentials, removing this');
        }
    }

    render() {
        return (
            <FormControl style={{margin: '20px'}}>
                <Typography variant='h6'>Twitter Account Credentials</Typography>
                <TextField value={this.state['api_key']} style={{paddingBottom: 10}} onChange={this.handleChange} name='api_key' required label='API Key' />
                <TextField value={this.state['api_secret']} style={{paddingBottom: 10}} onChange={this.handleChange} name='api_secret' required label='API Secret' />
                <TextField value={this.state['access_token']} style={{paddingBottom: 10}} onChange={this.handleChange} name='access_token' required label='Access Token' />
                <TextField value={this.state['access_token_secret']} style={{paddingBottom: 10}} onChange={this.handleChange} name='access_token_secret' required label='Access Token Secret' />
                <Button onClick={this.handleFormSubmit} variant='contained' color='primary' >Save</Button>
            </FormControl>
        );
    }
}

const mapDispatch = dispatch => {
    return {
        setCredentialAttribute: (credentialsType, credentialAttribute, credentialValue) => dispatch(setCredentialAttribute(credentialsType, credentialAttribute, credentialValue)),
    }
}

export default connect(
    null,
    mapDispatch
)(TwitterAccountForm );
