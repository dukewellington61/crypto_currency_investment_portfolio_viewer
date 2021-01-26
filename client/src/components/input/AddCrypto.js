import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestCryptoData } from "../../actions/currencies";
import { convertFiat } from "../../auxiliary/auxiliaryFiatData";

const AddCrypto = ({
  fiat,
  logedin,
  makePosition,
  loadUserObj,
  updateCryptoCurrenciesState,
  triggerAlert,
  setCryptoCurrencies,
  setCurrencyNames,
}) => {
  const [formData, setFormData] = useState({
    crypto_currency: "",
    amount: "",
    price: "",
    date_of_purchase: "",
  });

  const { crypto_currency, amount, price, date_of_purchase } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const [updatingDB, setUpdatingDB] = useState(false);

  let submitObj = {};

  const onSubmit = async (e) => {
    e.preventDefault();

    // sets state updatingDB to true so form is disabled while DB is being updated
    setUpdatingDB(true);

    // dropdown menu doesn't send default value (EUR) because onChange fires only on user input
    // in order to send a value (EUR or USD) it had to be actively selected everytime the user wants to enter a new position
    formData.fiat_currency = e.target.querySelector("select").value;

    // returns an object which has actual value of position in EUR, USD and GBP
    const convertObject = await convertFiat(
      price,
      formData.fiat_currency,
      date_of_purchase,
      triggerAlert
    );

    // formData object has properties which are neccessary to determin data that is to be persisted in db
    // some of the formData attributes themselfes are to be stored in db as well
    // they are set to an object which ends up beeing send to the backend for db persistance
    submitObj.crypto_currency = formData.crypto_currency;
    submitObj.amount = parseFloat(formData.amount);
    submitObj = Object.assign(submitObj, convertObject);
    submitObj.date_of_purchase = formData.date_of_purchase;

    // checks if crypto currency which user has entered even exists
    const returnValue = await getLatestCryptoData([crypto_currency]);

    if (returnValue.data.length > 0) {
      // triggers function that updates DB
      await makePosition(submitObj);

      // sets state updatingDB back to false
      setUpdatingDB(false);

      // sets form fields back to blank
      setFormData({
        crypto_currency: "",
        amount: "",
        price: "",
        date_of_purchase: "",
      });

      // reloads user object which is now updated with the added position
      loadUserObj();
      // updates cryptoCurrencies Obj @App.js which has all the data for @foverview/Overview.js
      updateCryptoCurrenciesState(
        logedin,
        fiat,
        triggerAlert,
        setCryptoCurrencies,
        setCurrencyNames
      );
    } else {
      triggerAlert(
        `Sorry, either we don't have ${crypto_currency} in our list or you've got the spelling wrong.`,
        "danger"
      );
    }
  };

  return (
    <Fragment>
      <div id="toggle_view_ledger">
        <Link to="/">
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-angle-double-left"></i> back to overview
          </button>
        </Link>
      </div>
      <div className="form_container">
        <h3 className="large text-primary">Add Crypto</h3>
        <p className="lead">Add cryptocurrency to your portfolio</p>
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
              disabled={updatingDB}
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
              disabled={updatingDB}
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
              disabled={updatingDB}
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
              disabled={updatingDB}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Add"
            disabled={updatingDB}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default AddCrypto;
