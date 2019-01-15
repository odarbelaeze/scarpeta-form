import React from "react";
import ReactDOM from "react-dom";
import QuoteForm from "./QuoteForm";

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
`;

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<QuoteForm products={PRODUCTS} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
