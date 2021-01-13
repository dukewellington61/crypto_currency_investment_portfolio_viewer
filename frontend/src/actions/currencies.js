import axios from "axios";

export const getLatestCryptoData = async (currencyNamesArr, fiatCurrency) => {
  console.log("getLatestCryptoPrice() @currencies.js");
  const currencyNamesString = await getNameString(currencyNamesArr);

  // /coins/markets - List all supported coins price, market cap, volume, and market related data
  const urlString = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${
    fiatCurrency ? fiatCurrency : "eur"
  }&ids=${currencyNamesString}b&order=market_cap_desc&per_page=100&page=1&sparkline=true`;

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
    default:
  }

  const to = new Date().getTime() / 1000;

  const urlString = `https://api.coingecko.com/api/v3/coins/${currency}/market_chart/range?vs_currency=eur&from=${from}&to=${to}`;

  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  try {
    const dataSequence = await axios.get(proxyurl + urlString);

    const dataSequenceTransformed = addDateToArr(dataSequence.data.prices);

    let returnValue = "";

    switch (duration) {
      case "day":
        returnValue = dataSequenceTransformed.slice(0, 270);
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
      default:
    }

    // replaces the last price in the array with the most recent price so the last data point diagrams are always up to date
    returnValue[returnValue.length - 1][1] = current_price;

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
    // console.log(dateString);
    return [...arr[index], dateString];
  });

export const getMarketChartsCrypto2 = async (
  user,
  currency,
  current_price,
  duration
) => {
  console.log("getMarketChartsCrypto2() @currencies.js");

  let numberOfDays = 0;

  switch (duration) {
    case "day":
      numberOfDays = 1;
      break;
    case "week":
      numberOfDays = 7;
      break;
    case "month":
      numberOfDays = 30;
      break;
    case "all_currency":
      numberOfDays =
        (new Date() - new Date(await getFromDate(user, currency))) /
        (24 * 60 * 60 * 1000);
      break;
    case "all_total":
      const res = user.positions.sort(
        (a, b) =>
          Date.parse(a.date_of_purchase) - Date.parse(b.date_of_purchase)
      );
      numberOfDays =
        (new Date() - new Date(res[0].date_of_purchase)) /
        (24 * 60 * 60 * 1000);
      break;
    default:
  }

  const urlString = `https://api.coingecko.com/api/v3/coins/${currency}/market_chart?vs_currency=eur&days=${numberOfDays}`;

  // const proxyurl = "https://cors-anywhere.herokuapp.com/";

  try {
    const dataSequence = await axios.get(urlString);

    const dataSequenceTransformed = addDateToArr(dataSequence.data.prices);

    let returnValue = "";

    switch (duration) {
      case "day":
        returnValue = dataSequenceTransformed;
        break;
      case "week":
        returnValue = dataSequenceTransformed;
        break;
      case "month":
        returnValue = dataSequenceTransformed;
        break;
      case "all_currency":
        returnValue = dataSequenceTransformed;
        break;
      case "all_total":
        returnValue = dataSequenceTransformed;
        break;
      default:
    }

    // replaces the last price in the array with the most recent price so the last data point diagrams are always up to date
    returnValue[returnValue.length - 1][1] = current_price;

    return returnValue;
  } catch (error) {
    return error;
  }
};

export const getFiatExchangeRates = async (date) => {
  // console.log("date");
  // console.log(date);
  // 2010-01-12
  const urlString = `https://api.exchangeratesapi.io/${date}`;

  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  try {
    const res = await axios.get(proxyurl + urlString);
    return res;
  } catch (err) {
    return err;
  }
};
