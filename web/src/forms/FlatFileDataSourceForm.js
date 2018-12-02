import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import { updateModule, uploadFile } from '../actions/pipelineActions';
import UploadButton from '../UploadButton';

class FlatFileDataSourceForm extends Component {
    handleChange = event => {
        this.props.updateModule('data_sources', this.props.index, event.target.name, event.target.value);
    }

    // TODO: Add a method of uploading this file
    uploadFile = event => {
        const files = event.target.files;
        const file = files[0];
        this.props.uploadFile('data_sources', this.props.index, 'filename', file);
    }
    
    render() {
        //const uploadButton = <UploadButton buttonText='Upload File' handleFile={this.uploadFile} />;
        return (
            <div>
                <TextField value={this.props.alias} style={{display: 'block', marginBottom: '10px'}} name='alias' onChange={this.handleChange} label='Module name' />
                <TextField value={this.props.filename} style={{display: 'block', marginBottom: '10px'}} name='filename' onChange={this.handleChange} label='Filename' />
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state.currentModule);
    console.log(state.pipeline);
    const currentModule = state.currentPipeline[state.currentModule.category][state.currentModule.index];
    return {
        alias: currentModule.alias,
        filename: currentModule.filename,
        outputs: currentModule.outputs,
        index: state.currentModule.index,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        updateModule: (category, index, attribute, value) => dispatch(updateModule(category, index, attribute, value)),
        uploadFile: (category, index, attribute, file) => dispatch(uploadFile(category, index, attribute, file)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FlatFileDataSourceForm);