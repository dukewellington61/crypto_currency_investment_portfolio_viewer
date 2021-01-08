export const getCurrenciesNames = (user) => {
  let currencyArr = [];
  if (user) {
    user.positions.map((position) =>
      currencyArr.push(position.crypto_currency)
    );
  }

  // techsith's recommended way to remove duplicates from array (https://www.youtube.com/watch?v=dvPybpgk5Y4)

  return [...new Set(currencyArr)];
};

export const getNamesAndCurrentValues = (user, cryptoCurrencies) => {
  let namesAndValuesObj = {};

  getCurrenciesNames(user).forEach((currencyName) => {
    namesAndValuesObj[currencyName] = getCurrentValue(
      user,
      cryptoCurrencies,
      currencyName
    );
  });

  let res = Object.entries(namesAndValuesObj).sort(function (a, b) {
    return b[1] - a[1];
  });

  return res;
};

// let prevValuesObj = {};

// export const getCurrentValue2 = (user, cryptoCurrencies, currencyName) => {
//   const currentPrice = getCurrentPrice(cryptoCurrencies, currencyName);
//   const amount = getAmount(user, currencyName);
//   const currentValue = currentPrice * amount;
//   let returnObj = {};
//   let copy_returnObj = {};

//   if (!prevValuesObj[currencyName]) prevValuesObj[currencyName] = [];

//   if (currentValue !== prevValuesObj[currencyName][0]) {
//     prevValuesObj[currencyName].push(parseFloat(currentValue.toFixed(2)));
//   }

//   if (prevValuesObj[currencyName].length >= 2) {
//     prevValuesObj[currencyName].length = 2;

//     returnObj.prevCurrentValue = parseInt(prevValuesObj[currencyName][0]);

//     returnObj.prevCurrentValue = returnObj.prevCurrentValue.toFixed(2);

//     copy_returnObj = JSON.parse(JSON.stringify(returnObj));

//     prevValuesObj[currencyName][0] = prevValuesObj[currencyName][1];
//     prevValuesObj[currencyName].pop();
//   }

//   copy_returnObj.currentValue = currentValue;

//   const res = copy_returnObj.currentValue - copy_returnObj.prevCurrentValue;

//   // console.log(prevValuesObj);

//   // if (!isNaN(res)) {
//   //   console.log(res);
//   //   return res;
//   // }

//   return prevValuesObj;
// };

export const getCurrentValue = (user, cryptoCurrencies, currencyName) => {
  const currentPrice = getCurrentPrice(cryptoCurrencies, currencyName);
  const amount = getAmount(user, currencyName);
  const currentValue = currentPrice * amount;

  return currentValue;
};

// let prevValuesObj = {};

// export const getCurrentValue2 = (user, cryptoCurrencies, currencyName) => {
//   const currentPrice = getCurrentPrice(cryptoCurrencies, currencyName);
//   const amount = getAmount(user, currencyName);
//   const currentValue = currentPrice * amount;
//   let returnObj = {};

//   if (!prevValuesObj[currencyName]) prevValuesObj[currencyName] = 0;

//   // if (currentValue !== prevValuesObj[currencyName])
//   returnObj.prevCurrentValue = prevValuesObj[currencyName];

//   const copy_returnObj = JSON.parse(JSON.stringify(returnObj));

//   copy_returnObj.currentValue = currentValue;

//   prevValuesObj[currencyName] = currentValue;

//   console.log(copy_returnObj);
//   return copy_returnObj;
// };

export const getCurrentPrice = (cryptoCurrencies, currencyName) => {
  if (cryptoCurrencies.data && typeof currencyName === "string") {
    const currentPrice = cryptoCurrencies.data.find(
      (el) => el.id === currencyName
    );

    if (currentPrice) return currentPrice.current_price;
  }
};

export const getCurrencyPositions = (user, currencyName) => {
  if (user.positions) {
    return user.positions.filter(
      (position) => position.crypto_currency === currencyName
    );
  }
};

