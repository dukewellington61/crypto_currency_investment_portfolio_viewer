import React, { useState, useEffect } from "react";
import TotalChartDiagramm from "./TotalChartDiagramm";

const TotalChart = ({
  user,
  currentMarketChart,
  toggleView,
  originAndCurrency,
  loaded,
  upDateMarketChartState,
  logedin,
  fiat,
}) => {
  // console.log(currentMarketChart);

  const [duration, setDuration] = useState("all_total");

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

  return !loaded ? (
    <div>Loading ...</div>
  ) : (
    <div id="total_chart_container">
      <div id="toggle_view" onClick={toggleView}>
        go back
      </div>
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
        >
          week
        </div>
        <div
          id={duration === "month" && "duration"}
          className="durations"
          onClick={(e) => handleClick(e)}
        >
          month
        </div>
        <div
          id={duration === "all_total" && "duration"}
          className="durations"
          onClick={(e) => handleClick(e)}
        >
          all_total
        </div>
      </div>
      <div>
        <TotalChartDiagramm
          user={user}
          currentMarketChart={currentMarketChart}
          positions={user.positions}
          fiat={fiat}
          originAndCurrency={originAndCurrency}
          duration={duration}
        />
      </div>
    </div>
  );
};

export default TotalChart;
