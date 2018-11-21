import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { amber, blue, green, 
    grey, purple, indigo, 
    blueGrey, brown, cyan, 
    lime, orange, pink, 
    red, yellow, deepOrange } from '@material-ui/core/colors/';
import { deletePipeline, receiveSinglePipeline } from './actions/pipelineActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const styles = theme => ({
    pipeline: {
        ...theme.mixins.gutters(),
        width: '250px',
        display: 'inline-block',
        margin: theme.spacing.unit * 2
    },
    actions: {
        display: 'flex'
    }
});

class PipelineCard extends Component {
    state = {
        running: false,
        toEditPage: false,
    }

    getAvatarText(text) {
        const words = text.split(' ');
        let letters = '';
        for (let i = 0; i < Math.min(2, words.length); i++) {
            let firstLetter = words[i][0].toUpperCase();
            letters += firstLetter;
        }

        return letters;
    }

    handleDelete = pipeline_alias => {
        this.props.deletePipeline(this.props.currentUsername, pipeline_alias);
    }

    handleEdit = pipeline => {
        this.props.receiveSinglePipeline(pipeline);
        this.setState({...this.state, toEditPage: true});
    }

    render() {
        if (this.state.toEditPage) {
            return <Redirect to='/pipeline/edit' />;
        }

        if (this.props.isLoading) {
            return '';
        }
        
        const { pipeline } = this.props;
        const dataSources = pipeline.data_sources ? <Typography>{pipeline.data_sources.length} data source{pipeline.data_sources.length > 1 ? 's' : ''}</Typography> : '';
        const models = pipeline.models ? <Typography>{pipeline.models.length} model{pipeline.models.length > 1 ? 's' : ''}</Typography> : '';
        const filters = pipeline.filters ? <Typography>{pipeline.filters.length} filter{pipeline.filters.length > 1 ? 's' : ''}</Typography> : '';
        const storage = pipeline.storage ? <Typography>{pipeline.storage.length} storage method{pipeline.storage.length > 1 ? 's' : ''}</Typography> : '';

        const colors = [amber, blue, green, grey, purple, indigo, blueGrey, brown, cyan, lime, orange, pink, red, yellow, deepOrange];
        const colorIndex = this.props.index % colors.length;
        const { classes } = this.props;

        return (
            <Card className={classes.pipeline}>
                <CardHeader
                    avatar={
                    <Avatar style={{backgroundColor: colors[colorIndex][400]}}>
                        {this.getAvatarText(pipeline.pipeline_alias)}
                    </Avatar>}
                    title={pipeline.pipeline_alias}
                    subheader={`Status: ${this.state.running ? 'Running' : 'Stopped'}`}
                />
                <CardContent>
                    <Typography variant='caption'>Pipeline overview:</Typography>
                    {dataSources}
                    {models}
                    {filters}
                    {storage}
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button onClick={() => this.handleDelete(pipeline.pipeline_alias)} >Delete</Button>
                    <Button onClick={() => this.handleEdit(pipeline)} >Edit</Button>
                    <Button onClick={() => this.setState({...this.state, running: !this.state.running})} label={this.state.running ? 'Stop' : 'Run'}>{this.state.running ? 'Stop' : 'Run'}</Button>
                </CardActions>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.isLoading,
        currentUsername: state.currentUser.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deletePipeline: (username, pipeline_alias) => dispatch(deletePipeline(username, pipeline_alias)),
        receiveSinglePipeline: pipeline => dispatch(receiveSinglePipeline(pipeline)),
    }
}

export default withStyles(styles)(
connect(
    mapStateToProps,
    mapDispatchToProps) 
(PipelineCard));
