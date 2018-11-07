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
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

class App extends Component {
  state = {
    menuOpen: false
  };

  toggleMenu = (open) => () => {
    this.setState({
      menuOpen: open
    });
  };

  actionNew = () => {
    console.log('New clicked');
  };

  actionOpen = () => {
    console.log('Open clicked');
  };

  actionSave = () => console.log('Save clicked');
  actionRun = () => console.log('Run clicked');
  
  render() {
    const menuConfig = [
      {'text': 'New Project', 'action': this.actionNew, 'link': '/new'},
      {'text': 'Open Project', 'action': this.actionOpen, 'link': '/open'},
      {'text': 'Save Current Project', 'action': this.actionSave},
      {'text': 'Run Current Project', 'action': this.actionRun}
    ];
    
    const menuList = (
      <div style={{width: 250}}>
        <List>
          {menuConfig.map(config => (
            <ListItem button key={config.text} onClick={config.action}>
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
            Compass
          </Typography>
          {/*<Button color="inherit">Login</Button>*/}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default App;
