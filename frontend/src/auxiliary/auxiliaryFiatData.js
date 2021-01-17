import { getFiatExchangeRates } from "../actions/currencies";

export const convertFiat = async (
  price,
  fiat,
  date_of_purchase,
  triggerAlert
) => {
  const convertObj = {};
  const exchangeObj = await getFiatExchangeRates(date_of_purchase);

  if (exchangeObj instanceof Error) {
    triggerAlert(exchangeObj.message, "danger");
    return;
  } else if (exchangeObj) {
    switch (fiat) {
      case "EUR":
        convertObj.price_EUR = parseFloat(price);
        convertObj.price_USD = price * exchangeObj.data.rates.USD;
        convertObj.price_GBP = price * exchangeObj.data.rates.GBP;
        break;

      case "USD":
        convertObj.price_USD = price;
        const exchangeRateUSD_EUR = 1 / exchangeObj.data.rates.USD;
        const exchangeRateUSD_GBP = 1 / exchangeObj.data.rates.GBP;
        convertObj.price_EUR = price * exchangeRateUSD_EUR;
        convertObj.price_GBP = price * exchangeRateUSD_GBP;
        break;
      case "GBP":
        convertObj.price_GBP = price;
        const exchangeRateGBP_EUR = 1 / exchangeObj.data.rates.EUR;
        const exchangeRateGBP_USD = 1 / exchangeObj.data.rates.USD;
        convertObj.price_EUR = price * exchangeRateGBP_EUR;
        convertObj.price_USD = price * exchangeRateGBP_USD;
        break;
      default:
    }
  }
  return convertObj;
};