export const getAmount = (user, currencyName) => {
  let sum = 0;
  if (user.positions) {
    user.positions.map((position) => {
      if (position.crypto_currency === currencyName) {
        sum += parseFloat(position.amount);
      }
    });
  }

  return sum;
};

const getAmountAndDate = (positions, currencyName) => {
  // extracts amount of coins, date of purchase and price
  let AmountAndDateArr = [];

  positions.forEach((el) => {
    let arrEl = [];

    if (el.crypto_currency === currencyName) {
      arrEl[0] = Date.parse(el.date_of_purchase);
      arrEl[1] = parseFloat(el.amount);
      arrEl[2] = el.price;
      AmountAndDateArr.push(arrEl);
    }
  });

  // sorts AmountAndDateArr by purchase date beginning with the oldest
  let sort = AmountAndDateArr.sort(function (a, b) {
    return a[0] - b[0];
  });

  // adds amount of coins in array so that each amount is the sum of itself + the previous amount
  for (const element in sort) {
    element > 0
      ? (sort[element][1] = sort[element][1] + sort[element - 1][1])
      : (sort[element][1] = sort[element][1]);
  }

  // adds price of individual purchases so that each price in array is the sum of itself + the previous amount
  for (const element in sort) {
    element > 0
      ? (sort[element][2] = sort[element][2] + sort[element - 1][2])
      : (sort[element][2] = sort[element][2]);
  }
  return sort;
};

// returns object (one for each currency) which has various arrays (initialValueArray, currentValueArray etc..)
// those arrays that are beeing used to display the whole duration from first purchase until present time have all the same length even if a currency had been purchased later
// if that is the case, an equivalent amount of positions at the beginning of those arrays are undefined
export const cumulativeValueInvestment = (positions, marketChart, currency) => {
  let resultObject = {};
  let initialValueArr = [];
  let currentValueArr = [];
  let balanceArr = [];
  let roiArr = [];
  let timeStampArr = [];

  // 1st array: getAmountAndDate() returns array with amount, price and date of purchase for each position of a crypro currency
  // 2nd array: marketChart is array of objects -> each object has initialValueArray, currentValueArray, balanceArray etc. ..
  if (marketChart) {
    getAmountAndDate(positions, currency).forEach((array1) => {
      marketChart.forEach((array2, index) => {
        // array1: [date(unix)_of_purchase, amount, initial_value]
        // array2: [date(unix), price_crypto, timeStamp]
        if (array1[0] <= array2[0]) {
          currentValueArr[index] = array2[1] * array1[1];
          timeStampArr[index] = getTimeStamps(marketChart, index, array2);
          initialValueArr[index] = array1[2];
          balanceArr[index] = currentValueArr[index] - initialValueArr[index];
          roiArr[index] =
            (currentValueArr[index] * 100) / initialValueArr[index] - 100;
        }
      });
    });
  }

  resultObject.initialValueArray = initialValueArr;
  resultObject.currentValueArray = currentValueArr;
  resultObject.balanceArray = balanceArr;
  resultObject.roiArray = roiArr;
  resultObject.timeStampArray = timeStampArr;

  return resultObject;
};

// returns duration in days -> from date of first purchase currency until now
// duration is beeing used in conditional to make sure that x-axis doesn't have too many timestamps (granularity of data returned by API)
const checkDuration = (marketChart) =>
  (marketChart[marketChart.length - 1][0] - marketChart[0][0]) /
  1000 /
  (24 * 60 * 60);

const getTimeStamps = (marketChart, index, array2) => {
  if (
    index === 0 || checkDuration(marketChart) < 90
      ? index % 10 === 0
      : index % 5 === 0
  ) {
    return array2[2];
  } else {
    return " ";
  }
};

export const getInitialValue = (user, currency) => {
  let sum = 0;
  user.positions.map((position) => {
    if (position.crypto_currency === currency) {
      sum += position.price;
    }
  });
  return sum;
};
