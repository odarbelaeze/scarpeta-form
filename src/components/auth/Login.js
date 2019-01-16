/**
 * Login route, relies on firebase.
 */

import React, { Component } from "react";
import { UserContext } from "../../firebase";
import { Redirect } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import { parse } from "query-string";

class Login extends Component {
  static contextType = UserContext;

  render() {
    const { next } = parse(this.props.location.search);
    const from = { pathname: next || "/" };
    const redirectToReferer = !!this.context.user;
    if (redirectToReferer) {
      return <Redirect to={from} />;
    }
    return (
      <div className="Login">
        <p>Necesitas estar registrado para poder usar la tienda.</p>
        <Button icon="log-in" onClick={() => this.context.logIn()}>
          Login con Google
        </Button>
      </div>
    );
  }
}

export default Login;
