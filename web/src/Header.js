import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
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
            {'text': 'Manage Pipelines', 'link': '/pipelines'},
            {'text': 'Edit Current Pipeline', 'link': '/pipeline/edit'},
            {'text': 'New Pipeline from Flat File', 'link': '/pipeline/new/batch'},
            {'text': 'New Pipeline from streaming tweets', 'link': '/pipeline/new/streaming'},
            {'text': 'New Pipeline from streaming images', 'link': '/pipeline/new/streaming-images'},
            {'text': 'Image Captions Demo', 'link': '/demo/captions'},
            {'text': 'Tweet Sentiment Demo', 'link': '/demo/tweets'},
        ];
        
        const menuList = (
            <div style={{width: 250}}>
                <List>
                    {menuConfig.map(config => (
                    <Button style={{width: '100%', marginBottom: '10px'}} component={Link} to={config.link} key={config.text} >
                        <ListItemText primary={config.text} />
                        <Divider />
                    </Button>
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
            <AppBar position='static' style={{backgroundColor: '#000'}}>
                <Toolbar>
                <IconButton onClick={this.toggleMenu(!this.state.menuOpen)} style={{marginLeft: -12, marginRight: 20}} color="inherit" aria-label="Menu">
                <MenuIcon />
                </IconButton>
                
                <Typography component={Link} to='/' style={{textDecoration: 'none'}} variant="h6" color="inherit">
                    AI Pro
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