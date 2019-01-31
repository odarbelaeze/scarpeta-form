import React, { Component } from "react";
import { Button, Intent } from "@blueprintjs/core";
import PropTypes from "prop-types";
import yaml from "js-yaml";
import md5 from "md5";

import { FirebaseContext } from "../firebase";
import Product from "./Product";
import "./QuoteForm.css";
import { money } from "../utils";

class QuoteForm extends Component {
  static contextType = FirebaseContext;

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
          this.submitOrder();
        }}
      >
        <h2>Pedido</h2>
        <div className="QuoteForm-products">
          {products.map(product => (
            <Product
              key={md5(product.code + product.name)}
              {...product}
              onValueChange={this.updateQuote.bind(this)}
            />
          ))}
        </div>
        <div className="QuoteForm-summary">
          <strong>Total: {money(this.total())}</strong>
        </div>
        <div className="QuoteForm-buttons">
          <Button
            icon="confirm"
            intent={Intent.SUCCESS}
            type="submit"
            disabled={this.total() <= 0}
          >
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

  submitOrder() {
    this.context.createOrder({
      quoted: this.state.products,
      total: this.total(),
      quote: this.state.quote
    });
  }
}

QuoteForm.propTypes = {
  products: PropTypes.string.isRequired
};

export default QuoteForm;
