import React, { Component } from "react";
import { UserContext } from "../../firebase";
import { Link } from "react-router-dom";
import "./UserInfo.css";
import { Button, ButtonGroup, AnchorButton } from "@blueprintjs/core";

class UserInfo extends Component {
  static contextType = UserContext;

  render() {
    if (!this.context.isAuthenticated) return <Link to="/login/" />;
    const buttons = this.context.isAdmin ? (
      <ButtonGroup>
        <Button icon="log-out" onClick={this.context.logOut}>
          Log out
        </Button>
        <AnchorButton href="/admin/">Admin</AnchorButton>
      </ButtonGroup>
    ) : (
      <Button icon="log-out" onClick={this.context.logOut}>
        Log out
      </Button>
    );
    return (
      <div className="UserInfo">
        <img
          className="UserInfo-photo"
          src={this.context.user.photoURL}
          alt={this.context.user.displayName}
        />
        <strong>{this.context.user.displayName}</strong>
        {buttons}
      </div>
    );
  }
}

export default UserInfo;
