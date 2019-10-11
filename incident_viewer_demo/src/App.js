import React from 'react';
import logo from './mlab-logo.png';
import './App.css';
import { LineChart } from './components/';

function App() {
  console.log("test")
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <LineChart></LineChart>

      </header>
    </div>
  );
}

export default App;
