import React, { Fragment, useState, useEffect } from "react";
import { getMarketChartsCrypto } from "../../actions/currencies";
import { cumulativeValueInvestment } from "../../auxiliary/auxiliaryCryptoData";
import CurrencyTotalChartDiagram from "./CurrencyTotalChartDiagram";
import { useLocation } from "react-router-dom";

const CurrencyTotalChart = ({ user, cryptoCurrencies, logedin }) => {
  const currency = sessionStorage.getItem("crypto_currency");

  const data = useLocation();

  const [marketChart, setMarketChart] = useState([]);

  const [currencyTotal, setCurrencyTotal] = useState({});

  useEffect(() => {
    const updateState = async () => {
      if (logedin && cryptoCurrencies.data) {
        // getCryptoCurrentDataObj() retrieves currency object from props.cryptoCurrencies
        // the price attribute in this object is passed as parameter to getMarketChartsCrypto()
        const getCryptoCurrentDataObj = (currency) => {
          let currencyObj = {};
          cryptoCurrencies.data.forEach((obj) => {
            if (obj.id === currency) currencyObj = obj;
          });
          return currencyObj;
        };

        const fromdate = "all_currency";

        const chartData = await getMarketChartsCrypto(
          user,
          currency,
          getCryptoCurrentDataObj(currency).current_price,
          fromdate
        );
        setMarketChart(chartData);

        setCurrencyTotal(
          cumulativeValueInvestment(user.positions, chartData, currency)
        );
      }
    };

    updateState();
  }, [user, cryptoCurrencies, logedin]);

  return marketChart.length === 0 ? (
    <div>Loading ...</div>
  ) : (
    <div>
      <Fragment>
        <CurrencyTotalChartDiagram
          currencyTotal={currencyTotal}
          currency={currency}
          fiat={user.positions[0].fiat_currency}
          origin={data.state.origin}
        />
      </Fragment>
    </div>
  );
};
export default CurrencyTotalChart;
