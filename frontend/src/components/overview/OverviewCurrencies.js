import React, { useState, useEffect, useRef } from "react";
import Twenty4hChangeInvestmentByCurrencies from "./Twenty4hChangeInvestmentByCurrencies";
import Twenty4hChangeByCurrency from "./Twenty4hChangeByCurrency";

import { Link } from "react-router-dom";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentPrice } from "../../auxiliary/auxiliaryCryptoData";

const OverviewCurrencies = ({
  user,
  cryptoCurrencies,
  currencyNamesAndCurrentValues,
  prevCurrentValues,
  getInitialValue,
  get24hourChangeByCurrency,
  getCurrentValue,
  handleClick,
  logedin,
}) => {
  console.log(prevCurrentValues);
  // const prevCurrentValueTotal = useRef({});

  // useEffect(() => {
  //   currencyNamesAndCurrentValues.forEach((el) => {
  //     const currVal = getCurrentValue(user, cryptoCurrencies, el[0]);
  //     // prevCurrentValueTotal.current[el[0]] = currVal;
  //   });
  // }, [getCurrentValue]);

  const getBalance = (currency) =>
    getCurrentValue(user, cryptoCurrencies, currency) -
    getInitialValue(user, currency);

  return (
    <tbody>
      {logedin &&
        currencyNamesAndCurrentValues.map((el) => {
          return (
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
                <th scope="row">
                  {el[0]}{" "}
                  <Twenty4hChangeByCurrency
                    cryptoCurrencies={cryptoCurrencies}
                    currencyName={el[0]}
                  />
                </th>
              </Link>
              <td>{getAmount(user, el[0]).toFixed(3)}</td>
              <td onClick={() => handleClick("initial_value", el[0])}>
                {getInitialValue(user, el[0]).toFixed(2)}&euro;
              </td>
              {/* current value */}
              <td onClick={() => handleClick("current_value", el[0])}>
                {el[1].toFixed(2)}
                &euro;
                <div>
                  change:{" "}
                  {(el[1] - prevCurrentValues.current[el[0]]).toFixed(2)}
                </div>
                <Twenty4hChangeInvestmentByCurrencies
                  user={user}
                  cryptoCurrencies={cryptoCurrencies}
                  getAmount={getAmount}
                  get24hourChangeByCurrency={get24hourChangeByCurrency}
                  getCurrentValue={getCurrentValue}
                  currencyName={el[0]}
                />
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
          );
        })}
    </tbody>
  );
};

export default OverviewCurrencies;
