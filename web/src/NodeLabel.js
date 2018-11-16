import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import pink from '@material-ui/core/colors/pink';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import AddConfirmationDialog from './AddConfirmationDialog';
import { connect } from 'react-redux';
import { addModule, addOutput, deleteOutput, deleteModule, selectModule } from './actions/pipelineActions';

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

    handleEdit = () => {

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

        const moduleTypeNameMap = {
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
                        subheader={moduleTypeNameMap[this.props.nodeData.type]}
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

const mapStateToProps = (state, ownProps) => {
    return {

    };
}

const mapDispatchToProps = dispatch => {
    return {
        addModule,
        addOutput,
        deleteModule,
        deleteOutput,
        selectModule
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeLabel);
