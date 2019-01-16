import React, { Component } from "react";
import { FirebaseContext } from "../firebase";
import Sale from "./Sale";

class Admin extends Component {
  static contextType = FirebaseContext;
  state = { sales: [], loading: true };

  componentDidMount() {
    this.context.activeSales().then(query => {
      query.onSnapshot(snapshot => {
        this.setState({
          loading: false,
          sales: snapshot.docs.map(doc => ({
            id: doc.ref.id,
            path: doc.ref.path,
            ...doc.data()
          }))
        });
      });
    });
  }

  render() {
    if (this.state.loading) return <p>Loading...</p>;
    return (
      <div className="Admin">
        {this.state.sales.map(sale => (
          <Sale key={sale.id} {...sale} />
        ))}
      </div>
    );
  }
}

export default Admin;
