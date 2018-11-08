import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import API from './API';

class TwitterStreamForm extends Component {
    state = {
        alias: '',
        data_source_type: 'Twitter streaming',
        account_credentials: {},
        filters: [],
        projection: []
    };

    api = new API();

    handleFormSubmit = async () => {
        await this.api.post('/account/twitter', this.state);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    async onComponentDidMount() {
        const account_alias = 'Richie\'s Twitter account';
        const account_info = await this.api.get('/account/twitter/%s' % account_alias);
        let tempState = this.state;
        tempState = Object.assign(tempState, account_info);
        this.setState(tempState);
    }

    render() {
        // Required:
        // Alias
        // API key
        // API secret
        // Access token
        // Access token secret

        // Advanced/Optional:
        // Projection
        return (
            <form>
                <FormControl style={{width: 300}}>
                    <Typography variant='h6'>Twitter Streaming Info</Typography>
                    <TextField style={{paddingBottom: 10}} onChange={this.handleChange} name='alias' required label='Alias' helperText='What would you like to call this?' />
                    <Button onClick={this.handleFormSubmit} variant='contained' color='primary' >Save</Button>
                </FormControl>
            </form>
        );
    }
}

class FlatFileForm extends Component {
    state = {
        alias: '',
        filename: ''
    };

    handleFormSubmit() {

    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    render() {
        // Required:
        // Alias
        // File upload
        return(
            <form>
                <TextField onChange={this.handleChange} name='alias' required label='Alias' helperText='What do you want to call this?' />
                <Input type='file' name='file' />
            </form>
        );
    }
}

class DataSourceForm extends Component {
    types = ['Twitter streaming', 'Flat file'];


    render() {
        return (
            <TwitterStreamForm />
        );
    }
}

export default DataSourceForm;