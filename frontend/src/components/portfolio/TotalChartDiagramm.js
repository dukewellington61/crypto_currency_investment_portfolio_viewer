import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { cumulativeValueInvestment } from "../../auxiliary/auxiliaryCryptoData";

function TotalChartDiagramm({
  positions,
  currentMarketChart,
  fiat,
  originAndCurrency,
  duration,
}) {
  const [nameArray, setNameArray] = useState("");

  const [labelStr, setLabelStr] = useState("");

  const [resultArray, setResultArray] = useState([]);

  const [timeStampArray, setTimeStampArray] = useState([]);

  const [origin, currency] = originAndCurrency;

  useEffect(() => {
    switch (origin) {
      case "initial_value":
        setNameArray("initialValueArray");
        setLabelStr(`Price in ${fiat}`);
        break;
      case "current_value":
        setNameArray("currentValueArray");
        setLabelStr(`Price in ${fiat}`);
        break;
      case "balance":
        setNameArray("balanceArray");
        setLabelStr(`Price in ${fiat}`);
        break;
      case "roi":
        setNameArray("roiArray");
        setLabelStr(`ROI in %`);
        break;
      default:
    }
  }, []);

  useEffect(() => {
    const currenciesTotalObjectsArray = [];

    const timeStamps = [];

    let currencyArr = [];

    currency === "all_currencies"
      ? (currencyArr = Object.keys(currentMarketChart))
      : currencyArr.push(currency);

    // the following 2 functions push object(s) with initialValueArray, currentValueArray, balanceArray, roiArray and timeStampArray in currenciesTotalObjectsArray
    // for each crypto_currency or for the one currency in question
    const totalValueInvestment = (obj) => {
      currenciesTotalObjectsArray.push(obj);
    };

    currencyArr.forEach((currency) =>
      totalValueInvestment(
        cumulativeValueInvestment(
          positions,
          currentMarketChart[currency],
          currency
        )
      )
    );

    // retrieves timeStamps from array of currencyobjects
    currenciesTotalObjectsArray.forEach((obj) => {
      console.log(currenciesTotalObjectsArray);
      var filtered = obj.timeStampArray.filter(function (el) {
        return el !== undefined;
      });
      filtered.forEach((el, index) => (timeStamps[index] = el));
    });

    // the following code sums up initial_value, current_value, balance of every individual currency so that the totals of these attributes can be displayed in a chart
    // it also calculates the development of roi over time
    const resArray = new Array(timeStamps.length).fill(0);

    if (nameArray) {
      const initValResArray = new Array(timeStamps.length).fill(0);
      const currValResArray = new Array(timeStamps.length).fill(0);
      currenciesTotalObjectsArray.forEach((obj) => {
        if (nameArray === "roiArray") {
          obj.initialValueArray.forEach(
            (el, index) => (initValResArray[index] += el)
          );
          obj.currentValueArray.forEach(
            (el, index) => (currValResArray[index] += el)
          );
          obj.roiArray.forEach(
            (el, index) =>
              (resArray[index] =
                (currValResArray[index] * 100) / initValResArray[index] - 100)
          );
        } else {
          // this removes undefined elements from arrays
          if (currency === "all_currencies") {
            obj[nameArray].forEach((el, index) => (resArray[index] += el));
          } else {
            var filtered = obj[nameArray].filter(function (el) {
              return el !== undefined;
            });
            filtered.forEach((el, index) => (resArray[index] += el));
          }
        }
      });
    }

    setResultArray(resArray);

    setTimeStampArray(timeStamps);
  }, [nameArray, currentMarketChart, duration]);

  return (
    <div>
      <Line
        data={{
          labels: timeStampArray,
          datasets: [
            {
              label: labelStr,
              data: resultArray,
            },
          ],
        }}
        // width={500}
        height={500}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: labelStr,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}

export default TotalChartDiagramm;
