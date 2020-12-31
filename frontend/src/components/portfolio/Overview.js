import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNamesAndValues } from "../../auxiliary/auxiliaryCryptoData";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentPrice } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentValue } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValue } from "../../auxiliary/auxiliaryCryptoData";

const Overview = ({
  user,
  cryptoCurrencies,
  logedin,
  toggleView,
  renderOverview,
  updateOriginAndCurrencyState,
}) => {
  const [currencyNamesAndValues, setCurrencyNamesAndValues] = useState([]);

  const [currentValueTotal, setCurrentValueTotal] = useState(0);

  const [totalPurchase, setTotalPurchase] = useState(0);

  useEffect(() => {
    if (logedin) {
      const namesAndValuesArr = getNamesAndValues(user, cryptoCurrencies);

      setCurrencyNamesAndValues(namesAndValuesArr);

      const totalsArray = namesAndValuesArr.map((el) =>
        getCurrentValue(user, cryptoCurrencies, el[0])
      );

      setCurrentValueTotal(totalsArray.reduce((a, b) => a + b, 0));

      setTotalPurchase(getInitialValuePurchase());
    }
  }, [user, cryptoCurrencies, logedin, renderOverview]);

  const getInitialValuePurchase = () => {
    let sum = 0;
    if (user) user.positions.forEach((position) => (sum += position.price));
    return sum;
  };

  const getBalance = (currency) =>
    getCurrentValue(user, cryptoCurrencies, currency) -
    getInitialValue(user, currency);

  const handleClick = (origin, currency) => {
    toggleView();
    updateOriginAndCurrencyState(origin, currency);
  };

  const get24hourChange = (currencyName) => {
    let returnValue = 0;
    // let sum = 0;
    if (cryptoCurrencies.data) {
      cryptoCurrencies.data.forEach((el) => {
        if (el.id === currencyName) {
          returnValue = el.price_change_percentage_24h;
          // sum +=
          //   (get24hourChange(currencyName) *
          //     getCurrentValue(user, cryptoCurrencies, currencyName)) /
          //   100;
        }
      });
    }

    let returnObj = {};
    returnObj.by_currency = returnValue;
    // returnObj.total = sum;
    return returnObj;
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Crypto</th>
            <th scope="col">Amount</th>
            <th scope="col">Initial Value</th>
            <th scope="col">Current Value</th>
            <th scope="col">Profit</th>
            <th scope="col">ROI</th>
          </tr>
        </thead>
        <tbody>
          {logedin &&
            currencyNamesAndValues.map((el) => (
              <tr>
                <Link
                  to={{
                    pathname: "/position",
                    current_price: getCurrentPrice(cryptoCurrencies, el[0]),
                    state: {
                      currency: el[0],
                      user: user,
                    },
                  }}
                >
                  <th scope="row">{el[0]}</th>
                </Link>
                <td>{getAmount(user, el[0]).toFixed(3)}</td>
                <td onClick={() => handleClick("initial_value", el[0])}>
                  {getInitialValue(user, el[0]).toFixed(2)}&euro;
                </td>
                <td onClick={() => handleClick("current_value", el[0])}>
                  {getCurrentValue(user, cryptoCurrencies, el[0]).toFixed(2)}
                  &euro;
                  <br />
                  <p
                    style={{
                      color:
                        (get24hourChange(el[0]).by_currency *
                          getCurrentValue(user, cryptoCurrencies, el[0])) /
                          100 >
                        0
                          ? "green"
                          : "red",
                    }}
                  >
                    24h:{" "}
                    {(
                      (get24hourChange(el[0]).by_currency *
                        getCurrentValue(user, cryptoCurrencies, el[0])) /
                      100
                    ).toFixed(2)}
                    &euro;
                  </p>
                </td>
                <td onClick={() => handleClick("balance", el[0])}>
                  {getBalance(el[0]).toFixed(2)}&euro;
                </td>
                <td onClick={() => handleClick("roi", el[0])}>
                  {(
                    (getCurrentValue(user, cryptoCurrencies, el[0]) * 100) /
                      getInitialValue(user, el[0]) -
                    100
                  ).toFixed(0)}
                  %
                </td>
              </tr>
            ))}
        </tbody>
        <tr>
          <th scope="row"></th>
          <td></td>
          <td onClick={() => handleClick("initial_value", "all_currencies")}>
            {totalPurchase.toFixed(2)}&euro;
          </td>
          <td onClick={() => handleClick("current_value", "all_currencies")}>
            {currentValueTotal.toFixed(2)}&euro;
            {/* <p
              style={{
                color: get24hourChange(el[0]).total > 0 ? "green" : "red",
              }}
            >
              24h: {get24hourChange(el[0]).total.toFixed(2)}
              &euro;
            </p> */}
          </td>
          <td onClick={() => handleClick("balance", "all_currencies")}>
            {(currentValueTotal - totalPurchase).toFixed(2)}&euro;
          </td>
          <td onClick={() => handleClick("roi", "all_currencies")}>
            {((currentValueTotal * 100) / totalPurchase - 100).toFixed(0)}%
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Overview;
