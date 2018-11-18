import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DeleteConfirmationDialog extends React.Component {
  render() {
    return (
        <Dialog
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Delete this module?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete '{this.props.nodeName}?' This module's children will be deleted as well.
                This cannot be undone.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={this.props.handleDelete} color="primary" autoFocus>
                Delete
            </Button>
            </DialogActions>
        </Dialog>
    );
  }
}

export default DeleteConfirmationDialog;
