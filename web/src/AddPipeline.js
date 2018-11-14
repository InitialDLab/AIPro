import React, { Component } from 'react';
import defaultPipeline from './defaultPipeline';
import API from './API';
import Tree from 'react-d3-tree';
import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import pink from '@material-ui/core/colors/pink';
import PipelineSidebar from './PipelineSidebar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import AddConfirmationDialog from './AddConfirmationDialog';

class NodeLabel extends Component {
    state = {
        anchorEl: null,
        deleteDialogOpen: false,
        addDialogOpen: false
    };

    handleOpenMenu = event => {
        this.setState({ ...this.state, anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({ anchorEl: null, deleteDialogOpen: false, addDialogOpen: false});
    };

    handleOpenDeleteDialog = () => {
        this.setState({...this.state, deleteDialogOpen: true});
    };

    handleOpenAddDialog = () => {
        this.setState({...this.state, addDialogOpen: true});
    }

    handleDelete = () => {
        this.setState({...this.state, deleteDialogOpen: false});
        this.props.deleteNode(this.props.nodeData.type, this.props.nodeData.alias, this.props.nodeData.array_position);
    };

    handleAdd = type => {
        this.props.addNode(type);
    }
    
    render() {
        const menu = (
            <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
            >
                {this.props.nodeData.type !== 'storage' ? <MenuItem onClick={this.handleOpenAddDialog}>Add output</MenuItem> : ''}
                <MenuItem onClick={this.handleClose}>Edit</MenuItem>
                <MenuItem onClick={this.handleOpenDeleteDialog}>Delete</MenuItem>
            </Menu>
        )

        let iconName = '';
        switch(this.props.nodeData.type) {
            case 'data_source_api':
            case 'data_sources':
                iconName = 'cloud_queue';
                break;
            case 'data_source_file':
                iconName = 'attach_file'
                break;
            case 'models':
            case 'model_custom':
                iconName = 'code';
                break;
            case 'model_prebuilt':
                iconName = 'memory';
                break;
            case 'filters':
                iconName = 'filter_list';
                break;
            case 'storage':
            case 'storage_flat_file':
                iconName = 'folder_open';
                break;
            case 'storage_database':
                iconName = 'storage';
                break;
            default:
                iconName = 'computer';
                break;
        }

        const nodeTypeAvatar = (
            <Avatar style={{backgroundColor: pink[500]}}>
                <Icon>{iconName}</Icon>
            </Avatar>
        );

        const nodeTypeMap = {
            'storage': 'Storage',
            'models': 'Model',
            'data_sources': 'Data source',
            'filters': 'Filter module'
        };
        
        return (
            <div>
                <Card>
                    <CardHeader
                        avatar={nodeTypeAvatar}
                        title={this.props.nodeData.alias}
                        subheader={nodeTypeMap[this.props.nodeData.type]}
                        action={
                            <IconButton
                            aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleOpenMenu}
                            >
                                <MoreVertIcon style={{stroke: 'none'}} />
                            </IconButton>
                        }
                        />
                </Card>
                {menu}
                <DeleteConfirmationDialog 
                    open={this.state.deleteDialogOpen} 
                    handleClose={this.handleClose} 
                    handleDelete={this.handleDelete}
                    nodeName={this.props.nodeData.alias}
                />
                <AddConfirmationDialog
                    open={this.state.addDialogOpen}
                    handleClose={this.handleClose}
                    handleAdd={this.handleAdd}
                    nodeName={this.props.nodeData.alias}
                />
            </div>
        );
    }
}

class AddPipeline extends Component {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }
    
    state = {
        pipeline: defaultPipeline
    }

    api = new API();

    handleSubmit = async () => {
        this.startLoading();
        const successful = await this.api.post('/pipeline', this.state.pipeline);
        if (successful) {
            this.stopLoading();
        }
    }

    update(type, array_position, attribute, value) {
        const tmpState = this.state;
        tmpState.pipeline[type][array_position][attribute] = value;
        this.setState(tmpState);
    }

    handleNodeClick = (data, event) => {
        const tmpState = this.state;
        if (data.type === 'storage') return;
        for (let i = 0; i < tmpState.pipeline[data.type].length; i++) {
            if (tmpState.pipeline[data.type][i].alias === data.alias) {
                // Found the right node - highlight it, show that it's selected
                // tmpState.pipeline[data.type][i].outputs.push('Blah blah blah');
                // tmpState.pipeline['storage'].push({'alias': 'Blah blah blah'})
            }
        }
        // console.log(tmpState);
        // this.setState(tmpState);
    }

    getTreeData() {
        const data = [];
        // Start with data sources
        for (let i = 0; i < this.state.pipeline['data_sources'].length; i++) {
            let data_source = this.state.pipeline['data_sources'][i];
            data.push({alias: data_source.alias, name: data_source.alias, type: 'data_sources', array_position: i});

            this.getChildrenRec(data[data.length - 1]);
        }
        return data;
    }

    getChildrenRec(node) {
        const nodeName = node.alias;

        // Look in data sources
        for (let [index, data_source] of this.state.pipeline.data_sources.entries()) {
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
        for (let [index, model] of this.state.pipeline.models.entries()) {
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
        for (let [index, storage] of this.state.pipeline.storage.entries()) {
            if (storage.alias === nodeName){    
                node.type = 'storage';
                node.array_position = index;
            }
        }
    }

    addNode = (nodeType) => {
        console.log('TODO: Add node type');
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

    handleSave = (type, alias, data) => {
        console.log('TODO: Save a module');
        console.log(alias);
        console.log(data);
    }

    render() {
        const treeData = this.getTreeData();
        
        const treeThing = (
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
                    nodeLabelComponent={{render: <NodeLabel deleteNode={this.deleteNode} addNode={this.addNode}/>, foreignObjectWrapper: {x: -135, y: -20, width: 280}}}
                    nodeSvgShape={{shape: 'rect', shapeProps: {width: 0, height: 0, x: -50, y: -10}}}
                />
            </div>
        );

        return (
            <div>
                {treeThing}
                
            </div>
        );
    }
}

export default AddPipeline;
