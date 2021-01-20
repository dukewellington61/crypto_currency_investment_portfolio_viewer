import React, { Fragment, useState, useEffect } from "react";
import Twenty4hChange from "./Twenty4hChange";
import { Line } from "react-chartjs-2";
import { cumulativeValueInvestment } from "../../auxiliary/auxiliaryCryptoData";

const TotalChartDiagramm = ({
  positions,
  currentMarketChart,
  fiat,
  originAndCurrency,
  duration,
}) => {
  // console.log(currentMarketChart);
  const [nameArray, setNameArray] = useState("");

  const [labelStr, setLabelStr] = useState("");

  const [resultArray, setResultArray] = useState([]);

  const [timeStampArray, setTimeStampArray] = useState([]);

  const [origin, currency] = originAndCurrency;

  useEffect(() => {
    console.log("useEffect");
    switch (origin) {
      case "initial_value":
        setNameArray("initialValueArray");
        // setLabelStr(`Value of ${currency} in ${fiat.current}`);
        break;
      case "current_value":
        setNameArray("currentValueArray");
        // setLabelStr(`Value of ${currency} in ${fiat.current}`);
        break;
      case "balance":
        setNameArray("balanceArray");
        // setLabelStr(`Value of ${currency} in ${fiat.current}`);
        break;
      case "roi":
        setNameArray("roiArray");
        // setLabelStr(`ROI in %`);
        break;
      default:
    }
  }, []);

  useEffect(() => {
    origin === "roi"
      ? setLabelStr(`ROI in %`)
      : setLabelStr(
          `Value of ${
            currency === "all_currencies"
              ? "this portfolio"
              : currency.split("_")[0]
          } in ${fiat.current}`
        );
  }, [fiat.current]);

  useEffect(() => {
    const currenciesTotalObjectsArray = [];

    const timeStamps = [];

    let currencyArr = [];

    currency === "all_currencies"
      ? (currencyArr = Object.keys(currentMarketChart))
      : currencyArr.push(currency);

    // the following 2 functions push objects with initialValueArray, currentValueArray, balanceArray, roiArray and timeStampArray for every currency
    // in currenciesTotalObjectsArray
    const totalValueInvestment = (obj) => {
      currenciesTotalObjectsArray.push(obj);
    };

    currencyArr.forEach((currency) => {
      // console.log(currency);
      totalValueInvestment(
        cumulativeValueInvestment(
          positions,
          currentMarketChart[currency],
          currency,
          fiat
        )
      );
    });

    // console.log(currency);

    // not all currency price arrays as returned by the api have the same length --> this results in the last values of the calculated total price array being too low
    // this makes sure that all the indivual currency arrays from which totals are beeing calculated have the same length
    // (which corresponds with the length of the shortest array)
    let lengthArr = [];

    // puts length of each array in object in array
    currenciesTotalObjectsArray.forEach(
      (obj, index) => (lengthArr[index] = obj.initialValueArray.length)
    );

    // gets the shortest array length
    const minLength = Math.min(...lengthArr);

    // sets length of arrays in object to the shortest length
    currenciesTotalObjectsArray.map((obj) => {
      for (const [key, value] of Object.entries(obj)) {
        value.length = minLength;
      }
    });

    // retrieves timeStamps from array of objects with initialValueArray, currentValueArray, balanceArray, roiArray and timeStampArray for every currency
    // those objects are beeing created in cumulativeValueInvestment() @auxiliaryCryptoData.js
    // some of these arrays contain empty slots (for details see comments in cumulativeValueInvestment() in @auxiliaryCryptoData.js)
    // those have to be removed, else the line diagrams display a lot of null values at the beginning
    // hence filter is employed
    currency !== "all_currencies"
      ? currenciesTotalObjectsArray.forEach((obj) => {
          const filtered = obj.timeStampArray.filter((el) => el !== undefined);
          filtered.forEach((el, index) => (timeStamps[index] = el));
        })
      : // if total is to be displayed the above causes problems so in that case no filter is employed
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
          obj.initialValueArray.forEach((el, index) => {
            initValResArray[index] += el;
          });
          obj.currentValueArray.forEach(
            (el, index) => (currValResArray[index] += el)
          );
          obj.roiArray.forEach(
            (el, index) =>
              (resArray[index] =
                (currValResArray[index] * 100) / initValResArray[index] - 100)
          );
        } else {
          if (currency === "all_currencies") {
            obj[nameArray].forEach((el, index) => (resArray[index] += el));
          } else {
            // this removes undefined elements from arrays (why are there undefined elements in some arrays? see explanation above for empty slots in timeStampArray)
            const filtered = obj[nameArray].filter((el) => el !== undefined);
            filtered.forEach((el, index) => (resArray[index] += el));
          }
        }
      });
    }
    setResultArray(resArray);
    setTimeStampArray(timeStamps);
    // setTimeStampArray(timeStampArray);
    // console.log(timeStamps);
  }, [nameArray, currentMarketChart, duration]);

  const getUnit = () => {
    switch (duration) {
      case "day":
        return "hour";
      case "week":
        return "day";
      case "month":
        return "week";
      case "all":
        return "month";
    }
  };

  return (
    <Fragment>
      <Twenty4hChange dataArray={resultArray} />
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
              xAxes: [
                {
                  type: "time",
                  time: {
                    unit: getUnit(),
                    displayFormats: {
                      quarter: "MMM YYYY",
                    },
                    distribution: "series",
                  },
                },
              ],
            },
          }}
        />
      </div>
    </Fragment>
  );
};

export default TotalChartDiagramm;
