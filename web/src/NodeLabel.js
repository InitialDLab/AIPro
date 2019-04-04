import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import AddConfirmationDialog from './AddConfirmationDialog';
import { connect } from 'react-redux';
import { deleteOutput, deleteModule } from './actions/pipelineActions';
import { setCurrentModule } from './actions/utilActions';
import { withStyles } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors/';

const styles = theme => ({
    selected: {
        backgroundColor: pink[400],
        color: theme.palette.common.white,
    },
    selectedTitle: {
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    normalIcon: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    selectedIcon: {
        backgroundColor: theme.palette.common.white,
        color: pink[400],
    },
    normal: {
        color: theme.palette.common.black,
        backgroundColor: theme.palette.common.white,
    },
    normalTitle: {
        color: theme.palette.common.black,
        fontWeight: 'bold',
    }
});

class NodeLabel extends Component {
    state = {
        anchorEl: null,
        deleteDialogOpen: false,
        addDialogOpen: false,
    };

    handleOpenMenu = event => {
        event.preventDefault();
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

    handleEdit = () => {
        const attrs = this.props.nodeData; 
        this.handleClose();
        this.props.setCurrentModule(attrs.category, attrs.type, attrs.index, attrs.parentIndex, attrs.parentCategory, attrs.parentOutputIndex);
    }

    handleDelete = () => {
        const attrs = this.props.nodeData;
        this.props.deleteModule(attrs.category, attrs.index);
    }
    
    render() {
        const { classes } = this.props;

        const menu = (
            <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
            >
                {this.props.nodeData.category !== 'storage' ? <MenuItem onClick={this.handleOpenAddDialog}>Add output</MenuItem> : ''}
                <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
                <MenuItem onClick={this.handleOpenDeleteDialog}>Delete</MenuItem>
            </Menu>
        )

        let iconName = '';
        switch(this.props.nodeData.type) {
            case 'TwitterStreamingAPI':
                iconName = 'cloud_queue';
                break;
            case 'FlatFileDataSource':
                iconName = 'attach_file'
                break;
            case 'CustomModel':
                iconName = 'code';
                break;
            case 'CustomEntity':
                iconName = 'widgets';
                break;
            case 'PrebuiltModel':
                iconName = 'memory';
                break;
            case 'Filter':
                iconName = 'filter_list';
                break;
            case 'FlatFileStorage':
                iconName = 'folder_open';
                break;
            case 'MongoDB':
                iconName = 'storage';
                break;
            default:
                iconName = 'computer';
                break;
        }

        const nodeTypeAvatar = (
            <Avatar className={this.props.selected ? classes.selectedIcon : classes.normalIcon}>
                <Icon>{iconName}</Icon>
            </Avatar>
        );

        const moduleTypeNameMap = {
            'TwitterStreamingAPI': 'Twitter Streaming API',
            'FlatFileDataSource': 'Flat File Data Source',
            'CustomModel': 'Custom Model',
            'CustomEntity': 'Custom Entity',
            'PrebuiltModel': 'Prebuilt Model',
            'Filter': 'Filter',
            'FlatFileStorage': 'Flat File Storage',
            'MongoDB': 'MongoDB Connection',
        };
        
        return (
            <div>
                <Card 
                    elevation={this.props.selected ? 15 : 1}
                    className={this.props.selected ? classes.selected : classes.normal}
                >
                    <CardHeader
                        classes={{
                            title: this.props.selected ? classes.selectedTitle : classes.normalTitle,
                            subheader: this.props.selected ? classes.selected : classes.normal,
                        }}
                        avatar={nodeTypeAvatar}
                        title={this.props.nodeData.alias}
                        subheader={moduleTypeNameMap[this.props.nodeData.type]}
                        action={
                            <IconButton
                            aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleOpenMenu}
                            >
                                <MoreVertIcon style={{stroke: 'none'}} className={this.props.selected ? classes.selected : classes.normal} />
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
                    parentCategory={this.props.nodeData.category}
                    parentIndex={this.props.nodeData.index}
                />
                <AddConfirmationDialog
                    open={this.state.addDialogOpen}
                    handleClose={this.handleClose}
                    handleError={this.handleDialogError}
                    nodeName={this.props.nodeData.alias}
                    parentCategory={this.props.nodeData.category}
                    parentIndex={this.props.nodeData.index}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let selected = false;
    const currentIndex = ownProps.nodeData.index;
    const currentType = ownProps.nodeData.type;
    if (state.currentModule.index === currentIndex && state.currentModule.type === currentType)
        selected = true;

    return {
        selected
    };
}

const mapDispatchToProps = dispatch => {
    return {
        deleteModule: (category, index) => dispatch(deleteModule(category, index)),
        deleteOutput: (parentModuleType, parentIndex, outputAlias) => dispatch(deleteOutput(parentModuleType, parentIndex, outputAlias)),
        setCurrentModule: (type, subtype, index, parentIndex, parentCategory, parentOutputIndex) => dispatch(setCurrentModule(type, subtype, index, parentIndex, parentCategory, parentOutputIndex)),
    };
}

export default withStyles(styles)(
connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeLabel));
