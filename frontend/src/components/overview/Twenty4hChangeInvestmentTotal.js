import React from "react";

const Twenty4hChangeInvestmentTotal = ({
  marketChartTotal,
  get24hourChangeTotal,
}) => {
  const get24hourMax = () => {};
  return (
    <div className="twenty_four_hour_container">
      <div
        style={{
          color: get24hourChangeTotal() > 0 ? "green" : "red",
        }}
      >
        24h change: {get24hourChangeTotal().toFixed(2)}
        &euro;
      </div>
      <div>{get24hourMax()}</div>
    </div>
  );
};

export default Twenty4hChangeInvestmentTotal;
