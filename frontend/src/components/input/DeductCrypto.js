import React, { useState, useEffect } from "react";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrenciesNames } from "../../auxiliary/auxiliaryCryptoData";

// import { getLatestCryptoPrice } from "../../actions/currencies";

const DeductCrypto = ({ user, makePosition, loadUserObj, triggerAlert }) => {
  const [formData, setFormData] = useState({
    crypto_currency: "",
    amount: "",
    date_of_purchase: "",
  });

  const { crypto_currency, amount, date_of_purchase } = formData;

  const [currencyNames, setCurrencyNames] = useState([]);

  useEffect(() => {
    const namesArr = getCurrenciesNames(user);
    namesArr.unshift("");
    setCurrencyNames(namesArr);
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // console.log("formData");
    // console.log(formData);

    if (!crypto_currency) {
      triggerAlert("Please select a cryptocurrency", "danger");
      return;
    }

    const currentAmount = getAmount(user, crypto_currency);

    if (amount > currentAmount) {
      triggerAlert(
        `You have only ${currentAmount} unit(s) of this currency`,
        "danger"
      );
      return;
    }

    formData.amount = parseFloat(formData.amount) * -1;

    await makePosition(formData);
    setFormData({
      crypto_currency: "",
      amount: "",
      date_of_purchase: "",
    });
    loadUserObj();
  };

  return (
    <div className="form_container">
      <h3 className="large text-primary">Deduct Crypto</h3>
      <p className="lead">Deduct cryptocurrency from your portfolio</p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <div className="dropdown input_field">
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>Select a cryptocurrency</div>
              <select
                id="deduct_select"
                className="btn btn-outline-secondary"
                name="crypto_currency"
                style={{ position: "absolute", right: "0", width: "50%" }}
                onChange={(e) => onChange(e)}
              >
                {currencyNames.map((currencyName) => {
                  return (
                    <option value={`${currencyName}`}>{currencyName}</option>
                  );
                })}
              </select>
            </div>
          </div>
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

        <input type="submit" className="btn btn-primary" value="Deduct" />
      </form>
    </div>
  );
};

export default DeductCrypto;
