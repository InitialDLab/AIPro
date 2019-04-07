import React, { Component } from 'react';
import PipelineSidebar from './PipelineSidebar';
import { connect } from 'react-redux';
import PipelineDAG from './PipelineDAG';
import { Button } from '@material-ui/core';
import { savePipeline, createNewPipeline } from './actions/pipelineActions'
import { setCurrentModule } from './actions/utilActions';

const SavePipelinePanel = (props) => {
    return (
        <div style={{display: 'inline-block', verticalAlign: 'top', marginTop: '16px'}}>
            <Button onClick={props.handleSave} variant='contained' color='primary'>Save Pipeline</Button>
        </div>
    );
};

class Pipeline extends Component {
    constructor(props) {
        super(props);
        if (props.new) {
            if (props.type === 'batch') {
                this.props.setCurrentModule('data_sources', 'FlatFileDataSource', 0, -1, 'root', -1);
                this.props.startNewPipeline('batch');
            }
            else if (props.type === 'streaming') {
                this.props.setCurrentModule('data_sources', 'TwitterStreamingAPI', 0, -1, 'root', -1);
                this.props.startNewPipeline('streaming');
            }
            else if (props.type === 'streaming-images') {
                this.props.setCurrentModule('data_sources', 'StreamingImagesAPI', 0, -1, 'root', -1);
                this.props.startNewPipeline('streaming-images')
            }
        }
    }

    handleSave = () => {
        this.props.savePipeline(this.props.currentUser, this.props.pipeline);
    }

    render() {
        const pipelineDAG = this.props.pipeline ? <PipelineDAG /> : '';
        return (
            <div style={{width: '100%', height: '100vh'}}>
                <PipelineSidebar />
                    {pipelineDAG}
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
        startNewPipeline: dataSourceType => dispatch(createNewPipeline(dataSourceType)),
        setCurrentModule: (category, moduleType, index, parentIndex, parentCategory, parentOutputIndex) => dispatch(setCurrentModule(category, moduleType, index, parentIndex, parentCategory, parentOutputIndex)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Pipeline);
