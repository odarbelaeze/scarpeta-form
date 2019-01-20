import React, { Component } from "react";
import { FormGroup, TextArea, Button, Intent } from "@blueprintjs/core";
import { DateRangeInput, TimePrecision } from "@blueprintjs/datetime";
import { FirebaseContext } from "../firebase";
import { Redirect } from "react-router-dom";
import { safeLoad } from "js-yaml";
import moment from "moment";

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
- code: aguacate
  name: Aguacate Jas
  unit: bolsa
  variations:
    - code: aguacate-primera
      name: Primera
      price: 50000
    - code: aguacate-segunda
      name: Segunda
      price: 40000
- code: naranja
  name: Naranja Tangelo
  unit: bolsa
  variations:
    - code: naranja-primera
      name: Primera
      price: 50000
    - code: naranja-segunda
      name: Segunda
      price: 40000
`.trim();

class NewSale extends Component {
  static contextType = FirebaseContext;

  state = {
    dateRange: [
      moment()
        .startOf("day")
        .hour(3)
        .toDate(),
      moment()
        .endOf("day")
        .toDate()
    ],
    products: "",
    created: false
  };

  validProducts() {
    try {
      safeLoad(this.state.products);
      return true;
    } catch {
      return false;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const [startDate, endDate] = this.state.dateRange;
    const { products } = this.state;
    this.context
      .createSale({ startDate, endDate, products })
      .then(this.setState({ created: true }));
  }

  render() {
    if (this.state.created) return <Redirect to="/" />;
    return (
      <div className="NewSale">
        <form className="NewSale-form" onSubmit={this.handleSubmit.bind(this)}>
          <FormGroup label="Fechas de inicio y fin" labelFor="date-range">
            <DateRangeInput
              id="date-range"
              timePrecision={TimePrecision.MINUTE}
              formatDate={date => moment(date).format("YYYY-MM-DD HH:mm")}
              parseDate={str => moment(str, "YYYY-MM-DD HH:mm").toDate()}
              value={this.state.dateRange}
              onChange={dateRange => this.setState({ dateRange })}
              allowSingleDayRange
            />
          </FormGroup>
          <FormGroup
            label="Productos"
            labelFor="products-area"
            helperText="Mantenga el formato estrictamente"
          >
            <TextArea
              style={{ height: "50vh", fontFamily: "monospace" }}
              className="NewSale-textarea"
              id="products-area"
              value={this.state.products}
              placeholder={PRODUCTS}
              onChange={event =>
                this.setState({ products: event.target.value })
              }
              fill
            />
          </FormGroup>
          <Button
            intent={Intent.SUCCESS}
            type="submit"
            icon="confirm"
            disabled={!this.validProducts()}
          >
            Guardar
          </Button>
        </form>
      </div>
    );
  }
}

export default NewSale;
