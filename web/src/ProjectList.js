import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class ProjectListItem extends Component {
    render () {
        const iconMap = {
            'done': 'done',
            'paused': 'pause',
            'running': 'cloud'
        };

        return (
            <ListItem button>
                <ListItemText primary={this.props.name} /><i className='material-icons'>{iconMap[this.props.status]}</i>
            </ListItem>
        );
    }
}

class AddProjectListItem extends Component {
    render() {
        return (
            <ListItem button key='add_new_item'>
                <ListItemText primary='Add new project' /><i className='material-icons'>add_to_queue</i>
            </ListItem>
        )
    }
}

class ProjectList extends Component {
    render() {
        const listItems = this.props.projects.map(project => (
            <ProjectListItem name={project.name} key={project.name} status={project.status} />
        ));
        return (
            <div>
                <List>
                    <AddProjectListItem />
                    {listItems}
                </List>
            </div>
        )
    }
}

export default ProjectList;