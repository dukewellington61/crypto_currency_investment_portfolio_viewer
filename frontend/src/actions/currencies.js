import axios from "axios";

export const getLatestCryptoPrice = async (currencyNamesArr) => {
  console.log("getLatestCryptoPrice() @currencies.js");
  const currencyNamesString = await getNameString(currencyNamesArr);

  const urlString = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${currencyNamesString}b&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

  try {
    const res = await axios.get(urlString);

    return res;
  } catch (err) {
    return err;
  }
};

const getNameString = async (currencyNamesArr) => {
  let nameString = "";

  currencyNamesArr.forEach((el) => (nameString += `${el}%2C%20`));

  return nameString;
};

export const getMarketCharts = async (currency, date_of_purchase) => {
  console.log("getMarketCharts() @currencies.js");
  const from = new Date(date_of_purchase).getTime() / 1000;
  const to = new Date().getTime() / 1000;

  const urlString = `https://api.coingecko.com/api/v3/coins/${currency}/market_chart/range?vs_currency=eur&from=${from}&to=${to}`;

  try {
    const res = await axios.get(urlString);

    return res;
  } catch (err) {
    return err;
  }
};

export const getMarketChartsCrypto = async (
  user,
  currency,
  current_price,
  duration
) => {
  console.log("getMarketChartsCrypto() @currencies.js");
  let from = null;
  let date = null;

  switch (duration) {
    case "day":
      date = new Date();
      date.setDate(date.getDate() - 1);
      from = date / 1000;
      break;
    case "week":
      date = new Date();
      date.setDate(date.getDate() - 7);
      from = date / 1000;
      break;
    case "month":
      date = new Date();
      date.setDate(date.getDate() - 30);
      from = date / 1000;
      break;
    case "all_currency":
      from = new Date(await getFromDate(user, currency)).getTime() / 1000;
      break;
    case "all_total":
      const res = user.positions.sort(
        (a, b) =>
          Date.parse(a.date_of_purchase) - Date.parse(b.date_of_purchase)
      );
      from = new Date(res[0].date_of_purchase).getTime() / 1000;
      break;
  }

  const to = new Date().getTime() / 1000;

  const urlString = `https://api.coingecko.com/api/v3/coins/${currency}/market_chart/range?vs_currency=eur&from=${from}&to=${to}`;

  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  try {
    const dataSequence = await axios.get(proxyurl + urlString);

    // replaces the last price in the array with the most recent price so the last data point in @components/layout/CurrencyTotalChart.js and TotalChart.js
    // are always up to date
    dataSequence.data.prices[
      dataSequence.data.prices.length - 1
    ][1] = current_price;

    const dataSequenceTransformed = addDateToArr(dataSequence.data.prices);

    let returnValue = "";

    switch (duration) {
      case "day":
        returnValue = dataSequenceTransformed.slice(0, 260);
        break;
      case "week":
        returnValue = dataSequenceTransformed.slice(0, 165);
        break;
      case "month":
        returnValue = dataSequenceTransformed.slice(0, 720);
        break;
      case "all_currency":
        returnValue = dataSequenceTransformed;
        break;
      case "all_total":
        returnValue = dataSequenceTransformed;
        break;
    }

    return returnValue;
  } catch (error) {
    return error;
  }
};

const getFromDate = (user, currency) => {
  let dates = [];

  currency
    ? user.positions.forEach((position) => {
        if (position.crypto_currency === currency)
          dates.push(position.date_of_purchase);
      })
    : user.positions.forEach((position) =>
        dates.push(position.date_of_purchase)
      );

  let sort = dates.sort(function (a, b) {
    return Date.parse(a) > Date.parse(b);
  });

  // conditionally return because sequence in sort array is beeing turned around on reload (for some reason) sometimes returning the latest, rather than the earliest date
  return sort[0] > sort[sort.length - 1] ? sort[sort.length - 1] : sort[0];
};

const addDateToArr = (arr) =>
  arr.map((el, index) => {
    const date = new Date(el[0]);
    const day =
      date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const dateString = `${day}. ${month} ${year}`;
    return [...arr[index], dateString];
  });
