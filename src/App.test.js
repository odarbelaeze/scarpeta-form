import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { FirebaseContext } from "./firebase";

class FirebaseMock {
  constructor() {
    this.auth = {
      onAuthStateChanged() {
        return () => {};
      }
    };
  }
}

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <FirebaseContext.Provider value={new FirebaseMock()}>
      <App />
    </FirebaseContext.Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
