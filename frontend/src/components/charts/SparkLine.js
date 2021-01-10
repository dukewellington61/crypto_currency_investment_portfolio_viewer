import React, { useState, useEffect } from "react";
import SparkLineCharts from "./SparkLineCharts";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";

const SparkLine = ({ user, cryptoCurrencies, currencyName }) => {
  const [sparkLineData, setSparkLineData] = useState([]);

  useEffect(() => {
    getSparkLineData();
  }, [cryptoCurrencies]);

  const getSparkLineData = () => {
    if (Object.keys(cryptoCurrencies).length > 0) {
      let sparkLineCurrentValuesTotal = new Array(
        cryptoCurrencies.data[0].sparkline_in_7d.price.length - 1
      ).fill(0);
      if (Object.keys(cryptoCurrencies).length > 0) {
        cryptoCurrencies.data.forEach((obj) => {
          // individual currency
          if (currencyName) {
            if (obj.id === currencyName) {
              const sparkLineCurrentValues = obj.sparkline_in_7d.price;
              setSparkLineData(sparkLineCurrentValues);
            }
            // total
          } else {
            obj.sparkline_in_7d.price.forEach((price, index) => {
              sparkLineCurrentValuesTotal[index] +=
                price * getAmount(user, obj.id);
            });
            //not all 7d currency price arrays have the same length --> this results in the last value of the 7d currency total price is too low
            // to avoid this the last value in array is set to the value before last in the array
            sparkLineCurrentValuesTotal[
              sparkLineCurrentValuesTotal.length - 1
            ] =
              sparkLineCurrentValuesTotal[
                sparkLineCurrentValuesTotal.length - 2
              ];
            setSparkLineData(sparkLineCurrentValuesTotal);
          }
        });
      }
    }
  };

  const getX_axisArray = () => {
    let Xaxis = [];
    if (sparkLineData) {
      Xaxis = new Array(sparkLineData.length).fill("");
    }
    return Xaxis;
  };

  const checkLineColor = () => {
    if (sparkLineData) {
      return sparkLineData[sparkLineData.length - 1] - sparkLineData[0] > 0
        ? "green"
        : "red";
    }
  };

  return (
    <div style={{ width: "10rem" }}>
      <SparkLineCharts
        sparkLineData={sparkLineData}
        getX_axisArray={getX_axisArray}
        checkLineColor={checkLineColor}
      />
    </div>
  );
};

export default SparkLine;
