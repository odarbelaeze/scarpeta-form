/**
 * Dependent on firebase.
 */

import React, { Component } from "react";
import { Route } from "react-router-dom";
import { UserContext } from "../../firebase";
import NotFound from "../NotFound";

class AdminRoute extends Component {
  static contextType = UserContext;

  render() {
    const { component: RoutedComponent, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.context.isAdmin ? (
            <RoutedComponent {...props} />
          ) : (
            <NotFound {...props} />
          )
        }
      />
    );
  }
}

AdminRoute.propTypes = Route.propTypes;

export default AdminRoute;
