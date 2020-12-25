import React, { useState } from "react";

const PositionInput = ({ makePosition, loadUser }) => {
  const [formData, setFormData] = useState({
    crypto_currency: "",
    amount: "",
    price: "",
    date_of_purchase: "",
  });

  const { crypto_currency, amount, price, date_of_purchase } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // dropdown menu doesn't send default value (EUR) because onChange fires only on user input
    // in order to send a value (EUR or USD) it had to be actively selected everytime the user wants to enter a new position
    formData.fiat_currency = e.target.querySelector("select").value;

    await makePosition(formData);
    setFormData({
      crypto_currency: "",
      amount: "",
      price: "",
      fiat_currency: "",
      date_of_purchase: "",
    });
    loadUser();
  };

  return (
    <div className="form_container">
      <h3 className="large text-primary">Crypto Position</h3>
      <p className="lead"> Create new Crypto Position</p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            className="form-control input_field"
            type="text"
            placeholder="Crypto Currency"
            name="crypto_currency"
            value={crypto_currency}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-control input_field"
            type="number"
            placeholder="Amount"
            name="amount"
            value={amount}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <div className="input-group input_field">
          <input
            className="form-control"
            type="number"
            min="1"
            step="any"
            placeholder="Price"
            name="price"
            value={price}
            onChange={(e) => onChange(e)}
            required
          />
          <div className="input-group-append">
            <select className="btn btn-outline-secondary">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <input
            className="form-control input_field"
            type="date"
            name="date_of_purchase"
            value={date_of_purchase}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary"
          value="Submit Position"
        />
      </form>
    </div>
  );
};

export default PositionInput;
