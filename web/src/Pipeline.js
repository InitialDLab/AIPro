import React, { Component } from 'react';
import Tree from 'react-d3-tree';
import PipelineSidebar from './PipelineSidebar';
import NodeLabel from './NodeLabel';
import { connect } from 'react-redux';
import { setCurrentModule } from './actions/utilActions';
import { savePipeline, deletePipeline, CREATE_NEW_PIPELINE} from './actions/pipelineActions';
import { defaultModuleAttributes } from './constants/defaultAttributes';

class Pipeline extends Component {
    handleNodeClick = (data, event) => {
        const pipeline = this.props.pipeline;
        if (data.type === 'storage') return;
        for (let i = 0; i < pipeline[data.type].length; i++) {
            if (pipeline[data.type][i].alias === data.alias) {
                this.props.setCurrentModule(data.type, data.subType, data.index);
            }
        }
    }

    getTreeData() {
        const data = [];
        // Start with data sources
        for (let i = 0; i < this.props.pipeline['data_sources'].length; i++) {
            let data_source = this.props.pipeline['data_sources'][i];
            data.push({alias: data_source.alias, name: data_source.alias, type: 'data_sources', array_position: i});

            this.getChildrenRec(data[data.length - 1]);
        }
        return data;
    }

    getChildrenRec(node) {
        const nodeName = node.alias;

        // Look in data sources
        for (let [index, data_source] of this.props.pipeline['data_sources'].entries()) {
            if (data_source.alias === nodeName) {
                node.type = 'data_sources';
                node.array_position = index;
                if (data_source.outputs) {
                    node.children = data_source.outputs.map(outputName => {
                        return {alias: outputName, name: outputName}
                    });

                    for (let i = 0; i < node.children.length; i++) {
                        this.getChildrenRec(node.children[i]);
                    }
                }
            }
        }

        // Look in models
        for (let [index, model] of this.props.pipeline.models.entries()) {
            if (model.alias === nodeName) {
                node.type = 'models';
                node.array_position = index;
                if (model.outputs) {
                    node.children = model.outputs.map(outputName => {
                        return {alias: outputName, name: outputName}
                    });
                    
                    for (let i = 0; i < node.children.length; i++) {
                        this.getChildrenRec(node.children[i])
                    }
                }
            }
        }

        // Look in storage
        for (let [index, storage] of this.props.pipeline.storage.entries()) {
            if (storage.alias === nodeName){    
                node.type = 'storage';
                node.array_position = index;
            }
        }
    }

    deleteNode = (nodeType, alias, array_position) => {
        const tmpState = this.state;

        // Delete module
        tmpState.pipeline[nodeType].splice(array_position, 1);

        // Delete references
        // Data sources
        if (tmpState.pipeline['data_sources']){
            for (let [index, data_source] of tmpState.pipeline['data_sources'].entries()) {
                if (data_source.outputs) {
                    let deleteIndex = -1;
                    for (let i = 0; i < data_source.outputs.length; i++) {
                        if (data_source.outputs[i] === alias) {
                            deleteIndex = i;
                            break;
                        }
                    }
                    if (deleteIndex !== -1) {
                        tmpState.pipeline['data_sources'][index].outputs.splice(deleteIndex, 1);
                    }
                }
            }
        }

        // Models
        if (tmpState.pipeline['models']){
            for (let [index, model] of tmpState.pipeline['models'].entries()) {
                if (model.outputs) {
                    let deleteIndex = -1;
                    for (let i = 0; i < model.outputs.length; i++) {
                        if (model.outputs[i] === alias) {
                            deleteIndex = i;
                            break;
                        }
                    }
                    if (deleteIndex !== -1) {
                        tmpState.pipeline['models'][index].outputs.splice(deleteIndex, 1);
                    }
                }
            }
        }

        // Filters
        if (tmpState.pipeline['filters']){
            for (let [index, filter] of tmpState.pipeline['filters'].entries()) {
                if (filter.outputs) {
                    let deleteIndex = -1;
                    for (let i = 0; i < filter.outputs.length; i++) {
                        if (filter.outputs[i] === alias) {
                            deleteIndex = i;
                            break;
                        }
                    }
                    if (deleteIndex !== -1) {
                        tmpState.pipeline['filters'][index].outputs.splice(deleteIndex, 1);
                    }
                }
            }
        }
            
        this.setState(tmpState);
    };

    render() {
        const treeData = this.getTreeData();
        
        const tree = (
            <div id="treeWrapper" style={{width: '100%', height:'100vh'}} >
                <PipelineSidebar formType={'flat_file_storage'} handleSave={this.handleSave} />
                <Tree 
                    scaleExtent={{min: 0.1, max:10}} 
                    collapsible={false}
                    data={treeData} 
                    translate={{x: 500, y: 100}} 
                    onClick={this.handleNodeClick} 
                    orientation='vertical'
                    allowForeignObjects={true}
                    nodeSize={{x: 300, y: 150}}
                    textLayout={{textAnchor: 'middle', x: 0, y: 0}}
                    nodeLabelComponent={{render: <NodeLabel />, foreignObjectWrapper: {x: -135, y: -20, width: 280}}}
                    nodeSvgShape={{shape: 'rect', shapeProps: {width: 0, height: 0, x: -50, y: -10}}}
                />
            </div>
        );

        return (
            <div>
                {tree}    
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let currentModule;
    const currentPipeline = state.currentPipeline;
    const currentModuleType = state.currentModule.type;
    const currentModuleSubType = state.currentModule.subtype;
    const currentModuleIndex = state.currentModule.index;
    if (currentPipeline.hasOwnProperty(currentModuleType) && currentPipeline[currentModuleType].length > 0) {
        currentModule = currentPipeline[currentModuleType][currentModuleIndex];
    }
    else {
        if (!defaultModuleAttributes.hasOwnProperty(currentModuleType) || !defaultModuleAttributes[currentModuleType].hasOwnProperty(currentModuleSubType)) {
            console.error(`Unknown module type ${currentModuleType} for current module`);
            currentModule = {};
        }
        else {
            currentModule = defaultModuleAttributes[currentModuleType][currentModuleSubType];
        }
    }
    return {
        pipeline: state.currentPipeline,
        currentModule: currentModule
    };
}

const mapDispatchToProps = dispatch => {
    return {
        createNewPipeline: dispatch(CREATE_NEW_PIPELINE),
        deletePipeline,
        savePipeline,
        setCurrentModule
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Pipeline);
