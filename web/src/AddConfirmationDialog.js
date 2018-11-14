import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';

class AddConfirmationDialog extends React.Component {
  render() {
    const buttonStyles = {
        marginTop: '15px',
        marginRight: '15px',
        padding: '10px'
    };

    return (
        <Dialog
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Add new output?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Which type of output would you like to add to {this.props.nodeName}?
            </DialogContentText>
            <TextField style={{display: 'block', marginBottom: '15px'}} label='Alias' helperText='What would you like to call this output?' />
            <DialogContentText>
                (You can add more details later)
            </DialogContentText>
            <Button style={buttonStyles} color='secondary' variant='contained'><Icon style={{padding: '5px'}}>code</Icon>Custom Model</Button>
            <Button style={buttonStyles} color='secondary' variant='contained'><Icon style={{padding: '5px'}}>memory</Icon>Prebuilt Model</Button>
            <Button style={buttonStyles} color='secondary' variant='contained'><Icon style={{padding: '5px'}}>filter_list</Icon>Filter</Button>
            <Button style={buttonStyles} color='secondary' variant='contained'><Icon style={{padding: '5px'}}>folder_open</Icon>File storage</Button>
            <Button style={buttonStyles} color='secondary' variant='contained'><Icon style={{padding: '5px'}}>storage</Icon>Database storage</Button>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
                Cancel
            </Button>
            </DialogActions>
        </Dialog>
    );
  }
}

export default AddConfirmationDialog;