import React, { useState, useEffect } from "react";
import Twenty4hChangeInvestmentByCurrencies from "./Twenty4hChangeInvestmentByCurrencies";
import Twenty4hChangeByCurrency from "./Twenty4hChangeByCurrency";
import SparkLine from "../charts/SparkLine";
import { Link } from "react-router-dom";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentPrice } from "../../auxiliary/auxiliaryCryptoData";
import { getImage } from "../../auxiliary/auxiliaryCryptoData";
import { getAbbrevation } from "../../auxiliary/auxiliaryCryptoData";

const OverviewCurrencies = ({
  user,
  cryptoCurrencies,
  exchangeRates,
  currencyNamesAndCurrentValues,
  prevCurrentValues,
  logedin,
  fiat,
  prevFiat,
  fiatSymbol,
  getInitialValue,
  get24hourChangeByCurrency,
  getCurrentValue,
  handleClick,
}) => {
  // both hooks are neccessary to persist change currentValues so they survive re mounting of this component
  const [currentValuesChange, setCurrentValuesChange] = useState(
    sessionStorage.getItem("changeObj")
  );

  useEffect(() => {
    if (fiat.current === prevFiat.current) {
      const changeObj = {};
      currencyNamesAndCurrentValues.forEach(([currencyName, currentValue]) => {
        const change = currentValue - prevCurrentValues.current[currencyName];

        if (change !== 0) changeObj[currencyName] = change;
      });

      // makes sure that session storage and state are only updated if it is not a re mount
      if (
        !sessionStorage.getItem("changeObj") ||
        !isNaN(Object.values(changeObj)[0])
      ) {
        sessionStorage.setItem("changeObj", JSON.stringify(changeObj));
        setCurrentValuesChange(JSON.stringify(changeObj));
      }
    }
  }, [currencyNamesAndCurrentValues]);

  useEffect(() => {
    calcChange();
  }, [fiat.current]);

  // converts change current total into the selected fiat
  const calcChange = async () => {
    // switch from EUR to USD
    if (fiat.current === "USD" && prevFiat.current === "EUR") {
      if (exchangeRates.data) {
        // console.log("EUR to USD");
        const changeObj = {};
        currencyNamesAndCurrentValues.forEach(
          ([currencyName, currentValue]) => {
            if (currentValuesChange) {
              changeObj[currencyName] =
                JSON.parse(currentValuesChange)[currencyName] *
                exchangeRates.data.rates.USD;
            }
          }
        );

        setCurrentValuesChange(JSON.stringify(changeObj));
      }
    }

    // switch from USD to EUR
    if (fiat.current === "EUR" && prevFiat.current === "USD") {
      if (exchangeRates.data) {
        // console.log("USD to EUR");
        const changeObj = {};
        currencyNamesAndCurrentValues.forEach(
          ([currencyName, currentValue]) => {
            changeObj[currencyName] =
              JSON.parse(currentValuesChange)[currencyName] *
              (1 / exchangeRates.data.rates.USD);
          }
        );

        setCurrentValuesChange(JSON.stringify(changeObj));
      }
    }
  };

  const getBalance = (currency) =>
    getCurrentValue(user, cryptoCurrencies, currency) -
    getInitialValue(user, currency, fiat);

  return (
    <tbody>
      {logedin &&
        currencyNamesAndCurrentValues.map(([currencyName, currentValue]) => {
          return (
            <tr>
              {/* crypto */}
              <Link
                to={{
                  pathname: "/position",
                  current_price: getCurrentPrice(
                    cryptoCurrencies,
                    currencyName
                  ),
                  state: {
                    currency: currencyName,
                    user: user,
                  },
                }}
              >
                <th scope="row">
                  <div className="overview_name_container">
                    {Object.keys(cryptoCurrencies).length === 0 ? (
                      <i
                        className="fa fa-spinner fa-spin"
                        style={{ fontSize: "1.5rem" }}
                      />
                    ) : (
                      <img
                        className="crypto_image"
                        src={getImage(cryptoCurrencies, currencyName)}
                        alt={currencyName}
                      />
                    )}
                    <div className="crypto_name">
                      {currencyName.charAt(0).toUpperCase() +
                        currencyName.slice(1)}{" "}
                    </div>
                    <div className="crypto_abbreviation">
                      ({getAbbrevation(cryptoCurrencies, currencyName)})
                    </div>
                  </div>
                  <Twenty4hChangeByCurrency
                    cryptoCurrencies={cryptoCurrencies}
                    currencyName={currencyName}
                    fiatSymbol={fiatSymbol}
                  />
                </th>
              </Link>

              {/* amount */}
              <td>{getAmount(user, currencyName).toFixed(2)}</td>
              {/* initial value */}
              <td
                className="clickable"
                onClick={() => handleClick("initial_value", currencyName)}
              >
                {
                  // getAmount(user, currencyName) *
                  getInitialValue(user, currencyName, fiat).toFixed(2)
                }{" "}
                {fiatSymbol.current}
              </td>
              {/* current value */}
              <td
                className="clickable"
                onClick={() => handleClick("current_value", currencyName)}
              >
                <div className="change_container">
                  {currentValue.toFixed(2)} {fiatSymbol.current}
                  {currentValuesChange && (
                    <div
                      className="change_value"
                      style={{
                        color:
                          currentValuesChange !== undefined &&
                          JSON.parse(currentValuesChange)[currencyName] >= 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {Object.keys(JSON.parse(currentValuesChange)).length >
                        0 &&
                      JSON.parse(currentValuesChange)[currencyName] &&
                      JSON.parse(currentValuesChange)[currencyName] !== null &&
                      JSON.parse(currentValuesChange)[currencyName] !== 0
                        ? JSON.parse(currentValuesChange)[currencyName].toFixed(
                            2
                          )
                        : Number(0).toFixed(2)}{" "}
                      {fiatSymbol.current}
                    </div>
                  )}
                </div>

                <Twenty4hChangeInvestmentByCurrencies
                  user={user}
                  cryptoCurrencies={cryptoCurrencies}
                  getAmount={getAmount}
                  get24hourChangeByCurrency={get24hourChangeByCurrency}
                  getCurrentValue={getCurrentValue}
                  currencyName={currencyName}
                  fiatSymbol={fiatSymbol}
                />
              </td>
              {/* profit */}
              <td
                className="clickable"
                onClick={() => handleClick("balance", currencyName)}
              >
                {getBalance(currencyName).toFixed(2)} {fiatSymbol.current}
              </td>
              {/* roi */}
              <td
                className="clickable"
                onClick={() => handleClick("roi", currencyName)}
              >
                <div className="x_container">
                  <div>
                    {(
                      (getCurrentValue(user, cryptoCurrencies, currencyName) *
                        100) /
                        getInitialValue(user, currencyName, fiat) -
                      100
                    ).toFixed(0)}
                    %
                  </div>
                  <div className="x_value">
                    (
                    {(
                      currentValue / getInitialValue(user, currencyName, fiat)
                    ).toFixed(1)}
                    x)
                  </div>
                </div>
              </td>
              {/* sparkline */}
              <td>
                <SparkLine
                  user={user}
                  cryptoCurrencies={cryptoCurrencies}
                  currencyName={currencyName}
                />
              </td>
            </tr>
          );
        })}
    </tbody>
  );
};

export default OverviewCurrencies;
