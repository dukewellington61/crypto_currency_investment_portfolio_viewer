import React, { Fragment, useState, useEffect } from "react";
import { getMarketChartsCrypto } from "../../actions/currencies";
import { getCurrenciesNames } from "../../auxiliary/auxiliaryCryptoData";
import Overview from "../portfolio/Overview";
import TotalChart from "../portfolio/TotalChart";

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

  const [origin, setOrigin] = useState();

  const updateOriginState = (val) => setOrigin(val);

  const [marketCharts, setMarketCharts] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState("all_total");

  useEffect(() => {
    let currenciesObject = {};
    const currencyNamesArr = getCurrenciesNames(user);

    currencyNamesArr.forEach(async (currencyName) => {
      const res = await getMarketChartsCrypto(
        user,
        currencyName,
        marketCharts.current_price,
        duration
      );
      if (res instanceof Error) {
        triggerAlert("an error has occured while loading data");
      } else {
        currenciesObject[currencyName] = res;
      }
    });

    let currenciesObjectFullyLoaded = true;

    currencyNamesArr.forEach((currencyName) =>
      currenciesObject.hasOwnProperty(currencyName)
        ? null
        : (currenciesObjectFullyLoaded = false)
    );

    // console.log(currenciesObjectFullyLoaded);

    if (currenciesObjectFullyLoaded === false) {
      triggerAlert("data unavailable");
    } else {
      setMarketCharts(currenciesObject);
      setLoaded(true);
    }
  }, [user, cryptoCurrencies, logedin]);

  return (
    <Fragment>
      {renderOverview && (
        <Overview
          user={user}
          cryptoCurrencies={cryptoCurrencies}
          logedin={logedin}
          toggleView={toggleView}
          renderOverview={renderOverview}
          updateOriginState={updateOriginState}
        />
      )}
      {renderTotalChart && (
        <TotalChart
          user={user}
          marketCharts={marketCharts}
          cryptoCurrencies={cryptoCurrencies}
          logedin={logedin}
          triggerAlert={triggerAlert}
          toggleView={toggleView}
          origin={origin}
          loaded={loaded}
          duration={duration}
        />
      )}
    </Fragment>
  );
}

export default Landing;
