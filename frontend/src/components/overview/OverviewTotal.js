import React, { useState, useEffect } from "react";
import SparkLine from "../charts/SparkLine";
import Twenty4hChangeInvestmentTotal from "./Twenty4hChangeInvestmentTotal";

const OverviewTotal = ({
  user,
  cryptoCurrencies,
  totalPurchase,
  currentValueTotal,
  prevCurrentValueTotal,
  get24hourChangeTotal,
  handleClick,
}) => {
  // both hooks are neccessary to persist change currentValueTotal so it survives re mounting of this component
  const [currentValueTotalChange, setCurrentValueTotalChange] = useState(
    sessionStorage.getItem("change")
  );

  useEffect(() => {
    const change = (currentValueTotal - prevCurrentValueTotal.current).toFixed(
      2
    );
    // makes sure that session storage and state are only updated if it is not a re mount
    if (!isNaN(change) && prevCurrentValueTotal.current !== 0) {
      sessionStorage.setItem("change", change);
      setCurrentValueTotalChange(change);
    }
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
