import React, { useState, useEffect } from "react";

const Twenty4hChange = ({ dataArray }) => {
  const [change, setChange] = useState(0);
  const [twentyFourHoursMax, setTwentyFourHoursMax] = useState(0);
  const [twentyFourHoursMin, setTwentyFourHoursMin] = useState(0);

  useEffect(() => {
    // array has NaN in the end which have to be removed because else change = NaN
    const arr = dataArray.filter((el) => !isNaN(el));
    setChange(dataArray[arr.length - 1] - arr[0]);
    setTwentyFourHoursMax(get24hMax());
    setTwentyFourHoursMin(get24hMin());
  }, [dataArray]);

  const get24hMax = () => {
    const arraySorted = dataArray.sort(function (a, b) {
      return b - a;
    });

    return arraySorted[0];
  };

  const get24hMin = () => {
    const arrSorted = dataArray.sort(function (a, b) {
      return a - b;
    });

    return arrSorted[0];
  };

  return (
    <div className="twenty_four_hour_charts_container">
      <div
        style={{
          color: change > 0 ? "green" : "red",
        }}
      >
        change: {change.toFixed(2)} &euro;
      </div>
      <div className="crypto_24h_change">max: {twentyFourHoursMax} &euro;</div>
      <div className="crypto_24h_change">min: {twentyFourHoursMin} &euro;</div>
    </div>
  );
};

export default Twenty4hChange;
