import React from "react";
import Twenty4hChangeInvestmentTotal from "./Twenty4hChangeInvestmentTotal";

const OverviewTotal = ({
  marketChartTotal,
  totalPurchase,
  currentValueTotal,
  prevCurrentValueTotal,
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{currentValueTotal.toFixed(2)}&euro;</div>{" "}
          <div
            style={{
              fontSize: "0.75rem",
              color:
                currentValueTotal - prevCurrentValueTotal.current >= 0
                  ? "green"
                  : "red",
            }}
          >
            {(currentValueTotal - prevCurrentValueTotal.current ===
            currentValueTotal
              ? 0
              : currentValueTotal - prevCurrentValueTotal.current
            ).toFixed(2)}
            &euro;
          </div>
        </div>

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
