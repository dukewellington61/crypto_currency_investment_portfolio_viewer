import React from "react";
import Twenty4hChangeInvestmentTotal from "./Twenty4hChangeInvestmentTotal";

const OverviewTotal = ({
  marketChartTotal,
  totalPurchase,
  currentValueTotal,
  get24hourChangeTotal,
  handleClick,
}) => {
  return (
    <tr>
      <th scope="row"></th>
      <td></td>
      <td onClick={() => handleClick("initial_value", "all_currencies")}>
        {totalPurchase.toFixed(2)}&euro;
      </td>
      <td onClick={() => handleClick("current_value", "all_currencies")}>
        {currentValueTotal.toFixed(2)}&euro;
        <Twenty4hChangeInvestmentTotal
          marketChartTotal={marketChartTotal}
          get24hourChangeTotal={get24hourChangeTotal}
        />
      </td>
      <td onClick={() => handleClick("balance", "all_currencies")}>
        {(currentValueTotal - totalPurchase).toFixed(2)}&euro;
      </td>
      <td onClick={() => handleClick("roi", "all_currencies")}>
        {((currentValueTotal * 100) / totalPurchase - 100).toFixed(0)}%
      </td>
    </tr>
  );
};

export default OverviewTotal;
