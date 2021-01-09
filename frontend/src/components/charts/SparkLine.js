import React from "react";
import { Line } from "react-chartjs-2";

const SparkLine = ({ sparkLineData, amount }) => {
  let Xaxis = [];
  if (sparkLineData) {
    Xaxis = new Array(sparkLineData.length).fill("");
  }
  const sparkLineCurrentValue = () => {
    if (sparkLineData) {
      const resultArr = sparkLineData.map((value) => value * amount);
      return resultArr;
    }
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
      {" "}
      <Line
        data={{
          labels: Xaxis,
          datasets: [
            {
              label: "",
              data: sparkLineCurrentValue(),
              borderColor: checkLineColor(),
            },
          ],
        }}
        // width={100}
        height={100}
        options={{
          elements: {
            point: {
              radius: 0,
            },
          },
          responsive: true,
          legend: {
            display: false,
          },
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                },
                scaleLabel: {
                  display: false,
                  labelString: "",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default SparkLine;
