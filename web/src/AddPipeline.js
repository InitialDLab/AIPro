import React, { Component } from 'react';
import defaultPipeline from './defaultPipeline';
import API from './API';
import Tree from 'react-d3-tree';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import pink from '@material-ui/core/colors/pink';
import PipelineSidebar from './PipelineSidebar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

class NodeLabel extends Component {
    render() {
        const buttonStyle = {
            minWidth: 'inherit', 
            margin: '3px',
            width: 'inherit',
            height: 'inherit',
            marginLeft: 'auto',
            color: '#fff',
            backgroundColor: pink[500]
        };

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
                iconName = '';
                break;
            default:
                iconName = 'computer';
                break;
        }

        const nodeTypeAvatar = (
            <Avatar style={{backgroundColor: pink[500]}}><Icon>{iconName}</Icon></Avatar>
        );

        const nodeTypeMap = {
            'storage': 'Storage',
            'models': 'Model',
            'data_sources': 'Data source',
            'filters': 'Filter module'
        }
        return (
            <Card>
                <CardHeader
                    avatar={nodeTypeAvatar}
                    title={this.props.nodeData.alias}
                    subheader={nodeTypeMap[this.props.nodeData.type]}
                    action={
                        <IconButton>
                          <MoreVertIcon style={{stroke: 'none'}} />
                        </IconButton>
                      }
                />
            </Card>
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
                tmpState.pipeline[data.type][i].outputs.push('Blah blah blah');
                tmpState.pipeline['storage'].push({'alias': 'Blah blah blah'})
            }
        }
        console.log(tmpState);
        this.setState(tmpState);
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

    render() {
        const treeData = this.getTreeData();
        
        const treeThing = (
            <div id="treeWrapper" style={{width: '100%', height:'100vh'}} >
                <PipelineSidebar type={'Data Source'} />
                <Tree 
                    scaleExtent={{min: 0.1, max:10}} 
                    collapsible={false} 
                    onMouseOver={data => console.log(data)} 
                    data={treeData} 
                    translate={{x: 500, y: 100}} 
                    onClick={this.handleNodeClick} 
                    orientation='vertical'
                    allowForeignObjects={true}
                    nodeSize={{x: 300, y: 150}}
                    zoom={0.6}
                    textLayout={{textAnchor: 'middle', x: 0, y: 0}}
                    nodeLabelComponent={{render: <NodeLabel />, foreignObjectWrapper: {x: -135, y: -20, width: 280}}}
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
