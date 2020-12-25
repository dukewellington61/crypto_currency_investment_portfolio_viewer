import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { cumulativeValueInvestment } from "../../auxiliary/auxiliaryCryptoData";

function TotalChartDiagramm({
  positions,
  currentMarketChart,
  fiat,
  origin,
  duration,
}) {
  const [nameArray, setNameArray] = useState("");

  const [labelStr, setLabelStr] = useState("");

  const [resultArray, setResultArray] = useState([]);

  const [timeStampArray, setTimeStampArray] = useState([]);

  useEffect(() => {
    switch (origin) {
      case "total_initial_value":
        setNameArray("initialValueArray");
        setLabelStr(`Price in ${fiat}`);
        break;
      case "total_current_value":
        setNameArray("currentValueArray");
        setLabelStr(`Price in ${fiat}`);
        break;
      case "total_balance":
        setNameArray("balanceArray");
        setLabelStr(`Price in ${fiat}`);
        break;
      case "total_roi":
        setNameArray("roiArray");
        setLabelStr(`ROI in %`);
        break;
      default:
    }
  }, []);

  useEffect(() => {
    const currenciesTotalObjectsArray = [];

    const timeStamps = [];

    const currencyArr = Object.keys(currentMarketChart);

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

    currenciesTotalObjectsArray.forEach((obj) => {
      obj.timeStampArray.forEach((el, index) => (timeStamps[index] = el));
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
          obj[nameArray].forEach((el, index) => (resArray[index] += el));
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
