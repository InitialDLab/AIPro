import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import AddPipeline from './AddPipeline';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Settings from './Settings';
import LoginPage from './LoginPage';
import AllPipelines from './AllPipelines';

class App extends Component {
  state= {
    loggedIn: false,
    currentUser: ''
  };

  doLogin = (username, password) => {
    // Yeah... change this
    if (username === 'rsfrost' && password === 'Alomar9$'){
      this.setState({loggedIn: true, currentUser: 'rsfrost'});
    }
  }

  render() {
    return (
      <Router>
        <div style={{width: '100%', height: '100%'}}>
          <Header />
          <Route exact path='/' render={() => this.state.loggedIn ? <AddPipeline /> : <LoginPage doLogin={this.doLogin} />} />
          <Route path='/settings' render={() => this.state.loggedIn ? <Settings currentUser={this.state.currentUser} /> : <LoginPage doLogin={this.doLogin} />} />
          <Route exact path='/pipelines/new' render={() => this.state.loggedIn ? <AddPipeline /> : <LoginPage doLogin={this.doLogin} />} />
          <Route exact path='/pipelines' render={() => this.state.loggedIn ? <AllPipelines username={this.state.currentUser} /> : <LoginPage doLogin={this.doLogin} />} />          
        </div>
      </Router>
    )
  }
}

export default App;
