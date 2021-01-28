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

  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);
  const containerRef = useRef(null);

  // console.log(leftArrowRef);
  // console.log(rightArrowRef);
  // const buttonRight = rightArrowRef.current;
  // const buttonLeft = leftArrowRef.current;
  const container = containerRef.current;

  // console.log(buttonRight);
  // console.log(buttonLeft);
  console.log(container);

  // if (buttonRight) {
  //   buttonRight.onclick = function (event) {
  //     console.log("click_button_right");
  //     container.scrollLeft += 20;
  //     event.preventDefault();
  //   };
  // }

  // if (buttonLeft) {
  //   buttonLeft.onclick = function (event) {
  //     console.log("click_button_left");
  //     container.scrollLeft -= 20;
  //     event.preventDefault();
  //   };
  // }

  const handleLeftClick = () => {
    container.scrollLeft -= 300;
    console.log(container.scrollLeft);
  };

  const handleRightClick = () => {
    container.scrollLeft -= -300;
    console.log(container.scrollLeft);
  };

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
          ref={leftArrowRef}
          onClick={handleLeftClick}
        ></i>
        <i
          className="fas fa-chevron-right"
          ref={rightArrowRef}
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
