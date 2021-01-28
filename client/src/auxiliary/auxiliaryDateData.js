export const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  const date = yyyy + "-" + mm + "-" + dd;

  return date;
};

// export const checkDuration = (marketChart) => {
//   console.log(marketChart);
//   const arr = Object.values(marketChart)[0];
//   const duration = (arr[arr.length - 1][0] - arr[0][0]) / 1000 / (24 * 60 * 60);
//   return duration;
// };

export const duration7Days = (user) => {
  if (user.positions.length > 0) {
    const sorted = user.positions.sort((a, b) => {
      return a.date_of_purchase - b.date_of_purchase;
    });

    const oldestDateUnix =
      new Date(sorted[sorted.length - 1].date_of_purchase).getTime() / 1000;

    const currentDateUnix = new Date().getTime() / 1000;

    const durationUnix = currentDateUnix - oldestDateUnix;

    const durationDays = Math.floor(durationUnix / 86400);

    if (durationDays > 7) {
      return true;
    } else {
      return false;
    }
  }
};
