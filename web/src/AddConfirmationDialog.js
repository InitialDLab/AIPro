import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { addModule, addOutput } from './actions/pipelineActions';
import { setError } from './actions/utilActions';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    error: {
        color: theme.palette.error.light
    },
    normal: {
        color: 'inherit'
    },
    button: {
        marginTop: '15px',
        marginRight: '15px',
        padding: '10px',
    },
    icon: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.secondary.light,
        padding: '10px',
    }
})

class AddConfirmationDialog extends React.Component {
    state = {
        alias: '',
        errorMessage: '',
    }

    handleAddModule = (category, type) => {
        if (this.state.alias.length === 0){
            this.setState({...this.state, errorMessage: 'Output name cannot be empty'});
            return;
        }
        console.log('Still closing...');
        this.props.handleClose();
        const alias = this.state.alias;
        this.props.addModule(alias, category, type);
        this.props.addOutput(this.props.parentCategory, this.props.parentIndex, alias);
    }

    handleChangeAlias = event => {
        this.setState({alias: event.target.value});
    }
  
    render() {
        const { classes } = this.props;
        
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Add new output?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Which type of output would you like to add to {this.props.nodeName}?
                    </DialogContentText>
                    <TextField 
                        style={{display: 'block', marginBottom: '15px'}} 
                        name='alias' 
                        label='Output name' 
                        helperText='What would you like to call this output?'
                        onChange={this.handleChangeAlias} />
                    {this.state.errorMessage ? <Typography variant='caption' className={classes.error}>{this.state.errorMessage}<IconButton><CloseIcon onClick={() => this.setState({...this.state, errorMessage: ''})} /></IconButton></Typography> : ''}
                    <DialogContentText>
                        (You can add more details later)
                    </DialogContentText>
                    <Button className={classes.button} onClick={() => this.handleAddModule('models', 'CustomModel')}><Icon className={classes.icon}>code</Icon>Custom Model</Button>
                    <Button className={classes.button} onClick={() => this.handleAddModule('models', 'PrebuiltModel')}><Icon className={classes.icon}>memory</Icon>Prebuilt Model</Button>
                    <Button className={classes.button} onClick={() => this.handleAddModule('filters', 'Filter')}><Icon className={classes.icon}>filter_list</Icon>Filter</Button>
                    <Button className={classes.button} onClick={() => this.handleAddModule('custom_entities', 'CustomEntity')}><Icon className={classes.icon}>widgets</Icon>Custom Entity</Button>
                    <Button className={classes.button} onClick={() => this.handleAddModule('storage', 'FlatFileStorage')}><Icon className={classes.icon}>folder_open</Icon>File storage</Button>
                    <Button className={classes.button} onClick={() => this.handleAddModule('storage', 'MongoDB')}><Icon className={classes.icon}>storage</Icon>Database storage</Button>
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

const mapDispatchToProps = dispatch => {
    return {
        addModule: (alias, category, type) => dispatch(addModule(alias, category, type)),
        addOutput: (category, index, outputAlias) => dispatch(addOutput(category, index, outputAlias)),
        setError: errorMessage => dispatch(setError(errorMessage)),
    };
}

export default withStyles(styles)(
connect(
    null,
    mapDispatchToProps
)(AddConfirmationDialog));
