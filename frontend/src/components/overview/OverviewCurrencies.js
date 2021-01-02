import React from "react";
import Twenty4hChangeCurrencies from "./Twenty4hChangeCurrencies";
import { Link } from "react-router-dom";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentPrice } from "../../auxiliary/auxiliaryCryptoData";

const OverviewCurrencies = ({
  user,
  cryptoCurrencies,
  currencyNamesAndValues,
  getInitialValue,
  get24hourChangeByCurrency,
  getCurrentValue,
  handleClick,
  logedin,
}) => {
  const getBalance = (currency) =>
    getCurrentValue(user, cryptoCurrencies, currency) -
    getInitialValue(user, currency);

  return (
    <tbody>
      {logedin &&
        currencyNamesAndValues.map((el) => {
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
                <Twenty4hChangeCurrencies
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
