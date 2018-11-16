import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import defaultPipeline from './defaultPipeline';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { loadAllPipelines } from './actions/pipelineActions';
import { connect } from 'react-redux';

class AllPipelines extends Component {
    constructor(props) {
        super(props);
        this.props.loadAllPipelines(this.props.currentUsername);
    }

    getAvatarText(text) {
        return text.substring(0).toUpperCase();
    }

    render() {
        if (this.props.isLoading === true)
            return '';
        
        let pipelines;
        if ( this.props.pipelines.length > 0) {
            pipelines = this.props.pipelines.map((pipeline, i) => {
                const dataSources = pipeline.data_sources ? <Typography>{pipeline.data_sources.length} data source{pipeline.data_sources.length > 1 ? 's' : ''}</Typography> : '';
                const models = pipeline.models ? <Typography>{pipeline.models.length} model{pipeline.models.length > 1 ? 's' : ''}</Typography> : '';
                const filters = pipeline.filters ? <Typography>{pipeline.filters.length} filters{pipeline.filters.length > 1 ? 's' : ''}</Typography> : '';
                const storage = pipeline.storage ? <Typography>{pipeline.storage.length} storage method{pipeline.storage.length > 1 ? 's' : ''}</Typography> : '';
                return(
                    <Card key={i}>
                        <CardHeader
                            avatar={
                            <Avatar>
                                P
                            </Avatar>}
                            title={pipeline.pipeline_alias}
                            subheader={`Created by ${pipeline.username}`}
                        />
                        <CardContent>
                            <Typography variant='caption'>Pipeline overview:</Typography>
                            {dataSources}
                            {models}
                            {filters}
                            {storage}
                        </CardContent>
                        <CardActions>
                        <Button variant='contained' color='secondary'>Delete</Button>
                            <Button variant='contained' color='primary'>Edit</Button>
                        </CardActions>
                    </Card>
                );
            })
        }
        else {
            pipelines = (
                <Typography style={{textAlign: 'center'}}>No pipelines yet! Click <Link to='/pipelines/new'>here</Link> to add one.</Typography>
            );
        }

         return (
             <div>
                 <Typography style={{textAlign: 'center', marginTop: '15px'}} variant='h6'>View All Pipelines</Typography>
                 {pipelines}
             </div>
         )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pipelines: state.pipelines,
        isLoading: state.isLoading,
        currentUsername: state.currentUser.username
    }
}

const mapDispatchToProps = {
    loadAllPipelines
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllPipelines);
