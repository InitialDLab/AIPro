import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

class Header extends Component {
    state = {
        menuOpen: false
    };

    toggleMenu = (open) => () => {
        this.setState({
            menuOpen: open
        });
    };

    render() {
        const menuConfig = [
            {'text': 'View Pipelines', 'link': '/pipelines'},
            {'text': 'Create New Pipeline', 'link': '/pipelines/new'},
        ];
        
        const menuList = (
            <div style={{width: 250}}>
            <List>
                {menuConfig.map(config => (
                <ListItem component={Link} to={config.link} key={config.text} >
                    <ListItemText primary={config.text} />
                    <Divider />
                </ListItem>
                ))}
            </List>
            </div>
        );
        return (
            <div className="App">
            <Drawer open={this.state.menuOpen} onClose={this.toggleMenu(false)}>
                <div
                tabIndex={0}
                role='button'
                onClick={this.toggleMenu(false)}
                onKeyDown={this.toggleMenu(false)}
                >
                {menuList}
                </div>
            </Drawer>
            <AppBar position='static'>
                <Toolbar>
                <IconButton onClick={this.toggleMenu(!this.state.menuOpen)} style={{marginLeft: -12, marginRight: 20}} color="inherit" aria-label="Menu">
                <MenuIcon />
                </IconButton>
                
                <Typography component={Link} to='/' style={{textDecoration: 'none'}} variant="h6" color="inherit">
                    Handoff
                </Typography>
                
                <div style={{flexGrow: 1, textAlign: 'right'}}>
                    <IconButton style={{color: '#fff'}} component={Link} to='/settings'>
                        <Icon >settings</Icon>
                    </IconButton>
                </div>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

export default Header;