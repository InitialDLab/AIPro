import React, { Component } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateModule, updateOutput } from '../actions/pipelineActions';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
    },
    select: {
        paddingTop: theme.spacing.unit * 2,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
  });

class PrebuiltModelForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        // TODO: Get the model config based on the selection chosen
        console.log('Attribute', attribute);
        console.log('Value', value);
        //this.props.updateModule('models', this.props.index, attribute, value);
        if (attribute === 'alias') {
            this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, value);
        }
    }
    
    render() {
        const { classes } = this.props;

        return (
            <FormControl className={classes.formControl}>
                <TextField label='Alias' name='alias' value={this.props.alias} onChange={this.handleChange} />
                <InputLabel htmlFor='model-selector'>Prebuilt model</InputLabel>
                <Select 
                    inputProps={{
                        name: 'subtype',
                        id: 'model-selector',
                    }}
                    value={this.props.subtype} onChange={this.handleChange} 
                >
                    <MenuItem className={classes.selectEmpty} value=''>Select one</MenuItem>
                    <MenuItem value='VGG'>VGG</MenuItem>
                    <MenuItem value='SqueezeNet'>SqueezeNet</MenuItem>
                    <MenuItem value='MobileNet'>MobileNet</MenuItem>
                    <MenuItem value='ResNet'>ResNet</MenuItem>
                </Select>
            </FormControl>
        )
    }
}

const mapStateToProps = state => {
    return Object.assign({}, state.currentModule);
}

const mapDispatch = dispatch => {
    return {
        updateModule: (type, index, attribute, value) => dispatch(updateModule(type, index, attribute, value)),
        updateOutput: (parentCategory, parentIndex, parentOutputIndex, outputAlias) => dispatch(updateOutput(parentCategory, parentIndex, parentOutputIndex, outputAlias)),
    }
}
export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatch
)(PrebuiltModelForm));
