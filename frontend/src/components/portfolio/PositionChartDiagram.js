import React from "react";
import { Line } from "react-chartjs-2";

function PositionChartDiagram({ marketChart, amount, currency }) {
  const getLabels = () => {
    let timeArr = [];
    if (marketChart.data) {
      marketChart.data.prices.forEach((el) => {
        const time = new Date(el[0]);
        timeArr.push(time);
      });
    }

    return timeArr;
  };

  const getData = () => {
    let data = [];
    if (marketChart.data) {
      marketChart.data.prices.forEach((el) => data.push(el[1]));
      return data;
    }
  };

  const getPrice = () => {
    const priceArr = getData();
    const calcPricesArr = priceArr.map((el) => el * amount);
    return calcPricesArr;
  };

  return (
    <div>
      <Line
        data={{
          labels: getLabels(),
          datasets: [
            {
              label: currency,
              data: getPrice(marketChart),
            },
          ],
        }}
        height={400}
        width={600}
      />
    </div>
  );
}

export default PositionChartDiagram;
