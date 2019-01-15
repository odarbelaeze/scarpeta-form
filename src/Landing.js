import React, { Component } from "react";
import yaml from "js-yaml";
import Product from "./components/Product";

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
  constructor(props) {
    super(props);
    this.state = {
      number: 0
    };
  }
  render() {
    const products = yaml.safeLoad(PRODUCTS);
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Stopped form propagation.");
        }}
      >
        {products.map(product => (
          <Product key={product.code} {...product} />
        ))}
      </form>
    );
  }
  update(number) {
    console.log(number);
    this.setState({ number });
  }
}

export default Landing;
