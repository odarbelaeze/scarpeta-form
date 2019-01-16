import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import Landing from "./Landing";
import Login from "./components/auth/Login";
import { FirebaseContext, UserContext } from "./firebase";

import "./App.css";

const Licence = () => <h2>Licence</h2>;

class App extends Component {
  static contextType = FirebaseContext;
  state = { user: null };

  componentDidMount() {
    this.authListener = this.context.auth.onAuthStateChanged(user =>
      this.setState({ user })
    );
  }

  componentWillUnmount() {
    this.authListener();
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          user: this.state.user,
          logOut: () => this.context.logOut(),
          logIn: () => this.context.loginWithGoogle(),
          isAuthenticated: () => !!this.state.user
        }}
      >
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>Frutas y verduras</h1>
            </header>
            <div className="App-container">
              <PrivateRoute path="/" exact component={Landing} />
              <Route path="/licence/" component={Licence} />
              <Route path="/login/" component={Login} />
            </div>
          </div>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
