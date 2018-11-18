import React, { Component } from 'react';
import PipelineSidebar from './PipelineSidebar';
import { connect } from 'react-redux';
import PipelineDAG from './PipelineDAG';
import { Button } from '@material-ui/core';
import { savePipeline } from './actions/pipelineActions'

const SavePipelinePanel = (props) => {
    return (
        <div style={{display: 'inline-block', verticalAlign: 'top', marginTop: '16px'}}>
            <Button onClick={props.handleSave} variant='contained' color='primary'>Save Pipeline</Button>
        </div>
    );
};

class Pipeline extends Component {
    handleSave = () => {
        this.props.savePipeline(this.props.currentUser, this.props.pipeline);
    }

    render() {
        return (
            <div style={{width: '100%', height: '100vh'}}>
                <PipelineSidebar />
                <PipelineDAG />
                <SavePipelinePanel handleSave={this.handleSave} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        pipeline: state.currentPipeline,
    }
};
const mapDispatchToProps = dispatch => {
    return {
        savePipeline: (currentUser, pipeline) => dispatch(savePipeline(currentUser, pipeline)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Pipeline);
