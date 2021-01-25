import React, { Fragment, useState, useEffect, useCallback } from "react";
import { getMarketChartsCrypto2 } from "../../actions/currencies";
import { getCurrenciesNames } from "../../auxiliary/auxiliaryCryptoData";
import Overview from "../overview/Overview";
import TotalChart from "../charts/TotalChart";

function Landing({
  user,
  cryptoCurrencies,
  exchangeRates,
  logedin,
  fiat,
  fiatSymbol,
  triggerAlert,
}) {
  const [renderOverview, setRenderOverview] = useState(true);
  const [renderTotalChart, setRenderTotalChart] = useState(false);

  const toggleView = useCallback(() => {
    if (renderOverview) {
      setRenderOverview(false);
      setRenderTotalChart(true);
      return;
    } else {
      setRenderOverview(true);
      setRenderTotalChart(false);
    }
  }, [renderOverview]);

  const [origin, setOrigin] = useState("");
  const [currency, setCurrency] = useState("");
  const [originAndCurrency, setOriginAndCurency] = useState([]);

  const updateOriginAndCurrencyState = useCallback((origin, currency) => {
    setOrigin(origin);
    setCurrency(currency);
    setOriginAndCurency([origin, currency]);
  }, []);

  // on click duration (day, week, etc.) in @components/charts/TotalChart.js originAndCurrency is updated
  // currency in originAndCurrency state gets _fiat.current appendix
  // in order to update originAndCurrency state also on switch fiat the following useEffect hook is employed
  // currency needs correct fiat.current appendix for cumulativeValueInvestment() @auxiliary/auxiliaryCryptoData.js to work properly
  useEffect(() => {
    if (currency !== "all_currencies") {
      const curr = currency.split("_")[0];
      setOriginAndCurency([origin, curr + "_" + fiat.current]);
    }
  }, [fiat.current]);

  const [marketChartTotal, setMarketChartTotal] = useState({});
  const [marketChartDay, setMarketChartDay] = useState({});
  const [marketChartWeek, setMarketChartWeek] = useState({});
  const [marketChartMonth, setMarketChartMonth] = useState({});
  const [currentMarketChart, setCurrentMarketChart] = useState({});

  const [loaded, setLoaded] = useState(false);

  const isEmpty = (obj) => Object.keys(obj).length === 0;

  const objIncludesFiat = (obj) => {
    let returnValue = "";
    Object.keys(obj).forEach((el) => {
      if (el.includes(fiat.current)) {
        returnValue = true;
        return;
      }
    });
    // console.log(returnValue);
    return returnValue;
  };

  const retrieveAttributesFromObject = (obj) => {
    const returnObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.includes(fiat.current)) returnObj[key] = value;
    }
    return returnObj;
  };

  const upDateMarketChartState = (duration) => {
    // console.log("upDateMarketChartState");
    switch (duration) {
      case "all":
        // console.log(marketChartTotal);
        isEmpty(marketChartTotal) || !objIncludesFiat(marketChartTotal)
          ? loadChartData(duration)
          : setCurrentMarketChart(
              retrieveAttributesFromObject(marketChartTotal)
            );
        // console.log(marketChartTotal);
        break;
      case "day":
        isEmpty(marketChartDay) || !objIncludesFiat(marketChartDay)
          ? loadChartData(duration)
          : setCurrentMarketChart(retrieveAttributesFromObject(marketChartDay));
        // console.log(marketChartDay);
        break;
      case "week":
        isEmpty(marketChartWeek) || !objIncludesFiat(marketChartWeek)
          ? loadChartData(duration)
          : setCurrentMarketChart(
              retrieveAttributesFromObject(marketChartWeek)
            );
        break;
      case "month":
        isEmpty(marketChartMonth) || !objIncludesFiat(marketChartMonth)
          ? loadChartData(duration)
          : setCurrentMarketChart(
              retrieveAttributesFromObject(marketChartMonth)
            );
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
          fiat,
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
          currenciesObject[currencyName + "_" + fiat.current] = res;
          if (
            Object.keys(currenciesObject).length === currencyNamesArr.length
          ) {
            switch (duration) {
              case "all":
                setMarketChartTotal(
                  Object.assign(marketChartTotal, currenciesObject)
                );
                break;
              case "day":
                setMarketChartDay(
                  Object.assign(marketChartDay, currenciesObject)
                );
                break;
              case "week":
                setMarketChartWeek(
                  Object.assign(marketChartWeek, currenciesObject)
                );

                break;
              case "month":
                setMarketChartMonth(
                  Object.assign(marketChartMonth, currenciesObject)
                );
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
          exchangeRates={exchangeRates}
          logedin={logedin}
          fiat={fiat}
          fiatSymbol={fiatSymbol}
          renderOverview={renderOverview}
          updateOriginAndCurrencyState={updateOriginAndCurrencyState}
          toggleView={toggleView}
        />
      )}
      {renderTotalChart && (
        <TotalChart
          user={user}
          cryptoCurrencies={cryptoCurrencies}
          currentMarketChart={currentMarketChart}
          logedin={logedin}
          triggerAlert={triggerAlert}
          toggleView={toggleView}
          originAndCurrency={originAndCurrency}
          loaded={loaded}
          logedin={logedin}
          fiat={fiat}
          fiatSymbol={fiatSymbol}
          upDateMarketChartState={upDateMarketChartState}
        />
      )}
    </Fragment>
  );
}

export default Landing;
