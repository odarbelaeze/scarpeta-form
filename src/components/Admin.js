import React, { Component } from "react";
import Sale from "./Sale";
import moment from "moment";

class Admin extends Component {
  state = {
    startDate: moment().startOf("day"),
    endDate: moment().endOf("day")
  };

  render() {
    if (this.state.loading) return <p>Loading...</p>;
    return (
      <div className="Admin">
        <Sale {...this.state} />
      </div>
    );
  }
}

export default Admin;
