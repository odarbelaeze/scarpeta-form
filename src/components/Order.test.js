import React from "react";
import ReactDOM from "react-dom";
import Order from "./Order";
import { FirebaseContext } from "../firebase";

class FirebaseMock {
  async activeSales() {
    return {
      onSnapshot() {}
    };
  }
}

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <FirebaseContext.Provider value={new FirebaseMock()}>
      <Order />
    </FirebaseContext.Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
