import React from "react";
import { HTMLTable } from "@blueprintjs/core";
import { money } from "../utils";
import "./OrderSummary.css";

const Quote = ({ quoted, quote, total }) => {
  const details = quoted.reduce((accum, product) => {
    return [
      ...accum,
      ...product.variations.reduce((variationAccum, variation) => {
        if (variation.code in quote) {
          return [
            ...variationAccum,
            {
              code: variation.code,
              product: product.name,
              variation: variation.name,
              price: variation.price,
              quantity: quote[variation.code]
            }
          ];
        }
        return variationAccum;
      }, [])
    ];
  }, []);
  return (
    <div className="OrderSummary">
      <h2>Su orden ha sido registrada</h2>
      <HTMLTable className="OrderSummary-details" bordered>
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>Nombre</th>
            <th>Calidad</th>
            <th>Precio unitario</th>
            <th>Precio total</th>
          </tr>
        </thead>
        <tbody>
          {details.map(detail => (
            <tr key={detail.code}>
              <td>{detail.quantity}</td>
              <td>{detail.product}</td>
              <td>{detail.variation}</td>
              <td style={{ textAlign: "right" }}>{money(detail.price)}</td>
              <td style={{ textAlign: "right" }}>
                {money(detail.price * detail.quantity)}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4}>
              <strong>Total</strong>
            </td>
            <td>{money(total)}</td>
          </tr>
        </tbody>
      </HTMLTable>
    </div>
  );
};

export default Quote;
