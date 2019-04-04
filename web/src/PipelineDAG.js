import React, { Component } from 'react';
import Tree from 'react-d3-tree';
import NodeLabel from './NodeLabel';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { setCurrentModule } from './actions/utilActions';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: '100vh',
        width: '69%',
        display: 'inline-block',
        verticalAlign: 'top',
        background: '#f6f6f6',
    },
    headline: {
        textAlign: 'center'
    }
});

class PipelineDAG extends Component {
    getTreeData () {
        const data = [];
        // Start with data sources
        for (let i = 0; i < this.props.pipeline['data_sources'].length; i++) {
            let data_source = this.props.pipeline['data_sources'][i];
            data.push({
                alias: data_source.alias, 
                name: data_source.alias,
                category: 'data_sources', 
                type: data_source.type, 
                index: i,
                parentIndex: -1,
                parentCategory: 'root',
                parentOutputIndex: -1,
            });

            this.getChildrenRec(data[data.length - 1]);
        }
        return data;
    }

    getChildrenRec(node) {
        const nodeName = node.alias;

        // Look in data sources
        for (let [index, data_source] of this.props.pipeline['data_sources'].entries()) {
            if (data_source.alias === nodeName) {
                node.category = 'data_sources';
                node.index = index;
                node.type = data_source.type;
                
                if (data_source.outputs) {
                    node.children = data_source.outputs.map((outputName, outputIndex) => {
                        return {
                            alias: outputName, 
                            name: outputName,
                            parentIndex: index,
                            parentCategory: 'data_sources',
                            parentOutputIndex: outputIndex,
                        };
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
                node.category = 'models';
                node.index = index;
                node.type = model.type;
                if (model.outputs) {
                    node.children = model.outputs.map((outputName, outputIndex) => {
                        return {
                            alias: outputName, 
                            name: outputName,
                            parentIndex: index,
                            parentCategory: 'models',
                            parentOutputIndex: outputIndex,
                        }
                    });
                    
                    for (let i = 0; i < node.children.length; i++) {
                        this.getChildrenRec(node.children[i])
                    }
                }
            }
        }

        // Look in storage
        for (let [index, storage] of this.props.pipeline.storage.entries()) {
            if (storage.alias === nodeName) {
                node.category = 'storage';
                node.index = index;
                node.type = storage.type;
            }
        }

        // Look in filters
        for (let [index, filter] of this.props.pipeline.filters.entries()) {
            if (filter.alias === nodeName ) { 
                node.category = 'filters';
                node.index = index;
                node.type = filter.type;
                if (filter.outputs) {
                    node.children = filter.outputs.map((outputName, outputIndex) => {
                        return {
                            alias: outputName, 
                            name: outputName,
                            parentIndex: index,
                            parentCategory: 'filters',
                            parentOutputIndex: outputIndex,
                        };
                    });

                    for (let i = 0; i < node.children.length; i++) {
                        this.getChildrenRec(node.children[i]);
                    }
                }
            }
        }

        // Look in custom entities
        if (this.props.pipeline.hasOwnProperty('custom_entities')) {
            for (let [index, custom] of this.props.pipeline.custom_entities.entries()) {
                if (custom.alias === nodeName) {
                    node.category = 'custom_entities';
                    node.index = index;
                    node.type = custom.type;
                    if (custom.outputs) {
                        node.children = custom.outputs.map((outputName, outputIndex) => {
                            return {
                                alias: outputName,
                                name: outputName,
                                parentIndex: index,
                                parentCategory: 'custom_entities',
                                parentOutputIndex: outputIndex,
                            };
                        });
                        
                        for (let i = 0; i < node.children.length; i++) {
                            this.getChildrenRec(node.children[i]);
                        }
                    }
                }
            }
        }
    }

    handleNodeClick = (selectedModule, event) => {
        const pipeline = this.props.pipeline;
        for (let i = 0; i < pipeline[selectedModule.category].length; i++) {
            if (pipeline[selectedModule.category][i].alias === selectedModule.alias) {
                //this.props.setCurrentModule(selectedModule.category, selectedModule.type, selectedModule.index);
            }
        }
    }

    componentDidMount() {
        const firstModule = this.props.pipeline.data_sources[0];
        this.props.setCurrentModule('data_sources', firstModule.type, 0, -1, 'root', -1);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.pipeline.pipeline_alias !== this.props.pipeline.pipeline_alias){
            return false;
        }

        // See if the number of nodes of each type has changed. If so, update. If not, don't update the entire tree
        const nodeTypes = ['models', 'filters', 'data_sources', 'storage', 'custom_entities']
        for (let nodeType of nodeTypes) {
            if (nextProps.pipeline.hasOwnProperty(nodeType) &&
                this.props.pipeline.hasOwnProperty(nodeType) &&
                nextProps.pipeline[nodeType].length !== this.props.pipeline[nodeType].length) {
                    return true;
                }
        }

        return false;
    }

    render() {
        const treeData = this.getTreeData();
        const classes = this.props.classes;
        const tree = treeData.length > 0 ? (
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
                nodeLabelComponent={{render: <NodeLabel onClick={this.handleNodeClick} />, foreignObjectWrapper: {x: -135, y: -20, width: 280}}}
                nodeSvgShape={{shape: 'rect', shapeProps: {width: 0, height: 0, x: -50, y: -10}}}
            />
        ) : '';

        return (
            <div className={classes.root}>
                <Typography variant='h6' className={classes.headline}>Pipeline Overview</Typography>
                {tree}
            </div>
        );
    }
}

const mapStateToProps = state=> {
    return {
        pipeline: state.currentPipeline
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentModule: (type, subtype, index) => dispatch(setCurrentModule(type, subtype, index)),
    };
}

export default withStyles(styles)(
connect(
    mapStateToProps,
    mapDispatchToProps
)(PipelineDAG));
