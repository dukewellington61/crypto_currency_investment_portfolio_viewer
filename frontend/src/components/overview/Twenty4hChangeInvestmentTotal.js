import React from "react";

const Twenty4hChangeInvestmentTotal = ({
  get24hourChangeTotal,
  fiatSymbol,
}) => {
  const get24hourMax = () => {};
  return (
    <div className="twenty_four_hour_container">
      <div
        style={{
          color: get24hourChangeTotal() > 0 ? "green" : "red",
        }}
      >
        24h change: {get24hourChangeTotal().toFixed(2)} {fiatSymbol.current}
      </div>
      <div>{get24hourMax()}</div>
    </div>
  );
};

export default Twenty4hChangeInvestmentTotal;
