import React, { Component } from 'react';
import PipelineDetails from './PipelineDetails';
import { connect } from 'react-redux';
import ModuleDetails from './ModuleDetails';
import { Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: '100vh',
        display: 'inline-block',
        borderRight: '1px solid #eee',
    },
});

class PipelineSidebar extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} >
                <PipelineDetails />
                <Divider />
                <ModuleDetails />
            </div>
        )
    }
}

const mapStateToProps = null;
const mapDispatchToProps = null;

export default withStyles(styles)(
connect(
    mapStateToProps,
    mapDispatchToProps
)(PipelineSidebar));
