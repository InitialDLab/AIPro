import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import API from './API';

class TwitterAccountForm extends Component {
    state = {
        api_key: '',
        api_secret: '',
        access_token: '',
        access_token_secret: '',
        account_type: 'Twitter streaming',
        username: 'rsfrost' // TODO: Make this real
    };

    api = new API();

    handleFormSubmit = async () => {
        await this.api.post('/account/twitter', this.state);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    async componentDidMount() {
        console.log('Entering event');
        const account_type = 'Twitter streaming';
        const username = this.state.username;
        const url = encodeURI(`/account/${account_type}/${username}`);
        const account_info = await this.api.get(url);
        console.log(account_info);
        const tempState = this.state;
        Object.assign(tempState, account_info);
        this.setState(tempState);
    }

    render() {
        return (
            <form>
                <FormControl style={{width: 300}}>
                    <Typography variant='h6'>Twitter Account Credentials</Typography>
                    <TextField value={this.state['api_key']} style={{paddingBottom: 10}} onChange={this.handleChange} name='api_key' required label='API Key' />
                    <TextField value={this.state['api_secret']} style={{paddingBottom: 10}} onChange={this.handleChange} name='api_secret' required label='API Secret' />
                    <TextField value={this.state['access_token']} style={{paddingBottom: 10}} onChange={this.handleChange} name='access_token' required label='Access Token' />
                    <TextField value={this.state['access_token_secret']} style={{paddingBottom: 10}} onChange={this.handleChange} name='access_token_secret' required label='Access Token Secret' />
                    <Button onClick={this.handleFormSubmit} variant='contained' color='primary' >Save</Button>
                </FormControl>
            </form>
        );
    }
}

export default TwitterAccountForm;