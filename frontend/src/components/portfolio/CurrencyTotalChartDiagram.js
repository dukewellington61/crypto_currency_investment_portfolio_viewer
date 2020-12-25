import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const CurrencyTotalChartDiagram = ({
  currencyTotal,
  currency,
  fiat,
  origin,
}) => {
  const [originateFrom, setOriginateFrom] = useState([]);
  const [labelStr, setLabelStr] = useState("");

  useEffect(() => {
    switch (origin) {
      case "initialInvestment":
        setOriginateFrom(currencyTotal.initialValueArray);
        setLabelStr(`Price in ${fiat}`);
        break;
      case "currentValue":
        setOriginateFrom(currencyTotal.currentValueArray);
        setLabelStr(`Price in ${fiat}`);
        break;
      case "balance":
        setOriginateFrom(currencyTotal.balanceArray);
        setLabelStr(`Price in ${fiat}`);
        break;
      case "roi":
        setOriginateFrom(currencyTotal.roiArray);
        setLabelStr(`ROI in %`);
        break;
      default:
    }
  }, [currencyTotal, currency, fiat, origin]);

  return (
    <div>
      <Line
        data={{
          labels: currencyTotal.timeStampArray,
          datasets: [
            {
              label: currency,
              data: originateFrom,
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
};

export default CurrencyTotalChartDiagram;
