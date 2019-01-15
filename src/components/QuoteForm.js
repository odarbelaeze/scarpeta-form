import React, { Component } from "react";
import PropTypes from "prop-types";
import yaml from "js-yaml";
import Product from "./Product";

class QuoteForm extends Component {
  constructor(props) {
    super(props);
    const products = yaml.safeLoad(this.props.products);
    this.state = {
      products,
      prices: products.reduce(
        (acc, product) => ({
          ...acc,
          ...product.variations.reduce(
            (accc, variation) => ({
              ...accc,
              [variation.code]: variation.price
            }),
            {}
          )
        }),
        {}
      ),
      quote: {}
    };
  }

  total() {
    return Object.keys(this.state.quote).reduce(
      (total, code) => total + this.state.quote[code] * this.state.prices[code],
      0
    );
  }

  render() {
    const products = yaml.safeLoad(this.props.products);
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Stopped form propagation.");
        }}
      >
        <h2>Pedido</h2>
        {products.map(product => (
          <Product
            key={product.code}
            {...product}
            onValueChange={this.updateQuote.bind(this)}
          />
        ))}
        <strong>Total: ${this.total().toLocaleString()}</strong>
      </form>
    );
  }

  updateQuote(partial) {
    this.setState({
      quote: {
        ...this.state.quote,
        ...partial
      }
    });
  }
}

QuoteForm.propTypes = {
  products: PropTypes.string.isRequired
};

export default QuoteForm;
