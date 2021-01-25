import React from "react";
import { Line } from "react-chartjs-2";

const SparkLineCharts = ({ sparkLineData, getX_axisArray, checkLineColor }) => {
  return (
    <div>
      <Line
        data={{
          labels: getX_axisArray(),
          datasets: [
            {
              label: "",
              data: sparkLineData,
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

export default SparkLineCharts;
