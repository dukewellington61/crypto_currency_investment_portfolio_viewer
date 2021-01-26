import React from "react";
import { getImage } from "../../auxiliary/auxiliaryCryptoData";

const CurrencyLogos = ({ cryptoCurrencies, currency, origin }) => {
  return Object.keys(cryptoCurrencies).length === 0 ? (
    <div>...Loading</div>
  ) : (
    <div
      id={
        origin === "OverviewTotal"
          ? "currency_logo_charts_container_overview_total"
          : "currency_logo_charts_container"
      }
    >
      {currency === "all_currencies" ? (
        cryptoCurrencies.data.map((obj) => {
          return (
            <img
              className="currency_logo_charts"
              src={obj.image}
              alt={currency}
            ></img>
          );
        })
      ) : (
        <img
          className="currency_logo_charts"
          src={getImage(cryptoCurrencies, currency.split("_")[0])}
          alt={currency}
        ></img>
      )}
      <div id="currency_name_chart">
        {currency === "all_currencies"
          ? ""
          : currency.charAt(0).toUpperCase() + currency.slice(1).split("_")[0]}
      </div>
    </div>
  );
};

export default CurrencyLogos;
