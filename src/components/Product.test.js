import React from "react";
import ReactDOM from "react-dom";
import Product from "./Product";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Product name="Tomate" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
