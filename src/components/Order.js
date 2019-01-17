import React, { Component } from "react";
import QuoteForm from "./QuoteForm";
import OrderSummary from "./OrderSummary";
import { FirebaseContext } from "../firebase";

class Landing extends Component {
  static contextType = FirebaseContext;

  state = { loading: true, order: null, sale: null };

  componentDidMount() {
    this.context.currentSale().then(sale => {
      this.setState({ sale: sale && sale.data(), loading: !!sale }, () => {
        if (sale) {
          this.context.currentOrder().then(query => {
            if (!query) {
              this.setState({ loading: false });
            } else {
              query.onSnapshot(order =>
                this.setState({
                  loading: false,
                  order: !!order ? order.data() : null
                })
              );
            }
          });
        }
      });
    });
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
