import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { loadAllPipelines } from './actions/pipelineActions';
import { connect } from 'react-redux';
import PipelineCard from './PipelineCard';

class ManagePipelines extends Component {
    constructor(props) {
        super(props);
        this.props.loadAllPipelines(this.props.currentUsername);
    }

    render() {
        
        if (this.props.isLoading === true)
            return '';

        let pipelines;
        if ( this.props.pipelines.length > 0) {
            pipelines = this.props.pipelines.map((pipeline, i) => {
                return(
                    <PipelineCard 
                        pipeline={pipeline}
                        key={i} 
                        index={i} />    
                );
            })
        }
        else {
            pipelines = (
                <Typography style={{textAlign: 'center'}}>No pipelines yet! Click <Link to='/pipeline/new/batch'>here</Link> to add one.</Typography>
            );
        }

         return (
             <div>
                 <Typography style={{textAlign: 'center', marginTop: '15px'}} variant='h6'>Manage Pipelines</Typography>
                 {pipelines}
             </div>
         )
    }
}

const mapStateToProps = state => {
    return {
        pipelines: state.pipelines,
        isLoading: state.isLoading,
        currentUsername: state.currentUser.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadAllPipelines: username => dispatch(loadAllPipelines(username)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManagePipelines);
