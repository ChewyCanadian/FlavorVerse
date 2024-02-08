import logo from './logo.svg';
import './App.css';
import React from 'react';
import Header from './Header';
import Category from './Category';

function App() {
  return (
    <div className="App">
      <Header />
      <Category />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
