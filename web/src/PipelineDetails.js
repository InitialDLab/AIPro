import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { savePipelineAlias } from './actions/pipelineActions';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 4
    }
});

class PipelineDetails extends Component {
    handleSaveAlias = event => {
        this.props.savePipelineAlias(event.target.value);
    }
    render() {
        const { classes } = this.props;
        return (
            <FormControl className={classes.root}>
                <Typography variant='h6'>
                    Pipeline Details
                </Typography>
                <TextField label='Alias (required)' value={this.props.pipeline_alias} onChange={this.handleSaveAlias} />
            </FormControl>
        )
    }
}

const mapStateToProps = state => {
    return {
        pipeline_alias: state.currentPipeline.pipeline_alias
    };
};
const mapDispatchToProps = dispatch => {
    return {
        savePipelineAlias: pipeline_alias => dispatch(savePipelineAlias(pipeline_alias))
    }
};

export default withStyles(styles)(
connect(
    mapStateToProps,
    mapDispatchToProps
)(PipelineDetails));