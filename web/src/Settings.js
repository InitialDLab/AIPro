import React, { Component } from 'react';
import TwitterForm from './AccountForms';
import Typography from '@material-ui/core/Typography';

class Settings extends Component {
    render() {
        return (
            <div>
                <Typography style={{textAlign: 'center', marginTop: '15px'}} variant='h6'>Settings</Typography>
                <TwitterForm username={this.props.currentUser} />
            </div>
        );
    }
}

export default Settings;