import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
            {'text': 'View Projects', 'link': '/projects'},
            {'text': 'Create New Project', 'link': '/projects/new'},
        ];
        
        const menuList = (
            <div style={{width: 250}}>
            <List>
                {menuConfig.map(config => (
                <ListItem key={config.text} >
                    <ListItemText primary={config.text} />
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
                <Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
                AI Pro
                </Typography>
                {/*<Button color="inherit">Login</Button>*/}
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

export default Header;