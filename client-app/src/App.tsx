import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';

class App extends Component {
  state = {
    values: []
  }

  componentDidMount() {
    this.setState({
      values: [{ id: 1, name: "value 101" }, { id: 2, name: 'value 102' }]
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
        </header>
      </div>
    );
  }
}

export default App;
