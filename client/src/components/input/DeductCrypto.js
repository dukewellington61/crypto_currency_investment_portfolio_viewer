import React, { Fragment, useState, useEffect } from "react";
import RemoveCryptoQuery from "../layout/RemoveCryptoQuery";
import { Link } from "react-router-dom";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrenciesNames } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValue } from "../../auxiliary/auxiliaryCryptoData";
import { convertFiat } from "../../auxiliary/auxiliaryFiatData";

const DeductCrypto = ({
  user,
  currencyNames,
  makePosition,
  loadUserObj,
  setUser,
  triggerAlert,
  setCurrencyNames,
}) => {
  let [formData, setFormData] = useState({
    crypto_currency: "",
    amount: "",
    date_of_purchase: "",
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { crypto_currency, amount, date_of_purchase } = formData;

  const [renderSafetyQuery, setRenderSafetyQuery] = useState(false);

  const removeSavetyQuery = () => setRenderSafetyQuery(false);

  // const [currencyNames, setCurrencyNames] = useState([]);

  // useEffect(() => {
  //   const namesArr = getCurrenciesNames(user);
  //   namesArr.unshift("");
  //   setCurrencyNames(namesArr);
  // }, []);

  const [currency, setCurrency] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    // user input validation
    if (!crypto_currency) {
      triggerAlert("Please select a cryptocurrency", "danger");
      return;
    }

    const currentAmount = getAmount(user, crypto_currency);

    if (amount > currentAmount) {
      triggerAlert(
        `You currently have only ${currentAmount} unit(s) of this currency`,
        "danger"
      );
      return;
    }

    // sets selected currency to useState so it can be used in child component (onSubmit sets it back to blank)
    setCurrency(crypto_currency);

    // renders overlay with safety query if user reduces amount of a currency to 0 (which will remove that currency from portfolio)
    // in that case rest of code in onSubmit function doesn't execute
    if (parseFloat(amount) === currentAmount) {
      setRenderSafetyQuery(true);
      return;
    }

    // value of the amount (in fiat) to be deducted from the amount of a crypto currency in the portfolio is calculated based on the median value
    // of all positions of this currency
    const median_price_currency_positions =
      getInitialValue(user, crypto_currency, { current: "EUR" }) /
      getAmount(user, crypto_currency);

    // calculates the actual value of the deductable amount
    const deductable_value = median_price_currency_positions * amount;

    // returns an object which has actual value of deductable amount in EUR, USD and GBP
    const convertObject = await convertFiat(
      deductable_value,
      "EUR",
      date_of_purchase,
      triggerAlert
    );

    // actual value of deductable amount is turned into negative
    for (let [key, value] of Object.entries(convertObject)) {
      convertObject[key] = value * -1;
    }
    // sets content of convertObject which is the negtive value of deductable amount for attributes EUR, USD and GBP to the formData Object
    formData = Object.assign(formData, convertObject);

    // amount is beeing turned into negative so the corresponding position has a negative amount property
    formData.amount = parseFloat(formData.amount) * -1;

    await makePosition(formData);

    // sets form fields back to blank
    makeBlankForm();

    // reloads user object which is now updated with the deductable position
    loadUserObj();
  };

  const makeBlankForm = () =>
    setFormData({
      crypto_currency: "",
      amount: "",
      date_of_purchase: "",
    });

  return (
    <Fragment>
      <div style={{ display: renderSafetyQuery ? "block" : "none" }}>
        <RemoveCryptoQuery
          user={user}
          currency={currency}
          currencyNames={currencyNames}
          setUser={setUser}
          removeSavetyQuery={removeSavetyQuery}
          triggerAlert={triggerAlert}
          makeBlankForm={makeBlankForm}
          setCurrencyNames={setCurrencyNames}
        />
      </div>
      <div id="toggle_view_ledger">
        <Link to="/">
          <i class="fas fa-angle-double-left"></i> back to overview
        </Link>
      </div>
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
                  className="btn btn-outline-secondary"
                  name="crypto_currency"
                  style={{ position: "absolute", right: "0", width: "50%" }}
                  onChange={(e) => onChange(e)}
                >
                  <option value={""}>{""}</option>
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
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <input type="submit" className="btn btn-primary" value="Deduct" />
        </form>
      </div>
    </Fragment>
  );
};

export default DeductCrypto;
