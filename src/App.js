import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Order from "./components/Order";
import Admin from "./components/Admin";
import NewSale from "./components/NewSale";
import NotFound from "./components/NotFound";
import Login from "./components/auth/Login";
import UserInfo from "./components/auth/UserInfo";
import { FirebaseContext, UserContext } from "./firebase";

import "./App.css";

const Licence = () => (
  <div className="licence">
    <h2>Licencia</h2>
    <code>
      Copyright 2019 Oscar David Arbeláez Echeverri <br /> <br /> Licensed under
      the Apache License, Version 2.0 (the "License"); you may not use this file
      except in compliance with the License. You may obtain a copy of the
      License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
      applicable law or agreed to in writing, software distributed under the
      License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
      CONDITIONS OF ANY KIND, either express or implied. See the License for the
      specific language governing permissions and limitations under the License.
    </code>
  </div>
);

class App extends Component {
  static contextType = FirebaseContext;
  state = { user: null, isAdmin: false };

  componentDidMount() {
    this.authListener = this.context.auth.onAuthStateChanged(user => {
      this.setState({ user, isAdmin: false }, () => {
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
      });
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
          logOut: () =>
            this.context
              .logOut()
              .then(() => this.setState({ user: null, isAdmin: false })),
          logIn: () => this.context.loginWithGoogle()
        }}
      >
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>Frutas y verduras</h1>
            </header>
            <div className="App-container App-main">
              <Switch>
                <PrivateRoute exact path="/" component={Order} />
                <AdminRoute exact path="/admin/" component={Admin} />
                <AdminRoute exact path="/sale/new/" component={NewSale} />
                <Route exact path="/licence/" component={Licence} />
                <Route path="/login/" component={Login} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <footer className="App-footer">
              <div className="App-container">
                <UserInfo />
                <div className="App-links">
                  <Link to="/licence/">Licencia</Link>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
