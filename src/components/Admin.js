import React, { Component } from "react";
import { DatePicker } from "@blueprintjs/datetime";
import Sale from "./Sale";
import moment from "moment";

class Admin extends Component {
  state = {
    startDate: moment().startOf("day"),
    endDate: moment().endOf("day")
  };

  handleDate(newDate) {
    console.log(newDate);
    this.setState({
      startDate: moment(newDate).startOf("day"),
      endDate: moment(newDate).endOf("day")
    });
  }

  render() {
    if (this.state.loading) return <p>Loading...</p>;
    return (
      <div className="Admin">
        <DatePicker
          onChange={this.handleDate.bind(this)}
          value={this.state.startDate.toDate()}
        />
        <Sale {...this.state} />
      </div>
    );
  }
}

export default Admin;
