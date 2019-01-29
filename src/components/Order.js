import React, { Component } from "react";
import QuoteForm from "./QuoteForm";
import OrderSummary from "./OrderSummary";
import { FirebaseContext } from "../firebase";

class Landing extends Component {
  static contextType = FirebaseContext;

  state = { loading: true, order: null, sale: null };

  componentDidMount() {
    this.context.currentOrder().then(query => {
      if (this.unsubOrder) this.unsubOrder();
      this.unsubOrder = query.onSnapshot(orders => {
        const order = orders.docs[0];
        if (order) {
          this.setState({
            loading: false,
            order: !!order ? order.data() : null
          });
        } else {
          this.context.currentSale().then(query => {
            if (this.unsubSale) this.unsubSale();
            this.unsubSale = query.onSnapshot(sales => {
              const sale = sales.docs[0];
              this.setState({
                loading: false,
                sale: !!sale ? sale.data() : null
              });
            });
          });
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubOrder) this.unsubOrder();
    if (this.unsubSale) this.unsubSale();
  }

  render() {
    if (this.state.loading) return <div>cargando...</div>;
    if (!this.state.sale)
      return <div>No estamos tomando ordenes en el momento...</div>;
    if (!!this.state.order)
      return (
        <OrderSummary
          {...this.state.order}
          timestamp={this.state.order.timestamp.toDate()}
        />
      );
    return <QuoteForm products={this.state.sale.products} />;
  }
}

export default Landing;
