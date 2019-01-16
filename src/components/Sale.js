import React, { Component } from "react";
import { FirebaseContext } from "../firebase";
import OrderSummary from "./OrderSummary";
import moment from "moment";
import get from "lodash.get";
import "moment/locale/es";

class Sale extends Component {
  static contextType = FirebaseContext;

  state = { loading: true, orders: [] };

  componentDidMount() {
    this.context.ordersBySale(this.props.id).then(query => {
      query.onSnapshot(snapshot =>
        this.setState({
          loading: false,
          orders: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        })
      );
    });
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    const totalOrder = this.state.orders.reduce(
      (accum, order) => ({
        total: accum.total + order.total,
        quoted: order.quoted,
        quote: Object.keys({ ...accum.quote, ...order.quote }).reduce(
          (sum, code) => ({
            ...sum,
            [code]:
              get(accum, `quote.${code}`, 0.0) +
              parseFloat(get(order, `quote.${code}`, 0.0))
          })
        )
      }),
      { total: 0, quote: {} }
    );
    return (
      <div className="Sale">
        <h2>
          {moment(this.props.startDate, "X").format("LLL")} &mdash;{" "}
          {moment(this.props.endDate, "X").format("LLL")}
        </h2>
        <OrderSummary {...totalOrder} />
        {this.state.orders.map(order => (
          <OrderSummary key={order.id} {...order} />
        ))}
      </div>
    );
  }
}

export default Sale;
