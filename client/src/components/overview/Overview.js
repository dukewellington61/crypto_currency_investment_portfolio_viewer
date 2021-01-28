import React, { Fragment, useState, useEffect, useRef } from "react";
import OverviewCurrencies from "./OverviewCurrencies";
import OverviewTotal from "./OverviewTotal";
import { getNamesAndCurrentValues } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentValue } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValue } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValuePurchase } from "../../auxiliary/auxiliaryCryptoData";

const Overview = ({
  user,
  cryptoCurrencies,
  exchangeRates,
  logedin,
  renderOverview,
  fiat,
  fiatSymbol,
  updateOriginAndCurrencyState,
  toggleView,
}) => {
  const [
    currencyNamesAndCurrentValues,
    setCurrencyNamesAndCurrentValues,
  ] = useState([]);

  const [currentValueTotal, setCurrentValueTotal] = useState(0);

  const [totalPurchase, setTotalPurchase] = useState(0);

  useEffect(() => {
    if (logedin) {
      const namesAndCurrentValuesArr = getNamesAndCurrentValues(
        user,
        cryptoCurrencies
      );

      setCurrencyNamesAndCurrentValues(namesAndCurrentValuesArr);

      const totalsArray = namesAndCurrentValuesArr.map(
        ([currencyName, currencyValue]) =>
          getCurrentValue(user, cryptoCurrencies, currencyName)
      );

      setCurrentValueTotal(totalsArray.reduce((a, b) => a + b, 0));

      setTotalPurchase(getInitialValuePurchase(user, fiat));
    }
  }, [user, cryptoCurrencies, logedin, renderOverview]);

  // these next lines of code preserve the previous currentValue over re-render
  const prevCurrentValueTotal = useRef(0);

  const prevCurrentValues = useRef({});

  useEffect(() => {
    prevCurrentValueTotal.current = currentValueTotal;
    currencyNamesAndCurrentValues.map(([currencyName, currencyValue]) => {
      const currVal = getCurrentValue(user, cryptoCurrencies, currencyName);
      prevCurrentValues.current[currencyName] = currVal;
    });
  }, [currentValueTotal]);

  // these next lines of code preserve the previous state of fiat (i.e. the fiat user had selected before current
  const [fiatCurr, setFiatCurr] = useState("");

  const prevFiat = useRef({});

  useEffect(() => {
    setFiatCurr(fiat.current);
  }, [fiat.current]);

  useEffect(() => {
    prevFiat.current = fiatCurr;
  }, [fiatCurr]);

  const get24hourChangeByCurrency = (currencyName) => {
    let returnValue = 0;

    if (cryptoCurrencies.data) {
      cryptoCurrencies.data.forEach((el) => {
        if (el.id === currencyName) {
          returnValue = el.price_change_percentage_24h;
        }
      });
    }
    return returnValue;
  };

  const get24hourChangeTotal = () => {
    let sum = 0;
    currencyNamesAndCurrentValues.forEach((arr) => {
      sum +=
        (get24hourChangeByCurrency(arr[0]) *
          getCurrentValue(user, cryptoCurrencies, arr[0])) /
        100;
    });

    return sum;
  };

  const handleClick = (origin, currency) => {
    toggleView();
    currency === "all_currencies"
      ? updateOriginAndCurrencyState(origin, currency)
      : updateOriginAndCurrencyState(origin, `${currency}_${fiat.current}`);
  };

  const [scrollPosition, setScrollposition] = useState(0);

  const ArrowRightRef = useRef(null);
  const ArrowLeftRef = useRef(null);
  const containerRef = useRef(null);

  const handleLeftClick = () => {
    setScrollposition((containerRef.current.scrollLeft -= 280));
  };

  const handleRightClick = () => {
    setScrollposition((containerRef.current.scrollLeft -= -280));
  };

  useEffect(() => {
    if (containerRef.current.scrollLeft === 0) {
      ArrowRightRef.current.classList.add("arrow_display");
      ArrowLeftRef.current.classList.remove("arrow_display");
    }
  }, []);

  if (containerRef.current) {
    containerRef.current.addEventListener("scroll", () => {
      if (containerRef.current.scrollLeft === 0) {
        ArrowRightRef.current.classList.add("arrow_display");
        ArrowLeftRef.current.classList.remove("arrow_display");
      }

      if (containerRef.current.scrollLeft > 0) {
        ArrowLeftRef.current.classList.add("arrow_display");
      }

      if (
        containerRef.current.scrollLeft ===
        containerRef.current.scrollWidth - window.innerWidth
      ) {
        ArrowRightRef.current.classList.remove("arrow_display");
      }

      if (
        containerRef.current.scrollLeft <
        containerRef.current.scrollWidth - window.innerWidth
      ) {
        ArrowRightRef.current.classList.add("arrow_display");
      }
    });
  }

  // this code hides the scrollbars if this app is displayed in the iframe of the portfolio page
  // the only reason for this is that it simply looks better in the iframe without the scroll bars
  // the portfolio page sends a message containing the string "iframe" to the app.
  // the app picks the message up (using the code below) and then adds a class so some css can be applied
  // if the app is displayed elsewhere the code below won't fire

  window.addEventListener("message", (message) => {
    if (message.data === "iframe_crypto_portfolio_viewer") {
      console.log("iframe_crypto_portfolio_viewer");
      document.querySelector("html").classList.add("hideScrollBar");
    }
  });

  return cryptoCurrencies.data && cryptoCurrencies.data.length === 0 ? (
    <div className="provisional_user_info">
      <div>
        There are currently no cryptocurrencies in your portfolio. Add crypto by
        hitting the "+ add crypto" button in the navbar menu.
      </div>
    </div>
  ) : (
    <Fragment>
      <div
        id="arrow_container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "sticky",
          top: "50%",
        }}
      >
        <i
          className="fas fa-chevron-left"
          ref={ArrowLeftRef}
          onClick={handleLeftClick}
        ></i>
        <i
          className="fas fa-chevron-right"
          ref={ArrowRightRef}
          onClick={handleRightClick}
        ></i>
      </div>

      <div>
        <table
          id="container"
          className="table table-striped table-responsive-sm"
          ref={containerRef}
        >
          <thead className="thead-dark">
            <tr>
              <th scope="col">Crypto</th>
              <th scope="col">Amount</th>
              <th scope="col">Initial Value</th>
              <th scope="col">Current Value</th>
              <th scope="col">Profit</th>
              <th scope="col">ROI</th>
              <th scope="col">Last 7 Days</th>
            </tr>
          </thead>
          <OverviewCurrencies
            user={user}
            cryptoCurrencies={cryptoCurrencies}
            exchangeRates={exchangeRates}
            currencyNamesAndCurrentValues={currencyNamesAndCurrentValues}
            prevCurrentValues={prevCurrentValues}
            logedin={logedin}
            fiat={fiat}
            prevFiat={prevFiat}
            fiatSymbol={fiatSymbol}
            getInitialValue={getInitialValue}
            get24hourChangeByCurrency={get24hourChangeByCurrency}
            getCurrentValue={getCurrentValue}
            handleClick={handleClick}
          />
          <OverviewTotal
            user={user}
            cryptoCurrencies={cryptoCurrencies}
            exchangeRates={exchangeRates}
            totalPurchase={totalPurchase}
            currentValueTotal={currentValueTotal}
            prevCurrentValueTotal={prevCurrentValueTotal}
            fiat={fiat}
            prevFiat={prevFiat}
            fiatSymbol={fiatSymbol}
            get24hourChangeTotal={get24hourChangeTotal}
            handleClick={handleClick}
          />
        </table>
      </div>
    </Fragment>
  );
};

export default React.memo(Overview);
