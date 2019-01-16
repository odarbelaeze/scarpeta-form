import React from "react";
import { Link } from "react-router-dom";

const NotFound = props => (
  <div className="NotFound">
    <p>Estas perdido chico?</p>
    <Link
      to={{ pathname: "/login", search: `?next=${props.location.pathname}` }}
    >
      login?
    </Link>
  </div>
);

export default NotFound;
