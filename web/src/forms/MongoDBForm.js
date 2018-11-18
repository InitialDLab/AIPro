import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { updateModule, updateOutput } from '../actions/pipelineActions';
import { connect } from 'react-redux';

class MongoDBForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        this.props.updateModule('storage', this.props.index, attribute, value);
        if (attribute === 'alias') {
            this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, value);
        }
    }
    
    render() {
        const inputStyle = {
            padding: '10px',
            marginBottom: '20px'
        };
        return (
            <FormControl>
                <TextField onChange={this.handleChange} style={inputStyle} value={this.props.alias} name='alias' label='Module name' />
                <TextField onChange={this.handleChange} style={inputStyle} value={this.props.host} name='host' label='Host' />
                <TextField onChange={this.handleChange} style={inputStyle} value={this.props.port} name='port' label='Port' />
                <TextField onChange={this.handleChange} style={inputStyle} value={this.props.db} name='db' label='Database Name' />
                <TextField onChange={this.handleChange} style={inputStyle} value={this.props.collection} name='collection' label='Collection Name' />
            </FormControl>
        )
    }
}

const mapStateToProps = state => {
    const moduleType = state.currentModule.category, index = state.currentModule.index;
    const currentModule = state.currentPipeline[moduleType][index];

    return {
        alias: currentModule.alias,
        host: currentModule.host,
        port: currentModule.port,
        db: currentModule.db,
        collection: currentModule.collection,
        index,
        parentCategory: state.currentModule.parentCategory,
        parentIndex: state.currentModule.parentIndex,
        parentOutputIndex: state.currentModule.parentOutputIndex,
    };
}

const mapDispatch = dispatch => {
    return {
        updateModule: (type, index, attribute, value) => dispatch(updateModule(type, index, attribute, value)),
        updateOutput: (parentCategory, parentIndex, parentOutputIndex, outputAlias) => dispatch(updateOutput(parentCategory, parentIndex, parentOutputIndex, outputAlias)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatch
)(MongoDBForm);
