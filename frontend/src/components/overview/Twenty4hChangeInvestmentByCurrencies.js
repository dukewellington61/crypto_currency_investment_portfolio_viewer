import React from "react";

const Twenty4hChangeInvestmentByCurrencies = ({
  user,
  cryptoCurrencies,
  getAmount,
  get24hourChangeByCurrency,
  getCurrentValue,
  currencyName,
  fiatSymbol,
}) => {
  const get24hourMax = () => {
    let returnValue = 0;
    if (cryptoCurrencies && cryptoCurrencies.data) {
      cryptoCurrencies.data.forEach((el) => {
        if (el.id === currencyName) {
          returnValue = el.high_24h;
        }
      });
    }

    return returnValue;
  };

  const get24hourMin = () => {
    let returnValue = 0;
    if (cryptoCurrencies && cryptoCurrencies.data) {
      cryptoCurrencies.data.forEach((el) => {
        if (el.id === currencyName) {
          returnValue = el.low_24h;
        }
      });
    }
    return returnValue;
  };
  return (
    <div className="twenty_four_hour_container">
      <div
        style={{
          color:
            (get24hourChangeByCurrency(currencyName) *
              getCurrentValue(user, cryptoCurrencies, currencyName)) /
              100 >
            0
              ? "green"
              : "red",
        }}
      >
        24h change:{" "}
        {(
          (get24hourChangeByCurrency(currencyName) *
            getCurrentValue(user, cryptoCurrencies, currencyName)) /
          100
        ).toFixed(2)}{" "}
        {fiatSymbol.current}
      </div>
      <div>
        24h max:{" "}
        {(get24hourMax(currencyName) * getAmount(user, currencyName)).toFixed(
          2
        )}{" "}
        {fiatSymbol.current}
      </div>
      <div>
        24h min:{" "}
        {(get24hourMin(currencyName) * getAmount(user, currencyName)).toFixed(
          2
        )}{" "}
        {fiatSymbol.current}
      </div>
    </div>
  );
};

export default Twenty4hChangeInvestmentByCurrencies;
