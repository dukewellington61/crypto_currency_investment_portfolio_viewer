import React, { Fragment, useState } from "react";
import { getMarketChartsCrypto2 } from "../../actions/currencies";
import { getCurrenciesNames } from "../../auxiliary/auxiliaryCryptoData";
import Overview from "../overview/Overview";
import TotalChart from "../charts/TotalChart";

function Landing({ user, cryptoCurrencies, logedin, triggerAlert }) {
  const [renderOverview, setRenderOverview] = useState(true);
  const [renderTotalChart, setRenderTotalChart] = useState(false);

  const toggleView = () => {
    if (renderOverview) {
      setRenderOverview(false);
      setRenderTotalChart(true);
      return;
    } else {
      setRenderOverview(true);
      setRenderTotalChart(false);
    }
  };

  const [originAndCurrency, setOriginAndCurency] = useState([]);

  const updateOriginAndCurrencyState = (origin, currency) =>
    setOriginAndCurency([origin, currency]);

  const [marketChartTotal, setMarketChartTotal] = useState({});
  const [marketChartDay, setMarketChartDay] = useState({});
  const [marketChartWeek, setMarketChartWeek] = useState({});
  const [marketChartMonth, setMarketChartMonth] = useState({});
  const [currentMarketChart, setCurrentMarketChart] = useState({});

  const [loaded, setLoaded] = useState(false);

  const isEmpty = (obj) => Object.keys(obj).length === 0;

  const upDateMarketChartState = (duration) => {
    switch (duration) {
      case "all_total":
        isEmpty(marketChartTotal)
          ? loadChartData(duration)
          : setCurrentMarketChart(marketChartTotal);
        break;
      case "day":
        isEmpty(marketChartDay)
          ? loadChartData(duration)
          : setCurrentMarketChart(marketChartDay);
        break;
      case "week":
        isEmpty(marketChartWeek)
          ? loadChartData(duration)
          : setCurrentMarketChart(marketChartWeek);
        break;
      case "month":
        isEmpty(marketChartMonth)
          ? loadChartData(duration)
          : setCurrentMarketChart(marketChartMonth);
        break;
      default:
    }

    function loadChartData(duration) {
      setLoaded(false);
      let currenciesObject = {};
      const currencyNamesArr = getCurrenciesNames(user);

      // api request is beeing conducted in accordance with the number of currencies
      // if successful the retured data is beeing stored as arrays in currenciesObject (key = currencyName, value = array)
      // if the number of attributes matches the number of currencies marketCharts and loaded state are updated
      // if an error is returned by api the state loaded is set to true (so the empty diagram is beeing displayed) and an error message appears
      currencyNamesArr.forEach(async (currencyName) => {
        let currentPrice = 0;
        cryptoCurrencies.data.forEach((obj) => {
          if (obj.id === currencyName) currentPrice = obj.current_price;
        });
        const res = await getMarketChartsCrypto2(
          user,
          currencyName,
          currentPrice,
          duration
        );

        if (res instanceof Error) {
          setLoaded(true);
          res.response
            ? triggerAlert(res.response.data)
            : triggerAlert("something went wrong");

          // this makes sure that currenciesObject only gets attributes if no error occurs so those attributes are proper arrays
          // otherwhise attributes are non iterable error objects -> a arr.forEach() will throw an exception later in the code and break the app
          // if api returns errors, currenciesObject remains incomplete and marketCharts state will not be updated
          // so after the arr.forEach() is done marketCharts state either has valid data or is an empty object (which results in an empty diagram)
        } else {
          currenciesObject[currencyName] = res;
          if (
            Object.keys(currenciesObject).length === currencyNamesArr.length
          ) {
            switch (duration) {
              case "all_total":
                setMarketChartTotal(currenciesObject);
                break;
              case "day":
                setMarketChartDay(currenciesObject);
                break;
              case "week":
                setMarketChartWeek(currenciesObject);
                break;
              case "month":
                setMarketChartMonth(currenciesObject);
                break;
              default:
            }

            setCurrentMarketChart(currenciesObject);

            setLoaded(true);
          }
        }
      });
    }
  };

  return (
    <Fragment>
      {renderOverview && (
        <Overview
          user={user}
          cryptoCurrencies={cryptoCurrencies}
          marketChartTotal={marketChartTotal}
          logedin={logedin}
          toggleView={toggleView}
          renderOverview={renderOverview}
          updateOriginAndCurrencyState={updateOriginAndCurrencyState}
        />
      )}
      {renderTotalChart && (
        <TotalChart
          user={user}
          currentMarketChart={currentMarketChart}
          logedin={logedin}
          triggerAlert={triggerAlert}
          toggleView={toggleView}
          originAndCurrency={originAndCurrency}
          loaded={loaded}
          logedin={logedin}
          upDateMarketChartState={upDateMarketChartState}
        />
      )}
    </Fragment>
  );
}

export default Landing;
