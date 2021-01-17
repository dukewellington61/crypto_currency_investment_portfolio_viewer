import React from "react";

const Twenty4hChangeByCurrency = ({
  cryptoCurrencies,
  currencyName,
  fiatSymbol,
}) => {
  const get24hourChange = () => {
    let currPrice = 0;
    let priceChange24h = 0;
    let max24h = 0;
    let min24h = 0;
    if (cryptoCurrencies && cryptoCurrencies.data) {
      cryptoCurrencies.data.forEach((el) => {
        if (el.id === currencyName) {
          currPrice = el.current_price;
          priceChange24h = el.price_change_24h;
          max24h = el.high_24h;
          min24h = el.low_24h;
        }
      });
    }

    let returnObj = {};

    returnObj.current_price = currPrice;
    returnObj.price_change_24h = priceChange24h;
    returnObj.max_24h = max24h;
    returnObj.min_24h = min24h;

    return returnObj;
  };
  return (
    <div className="twenty_four_hour_container">
      <div className="crypto_24h_change">
        price: {get24hourChange().current_price.toFixed(2)} {fiatSymbol.current}
      </div>
      <div
        style={{
          color: get24hourChange().price_change_24h > 0 ? "green" : "red",
        }}
      >
        24h change: {get24hourChange().price_change_24h.toFixed(2)}{" "}
        {fiatSymbol.current}
      </div>
      <div className="crypto_24h_change">
        24h max: {get24hourChange().max_24h.toFixed(2)} {fiatSymbol.current}
      </div>
      <div className="crypto_24h_change">
        24h min: {get24hourChange().min_24h.toFixed(2)} {fiatSymbol.current}
      </div>
    </div>
  );
};

export default Twenty4hChangeByCurrency;
