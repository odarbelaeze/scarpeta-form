import React, { Component, Fragment } from "react";
import { FirebaseContext } from "../firebase";
import OrderSummary from "./OrderSummary";
import moment from "moment";
import get from "lodash.get";
import "moment/locale/es";

class Sale extends Component {
  static contextType = FirebaseContext;

  state = { loading: true, orders: [] };

  componentDidMount() {
    this.listenForOrders(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setState(
      {
        loading: true,
        orders: []
      },
      () => {
        this.listenForOrders(newProps);
      }
    );
  }

  listenForOrders(props) {
    this.context
      .ordersBetween({
        startDate: props.startDate.toDate(),
        endDate: props.endDate.toDate()
      })
      .then(query => {
        this.unsubOrders = query.onSnapshot(snapshot =>
          this.setState({
            loading: false,
            orders: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          })
        );
      });
  }

  componentWillUnmount() {
    if (this.unsubOrders) this.unsubOrders();
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
          }),
          {}
        )
      }),
      { total: 0, quote: {}, quoted: [] }
    );
    return (
      <div className="Sale">
        <h2>
          {moment(this.props.startDate, "X").format("LLL")} &mdash;{" "}
          {moment(this.props.endDate, "X").format("LLL")}
        </h2>
        <h3>Consolidado</h3>
        <OrderSummary
          {...totalOrder}
          userName="Todos los clientes"
          timestamp={this.props.startDate.toDate()}
        />
        <h3>Pedidos</h3>
        {this.state.orders.map(order => (
          <Fragment key={order.id}>
            <OrderSummary
              {...order}
              timestamp={order.timestamp.toDate()}
              onDelete={() =>
                this.context.deleteOrder({
                  orderId: order.id
                })
              }
            />
            <hr />
          </Fragment>
        ))}
      </div>
    );
  }
}

export default Sale;
