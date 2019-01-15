import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import Landing from "./Landing";

const Licence = () => <h2>Licence</h2>;

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Frutas y verduras</h1>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/licence/">Licence</Link>
                </li>
              </ul>
            </nav>
          </header>
          <div className="App-container">
            <Route path="/" exact component={Landing} />
            <Route path="/licence/" component={Licence} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
