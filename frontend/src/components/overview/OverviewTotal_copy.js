import React, { useState, useEffect, useRef } from "react";
import SparkLine from "../charts/SparkLine";
import Twenty4hChangeInvestmentTotal from "./Twenty4hChangeInvestmentTotal";
import { getFiatExchangeRates } from "../../actions/currencies";

const OverviewTotal = ({
  user,
  cryptoCurrencies,
  totalPurchase,
  currentValueTotal,
  prevCurrentValueTotal,
  fiat,
  get24hourChangeTotal,
  handleClick,
}) => {
  // both hooks are neccessary to persist change currentValueTotal so it survives re mounting of this component
  const [currentValueTotalChange, setCurrentValueTotalChange] = useState(
    sessionStorage.getItem("change")
  );

  // const prevFiat = useRef("");

  // useEffect(() => {
  //   console.log("useEffect");
  //   prevFiat.current = fiat.current;
  // }, [fiat.current]);

  useEffect(() => {
    const calcChange = async () => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      const date = yyyy + "-" + mm + "-" + dd;
      const exchangeObj = await getFiatExchangeRates(date);

      // switch (fiat.current) {
      //   case "EUR":
      //     break;
      //   case "USD":
      //     prevCurrentValueTotal.current *= exchangeObj.data.rates.USD;

      //     break;
      //   case "GBP":
      //     prevCurrentValueTotal.current *= 1 / exchangeObj.data.rates.GBR;
      //     break;
      //   default:
      //     return;
      // }

      console.log("currentValueTotal");
      console.log(currentValueTotal);
      console.log("prevCurrentValueTotal.current");
      console.log(prevCurrentValueTotal.current);

      const change = (
        currentValueTotal - prevCurrentValueTotal.current
      ).toFixed(2);

      // makes sure that session storage and state are only updated if it is not a re mount
      if (!isNaN(change) && prevCurrentValueTotal.current !== 0) {
        sessionStorage.setItem("change", change);
        setCurrentValueTotalChange(change);
      }
    };
    calcChange();
  }, [currentValueTotal]);

  return (
    <tr id="overview_total">
      <th scope="row"></th>

      <td></td>

      {/* initial value */}
      <td onClick={() => handleClick("initial_value", "all_currencies")}>
        {totalPurchase.toFixed(2)}&euro;
      </td>

      {/* current value */}
      <td onClick={() => handleClick("current_value", "all_currencies")}>
        <div className="change_container">
          <div>{currentValueTotal.toFixed(2)}&euro;</div>
          <div
            className="change_value"
            style={{
              color: currentValueTotalChange >= 0 ? "green" : "red",
            }}
          >
            {currentValueTotalChange && currentValueTotalChange !== 0
              ? currentValueTotalChange
              : 0}
            &euro;
          </div>
        </div>

        <Twenty4hChangeInvestmentTotal
          get24hourChangeTotal={get24hourChangeTotal}
        />
      </td>

      {/* profit */}
      <td onClick={() => handleClick("balance", "all_currencies")}>
        {(currentValueTotal - totalPurchase).toFixed(2)}&euro;
      </td>

      {/* roi */}
      <td onClick={() => handleClick("roi", "all_currencies")}>
        <div className="x_container">
          <div>
            {((currentValueTotal * 100) / totalPurchase - 100).toFixed(0)}%
          </div>
          <div className="x_value">
            ({(currentValueTotal / totalPurchase).toFixed(1)}
            x)
          </div>
        </div>
      </td>

      {/* sparkline */}
      <td>
        <SparkLine user={user} cryptoCurrencies={cryptoCurrencies} />
      </td>
    </tr>
  );
};

export default OverviewTotal;
