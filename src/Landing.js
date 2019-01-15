import React, { Component } from "react";
import QuoteForm from "./components/QuoteForm";

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
  render() {
    return <QuoteForm products={PRODUCTS} />;
  }
}

export default Landing;
