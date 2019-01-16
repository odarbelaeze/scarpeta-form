import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Order from "./components/Order";
import NotFound from "./components/NotFound";
import Login from "./components/auth/Login";
import { FirebaseContext, UserContext } from "./firebase";

import "./App.css";

const Licence = () => <h2>Licence</h2>;

class App extends Component {
  static contextType = FirebaseContext;
  state = { user: null, isAdmin: false };

  componentDidMount() {
    this.authListener = this.context.auth.onAuthStateChanged(user => {
      if (this.adminListener && this.metadataRef) {
        this.metadataRef.off("value", this.adminListener);
      }
      if (user) {
        this.metadataRef = this.context.rt.ref(
          "metadata/" + user.uid + "/refreshTime"
        );
        this.adminListener = () => user.getIdToken(true);
        this.metadataRef.on("value", this.adminListener);
        user.getIdTokenResult().then(token => {
          this.setState({
            isAdmin: token && token.claims && token.claims.admin
          });
        });
      }
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    this.authListener();
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          user: this.state.user,
          isAuthenticated: !!this.state.user,
          isAdmin: this.state.isAdmin,
          logOut: () => this.context.logOut(),
          logIn: () => this.context.loginWithGoogle()
        }}
      >
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>Frutas y verduras</h1>
            </header>
            <div className="App-container">
              <Switch>
                <PrivateRoute exact path="/" component={Order} />
                <PrivateRoute exact path="/order/" component={Order} />
                <AdminRoute exact path="/admin/" component={Licence} />
                <Route exact path="/licence/" component={Licence} />
                <Route path="/login/" component={Login} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
