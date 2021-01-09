import React, { useState, useEffect, useRef } from "react";
import OverviewCurrencies from "./OverviewCurrencies";
import OverviewTotal from "./OverviewTotal";
import { getNamesAndCurrentValues } from "../../auxiliary/auxiliaryCryptoData";
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
  const [
    currencyNamesAndCurrentValues,
    setCurrencyNamesAndCurrentValues,
  ] = useState([]);

  const [currentValueTotal, setCurrentValueTotal] = useState(0);

  const [totalPurchase, setTotalPurchase] = useState(0);

  useEffect(() => {
    if (logedin) {
      const namesAndCurrentValuesArr = getNamesAndCurrentValues(
        user,
        cryptoCurrencies
      );

      setCurrencyNamesAndCurrentValues(namesAndCurrentValuesArr);

      const totalsArray = namesAndCurrentValuesArr.map((el) =>
        getCurrentValue(user, cryptoCurrencies, el[0])
      );

      setCurrentValueTotal(totalsArray.reduce((a, b) => a + b, 0));

      setTotalPurchase(getInitialValuePurchase());
    }
  }, [user, cryptoCurrencies, logedin, renderOverview]);

  // useRef preserve previous currentValue over re-render
  const prevCurrentValueTotal = useRef(0);

  const prevCurrentValues = useRef({});

  useEffect(() => {
    prevCurrentValueTotal.current = currentValueTotal;

    currencyNamesAndCurrentValues.map((el) => {
      const currVal = getCurrentValue(user, cryptoCurrencies, el[0]);
      prevCurrentValues.current[el[0]] = currVal;
    });
  }, [currentValueTotal]);

  const getInitialValuePurchase = () => {
    let sum = 0;
    if (user) user.positions.forEach((position) => (sum += position.price));
    return sum;
  };

  const get24hourChangeByCurrency = (currencyName) => {
    let returnValue = 0;

    if (cryptoCurrencies.data) {
      cryptoCurrencies.data.forEach((el) => {
        if (el.id === currencyName) {
          returnValue = el.price_change_percentage_24h;
        }
      });
    }
    return returnValue;
  };

  const get24hourChangeTotal = () => {
    let sum = 0;
    currencyNamesAndCurrentValues.forEach((arr) => {
      sum +=
        (get24hourChangeByCurrency(arr[0]) *
          getCurrentValue(user, cryptoCurrencies, arr[0])) /
        100;
    });

    return sum;
  };

  const handleClick = (origin, currency) => {
    toggleView();
    updateOriginAndCurrencyState(origin, currency);
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
            <th scope="col">Last 7 Days</th>
          </tr>
        </thead>
        <OverviewCurrencies
          user={user}
          cryptoCurrencies={cryptoCurrencies}
          currencyNamesAndCurrentValues={currencyNamesAndCurrentValues}
          prevCurrentValues={prevCurrentValues}
          getInitialValue={getInitialValue}
          get24hourChangeByCurrency={get24hourChangeByCurrency}
          getCurrentValue={getCurrentValue}
          handleClick={handleClick}
          logedin={logedin}
        />
        <OverviewTotal
          totalPurchase={totalPurchase}
          currentValueTotal={currentValueTotal}
          prevCurrentValueTotal={prevCurrentValueTotal}
          get24hourChangeTotal={get24hourChangeTotal}
          handleClick={handleClick}
        />
      </table>
    </div>
  );
};

export default Overview;
