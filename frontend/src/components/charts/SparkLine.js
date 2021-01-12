import React, { useState, useEffect } from "react";
import SparkLineCharts from "./SparkLineCharts";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";

const SparkLine = ({ user, cryptoCurrencies, currencyName }) => {
  const [sparkLineData, setSparkLineData] = useState([]);

  useEffect(() => {
    getSparkLineData();
  }, [cryptoCurrencies]);

  const getSparkLineData = () => {
    // not all 7d price arrays as returned by the api have the same length --> this results in the last values of the calculated total price array being too low
    // this makes sure that all the indivual currency arrays from which totals are beeing calculated have the same length
    // (which corresponds with the length of the shortest array)

    let lengthArr = [];

    if (Object.keys(cryptoCurrencies).length > 0) {
      // gets lenghts of 7d price array
      cryptoCurrencies.data.forEach((obj, index) => {
        lengthArr[index] = obj.sparkline_in_7d.price.length;
      });

      // get length of shortest 7d price array
      const minLength = Math.min(...lengthArr);

      // get length of longest 7d price array
      const maxLength = Math.max(...lengthArr);

      // sets array sparkLineCurrentValues to length of longest 7d price array
      let sparkLineCurrentValues = new Array(maxLength).fill(0);

      if (Object.keys(cryptoCurrencies).length > 0) {
        cryptoCurrencies.data.forEach((obj) => {
          // individual currency
          if (currencyName) {
            if (obj.id === currencyName) {
              obj.sparkline_in_7d.price.forEach((price, index) => {
                sparkLineCurrentValues[index] +=
                  price * getAmount(user, obj.id);
              });
            }
            // total
          } else {
            obj.sparkline_in_7d.price.forEach((price, index) => {
              sparkLineCurrentValues[index] += price * getAmount(user, obj.id);
            });
          }
        });

        // sets result array of sparkline value to the length of the shortes 7d price array
        sparkLineCurrentValues.length = minLength;

        setSparkLineData(sparkLineCurrentValues);
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
