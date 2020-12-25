import React, { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMarketCharts } from "../../actions/currencies";
import PositionChartDiagram from "./PositionChartDiagram";

const PositionChart = () => {
  let data = useLocation();

  const [marketChart, setMarketChart] = useState({});

  useEffect(() => {
    const updateStates = async () => {
      const chartData = await getMarketCharts(
        data.state.currency,
        data.state.date_of_purchase
      );
      setMarketChart(chartData);
    };

    updateStates();
  }, []);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  return isEmpty(marketChart) ? (
    <div>Loading ...</div>
  ) : (
    <div>
      <Fragment>
        <PositionChartDiagram
          marketChart={marketChart}
          amount={data.state.amount}
        />
      </Fragment>
    </div>
  );
};

export default PositionChart;
