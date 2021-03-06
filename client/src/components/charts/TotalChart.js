import React, { Fragment, useState, useEffect } from "react";
import TotalChartDiagramm from "./TotalChartDiagramm";
import ChangeMinMax from "./ChangeMinMax";
import CurrencyLogos from "../layout/CurrencyLogos";
// import { checkDuration } from "../../auxiliary/auxiliaryDateData";

const TotalChart = ({
  user,
  cryptoCurrencies,
  marketChartTotal,
  currentMarketChart,
  toggleView,
  originAndCurrency,
  loaded,
  upDateMarketChartState,
  logedin,
  fiat,
  fiatSymbol,
}) => {
  const [duration, setDuration] = useState("all");

  useEffect(() => {
    if (logedin) upDateMarketChartState(duration);
    // console.log("useEffect");
  }, [user, fiat.current]);

  const handleClick = (e) => {
    setDuration(e.target.innerHTML);
    upDateMarketChartState(e.target.innerHTML);
    // console.log(e.target.innerHTML);
    // console.log(duration);
  };

  const [resultArray, setResultArray] = useState([]);

  const updateResultArrayState = (arr) => setResultArray(arr);

  const [origin, currency] = originAndCurrency;

  // console.log(currency);

  return !loaded ? (
    <div>Loading ...</div>
  ) : (
    <div id="charts_container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div id="currency_logos">
          <CurrencyLogos
            cryptoCurrencies={cryptoCurrencies}
            currency={currency}
          />
        </div>
        <div
          id="toggle_view_charts"
          style={{ marginBottom: "2rem", marginRight: "1rem" }}
          onClick={toggleView}
        >
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-angle-double-left"></i> back to overview
          </button>
        </div>
      </div>

      <ChangeMinMax dataArray={resultArray} fiatSymbol={fiatSymbol} />
      <div id="total_chart_container">
        <div id="durations_container">
          <div
            id={duration === "day" && "duration"}
            className="durations"
            onClick={(e) => handleClick(e)}
          >
            day
          </div>
          <div
            id={duration === "week" && "duration"}
            className="durations"
            onClick={(e) => handleClick(e)}
            // style={{
            //   display: checkDuration(marketChartTotal) >= 7 ? "block" : "none",
            // }}
          >
            week
          </div>
          <div
            id={duration === "month" && "duration"}
            className="durations"
            onClick={(e) => handleClick(e)}
            // style={{
            //   display: checkDuration(marketChartTotal) >= 30 ? "block" : "none",
            // }}
          >
            month
          </div>
          <div
            id={duration === "all" && "duration"}
            className="durations"
            onClick={(e) => handleClick(e)}
          >
            all
          </div>
        </div>
        <div>
          <TotalChartDiagramm
            currentMarketChart={currentMarketChart}
            positions={user.positions}
            fiat={fiat}
            originAndCurrency={originAndCurrency}
            duration={duration}
            updateResultArrayState={updateResultArrayState}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalChart;
