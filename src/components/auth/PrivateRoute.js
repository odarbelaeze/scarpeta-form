/**
 * Dependent on firebase.
 */

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../../firebase";

class PrivateRoute extends Component {
  static contextType = UserContext;
  render() {
    const { component: RoutedComponent, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.context.isAuthenticated() ? (
            <RoutedComponent {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
}

PrivateRoute.propTypes = Route.propTypes;

export default PrivateRoute;
