import React, { useState } from "react";
import { getLatestCryptoData } from "../../actions/currencies";
import { getFiatExchangeRates } from "../../actions/currencies";

const AddCrypto = ({ makePosition, loadUserObj, triggerAlert }) => {
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

    convertFiat();

    const returnValue = await getLatestCryptoData([crypto_currency]);

    if (returnValue.data.length > 0) {
      await makePosition(formData);
      setFormData({
        crypto_currency: "",
        amount: "",
        price: "",
        fiat_currency: "",
        date_of_purchase: "",
      });
      loadUserObj();
    } else {
      triggerAlert(
        `Sorry, either we don't have ${crypto_currency} in our list or you've got the spelling wrong.`,
        "danger"
      );
    }
  };

  const convertFiat = async () => {
    const exchangeObj = await getFiatExchangeRates(date_of_purchase);

    // console.log("exchangeObj");
    // console.log(exchangeObj);

    if (exchangeObj instanceof Error) {
      triggerAlert(exchangeObj.message, "danger");
      return;
    } else if (exchangeObj) {
      switch (formData.fiat_currency) {
        case "EUR":
          formData.price_EUR = price;
          formData.price_USD = price * exchangeObj.data.rates.USD;
          formData.price_GBP = price * exchangeObj.data.rates.GBP;
          break;
        case "USD":
          formData.price_USD = price;
          const exchangeRateUSD_EUR = 1 / exchangeObj.data.rates.USD;
          const exchangeRateUSD_GBP = 1 / exchangeObj.data.rates.GBP;
          formData.price_EUR = price * exchangeRateUSD_EUR;
          formData.price_GBP = price * exchangeRateUSD_GBP;
          break;
        case "GBP":
          formData.price_GBP = price;
          const exchangeRateGBP_EUR = 1 / exchangeObj.data.rates.EUR;
          const exchangeRateGBP_USD = 1 / exchangeObj.data.rates.USD;
          formData.price_EUR = price * exchangeRateGBP_EUR;
          formData.price_USD = price * exchangeRateGBP_USD;
          break;
        default:
      }
    }
  };

  return (
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
        <input type="submit" className="btn btn-primary" value="Add" />
      </form>
    </div>
  );
};

export default AddCrypto;
