import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import AddPipeline from './AddPipeline';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <AddPipeline />
      </div>
    )
  }
}

export default App;
