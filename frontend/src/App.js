/* import logo from './logo.svg';
import './App.css';*/

import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "./components/Container"

/*
function App() {
  return (
    <div className="App">
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
*/

/*
 * const n = []
for (let i = 0; i < 1; i++){
  n.push(
  <div> <h1> hi </h1> </div>
	  )
}
*/


function App() {
  return (
    <div className="outer--container">
	  <Header />
	  <Container />
	  <Footer />
    </div>
  )
}

export default App;
