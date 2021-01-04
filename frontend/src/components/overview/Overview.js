import React, { useState, useEffect, useRef } from "react";
import OverviewCurrencies from "./OverviewCurrencies";
import OverviewTotal from "./OverviewTotal";
import { getNamesAndValues } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentValue } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValue } from "../../auxiliary/auxiliaryCryptoData";

const Overview = ({
  user,
  cryptoCurrencies,
  marketChartTotal,
  logedin,
  toggleView,
  renderOverview,
  updateOriginAndCurrencyState,
}) => {
  const [currencyNamesAndValues, setCurrencyNamesAndValues] = useState([]);

  const [currentValueTotal, setCurrentValueTotal] = useState(0);

  const [totalPurchase, setTotalPurchase] = useState(0);

  const prevCurrentValueTotal = useRef();

  useEffect(() => {
    if (logedin) {
      const namesAndValuesArr = getNamesAndValues(user, cryptoCurrencies);

      setCurrencyNamesAndValues(namesAndValuesArr);

      const totalsArray = namesAndValuesArr.map((el) =>
        getCurrentValue(user, cryptoCurrencies, el[0])
      );

      setCurrentValueTotal(totalsArray.reduce((a, b) => a + b, 0));

      setTotalPurchase(getInitialValuePurchase());

      prevCurrentValueTotal.current = currentValueTotal;
    }
  }, [user, cryptoCurrencies, logedin, renderOverview]);

  useEffect(() => {
    prevCurrentValueTotal.current = currentValueTotal;
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
    currencyNamesAndValues.forEach((arr) => {
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
          </tr>
        </thead>
        <OverviewCurrencies
          user={user}
          cryptoCurrencies={cryptoCurrencies}
          currencyNamesAndValues={currencyNamesAndValues}
          getInitialValue={getInitialValue}
          get24hourChangeByCurrency={get24hourChangeByCurrency}
          getCurrentValue={getCurrentValue}
          handleClick={handleClick}
          logedin={logedin}
        />
        <OverviewTotal
          marketChartTotal={marketChartTotal}
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
