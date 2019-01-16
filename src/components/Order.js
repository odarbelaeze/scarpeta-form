import React, { Component } from "react";
import QuoteForm from "./QuoteForm";
import OrderSummary from "./OrderSummary";
import { FirebaseContext } from "../firebase";

const PRODUCTS = `
- code: tomate
  name: Tomate Chonto
  unit: bolsa
  variations:
    - code: tomate-primera
      name: Primera
      price: 20000
    - code: tomate-segunda
      name: Segunda
      price: 19000
- code: aguacate
  name: Aguacate Jas
  unit: bolsa
  variations:
    - code: aguacate-primera
      name: Primera
      price: 50000
    - code: aguacate-segunda
      name: Segunda
      price: 40000
- code: naranja
  name: Naranja Tangelo
  unit: bolsa
  variations:
    - code: naranja-primera
      name: Primera
      price: 50000
    - code: naranja-segunda
      name: Segunda
      price: 40000
`;

class Landing extends Component {
  static contextType = FirebaseContext;

  state = { loading: true, order: null };

  componentDidMount() {
    this.context.currentOrder().then(query => {
      query.onSnapshot(order => {
        this.setState({
          loading: false,
          order: !!order ? order.data() : null
        });
      });
    });
  }

  render() {
    if (this.state.loading) return <div>cargando...</div>;
    if (!!this.state.order) return <OrderSummary {...this.state.order} />;
    return <QuoteForm products={PRODUCTS} />;
  }
}

export default Landing;
