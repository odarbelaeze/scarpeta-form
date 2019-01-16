import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormGroup, NumericInput } from "@blueprintjs/core";
import { money } from "../utils";
import "./Product.css";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: {}
    };
  }
  render() {
    const { name, variations } = this.props;
    return (
      <div className="Product">
        <h3 className="Product-title">{name}</h3>
        <div className="Product-variations">
          {variations.map(variation => (
            <FormGroup
              label={`${variation.name} (${money(variation.price)})`}
              labelFor={variation.code}
              key={variation.code}
            >
              <NumericInput
                id={variation.code}
                value={this.state.quote[variation.code] || 0}
                onValueChange={(_number, value) =>
                  this.update(variation.code, value)
                }
                min={0}
                selectAllOnFocus
              />
            </FormGroup>
          ))}
        </div>
      </div>
    );
  }

  update(code, value) {
    this.setState(
      {
        quote: {
          ...this.state.quote,
          [code]: value
        }
      },
      () => {
        const callback = this.props.onValueChange;
        if (callback) callback(this.state.quote);
      }
    );
  }
}

Product.propTypes = {
  name: PropTypes.string.isRequired,
  variations: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })
  ),
  onValueChange: PropTypes.func
};

Product.defaultProps = {
  variations: []
};

export default Product;
