import React, { useState, useEffect } from "react";
import Twenty4hChangeInvestmentByCurrencies from "./Twenty4hChangeInvestmentByCurrencies";
import Twenty4hChangeByCurrency from "./Twenty4hChangeByCurrency";
import SparkLine from "../charts/SparkLine";
import { Link } from "react-router-dom";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentPrice } from "../../auxiliary/auxiliaryCryptoData";

const OverviewCurrencies = ({
  user,
  cryptoCurrencies,
  currencyNamesAndCurrentValues,
  prevCurrentValues,
  logedin,
  fiat,
  getInitialValue,
  get24hourChangeByCurrency,
  getCurrentValue,
  handleClick,
}) => {
  console.log("fiat");
  console.log(fiat.current);
  // both hooks are neccessary to persist change currentValues so they survive re mounting of this component
  const [currentValuesChange, setCurrentValuesChange] = useState(
    sessionStorage.getItem("changeObj")
  );

  useEffect(() => {
    const changeObj = {};
    currencyNamesAndCurrentValues.forEach(([currencyName, currentValue]) => {
      const change = currentValue - prevCurrentValues.current[currencyName];
      changeObj[currencyName] = change;
    });

    // makes sure that session storage and state are only updated if it is not a re mount
    if (
      !sessionStorage.getItem("changeObj") ||
      !isNaN(Object.values(changeObj)[0])
    ) {
      sessionStorage.setItem("changeObj", JSON.stringify(changeObj));
      setCurrentValuesChange(JSON.stringify(changeObj));
    }
  }, [currencyNamesAndCurrentValues]);

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
                  {currencyName}{" "}
                  <Twenty4hChangeByCurrency
                    cryptoCurrencies={cryptoCurrencies}
                    currencyName={currencyName}
                  />
                </th>
              </Link>

              {/* amount */}
              <td>{getAmount(user, currencyName).toFixed(3)}</td>

              {/* initial value */}
              <td onClick={() => handleClick("initial_value", currencyName)}>
                {getInitialValue(user, currencyName, fiat).toFixed(2)}&euro;
              </td>

              {/* current value */}
              <td onClick={() => handleClick("current_value", currencyName)}>
                <div className="change_container">
                  {" "}
                  {currentValue.toFixed(2)}
                  &euro;
                  <div
                    className="change_value"
                    style={{
                      color:
                        JSON.parse(currentValuesChange)[currencyName] >= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {Object.keys(JSON.parse(currentValuesChange)).length > 0 &&
                    JSON.parse(currentValuesChange)[currencyName] &&
                    JSON.parse(currentValuesChange)[currencyName] !== null &&
                    JSON.parse(currentValuesChange)[currencyName] !== 0
                      ? JSON.parse(currentValuesChange)[currencyName].toFixed(2)
                      : Number(0).toFixed(2)}
                    &euro;
                  </div>
                </div>

                <Twenty4hChangeInvestmentByCurrencies
                  user={user}
                  cryptoCurrencies={cryptoCurrencies}
                  getAmount={getAmount}
                  get24hourChangeByCurrency={get24hourChangeByCurrency}
                  getCurrentValue={getCurrentValue}
                  currencyName={currencyName}
                />
              </td>

              {/* profit */}
              <td onClick={() => handleClick("balance", currencyName)}>
                {getBalance(currencyName).toFixed(2)}&euro;
              </td>

              {/* roi */}
              <td onClick={() => handleClick("roi", currencyName)}>
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
