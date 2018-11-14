import React, { Component } from 'react';
import API from './API';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import defaultPipeline from './defaultPipeline';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

class AllPipelines extends Component {
    state = {
        loading: false,
        pipelines: []
    };

    api = new API();

    async componentDidMount() {
        console.log('API');
        const pipelines = await this.api.get(`/pipelines/${this.props.username}`);
        if (pipelines.length > 0) {
            console.log(pipelines);
            this.setState({...this.state, pipelines: pipelines});
        }
        else {
            console.log(`No pipelines for ${this.props.username}. Adding default now...`);
            await this.api.post('/pipeline', defaultPipeline);
            const pipelines = await this.api.get(`/pipelines/${this.props.username}`);
            this.setState({...this.state, pipelines: pipelines});
        }
    }

    getAvatarText(text) {
        return text.substring(0).toUpperCase();
    }

    render() {
        let pipelines = '';
        if (this.state.pipelines.length > 0) {
            pipelines = this.state.pipelines.map((pipeline, i) => {
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

export default AllPipelines;
