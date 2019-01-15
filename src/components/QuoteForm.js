import React, { Component } from "react";
import PropTypes from "prop-types";
import yaml from "js-yaml";
import Product from "./Product";
import { Button, Intent } from "@blueprintjs/core";
import "./QuoteForm.css";

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
        className="QuoteForm"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Stopped form propagation.");
        }}
      >
        <h2>Pedido</h2>
        <div className="QuoteForm-products">
          {products.map(product => (
            <Product
              key={product.code}
              {...product}
              onValueChange={this.updateQuote.bind(this)}
            />
          ))}
        </div>
        <div className="QuoteForm-summary">
          <strong>Total: ${this.total().toLocaleString()}</strong>
        </div>
        <div className="QuoteForm-buttons">
          <Button icon="confirm" intent={Intent.SUCCESS}>
            Confirmar
          </Button>
        </div>
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
