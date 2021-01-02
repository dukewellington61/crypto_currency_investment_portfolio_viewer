import React, { useEffect } from "react";
import TotalChartDiagramm from "./TotalChartDiagramm";

function TotalChart({
  user,
  currentMarketChart,
  toggleView,
  originAndCurrency,
  loaded,
  duration,
  upDateMarketChartState,
  logedin,
}) {
  useEffect(() => {
    if (logedin) upDateMarketChartState("all_total");
  }, [user]);

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
          onClick={() => upDateMarketChartState("day")}
        >
          day
        </div>
        <div
          id={duration === "week" && "duration"}
          className="durations"
          onClick={() => upDateMarketChartState("week")}
        >
          week
        </div>
        <div
          id={duration === "month" && "duration"}
          className="durations"
          onClick={() => upDateMarketChartState("month")}
        >
          month
        </div>
        <div
          id={duration === "all_total" && "duration"}
          className="durations"
          onClick={() => upDateMarketChartState("all_total")}
        >
          all
        </div>
      </div>
      <div>
        <TotalChartDiagramm
          user={user}
          currentMarketChart={currentMarketChart}
          positions={user.positions}
          fiat={user.positions[0].fiat_currency}
          originAndCurrency={originAndCurrency}
          duration={duration}
        />
      </div>
    </div>
  );
}

export default TotalChart;
