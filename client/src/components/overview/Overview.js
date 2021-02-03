import React, { useState, useEffect, useRef, Fragment } from "react";
import OverviewCurrencies from "./OverviewCurrencies";
import OverviewTotal from "./OverviewTotal";
import { getOverviewValues } from "../../auxiliary/auxiliaryCryptoData";
import { getCurrentValue } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValue } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValuePurchase } from "../../auxiliary/auxiliaryCryptoData";
import { sortOverViewValuesArray } from "../../auxiliary/auxiliarySort";
import { handleUI } from "../../auxiliary/auxiliarySort";

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
  const [overviewValues, setOverviewValues] = useState([]);

  const [currentValueTotal, setCurrentValueTotal] = useState(0);

  const [totalPurchase, setTotalPurchase] = useState(0);

  useEffect(() => {
    if (logedin) {
      const overviewValuesArray = getOverviewValues(
        user,
        cryptoCurrencies,
        fiat
      );

      if (overviewValuesArray) {
        setOverviewValues(overviewValuesArray);

        const totalsArray = overviewValuesArray.map(
          ([currencyName, currencyValue]) =>
            getCurrentValue(user, cryptoCurrencies, currencyName)
        );

        setCurrentValueTotal(totalsArray.reduce((a, b) => a + b, 0));

        setTotalPurchase(getInitialValuePurchase(user, fiat));
      }
    }
  }, [user, cryptoCurrencies, logedin, renderOverview]);

  // these next lines of code preserve the previous currentValue over re-render
  const prevCurrentValueTotal = useRef(0);

  const prevCurrentValues = useRef({});

  useEffect(() => {
    prevCurrentValueTotal.current = currentValueTotal;
    overviewValues.map(
      ([currencyName, amount, initialValue, currentValue, profit, ROI]) => {
        const currVal = getCurrentValue(user, cryptoCurrencies, currencyName);
        prevCurrentValues.current[currencyName] = currVal;
      }
    );
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
    overviewValues.forEach((arr) => {
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

  // arrows for horizontal scroll in iframe
  // update state neccessary, because without re render --> conditionally arrow display / not display doesn't work properly
  // state variable is needed nowhere
  const [scrollPosition, setScrollposition] = useState(0);

  const arrowRightRef = useRef(null);
  const arrowLeftRef = useRef(null);
  const containerRef = useRef(null);
  const arrowContainerRef = useRef(null);

  const handleLeftClick = () => {
    const scrollPos = (containerRef.current.scrollLeft -= 280);
    setScrollposition(scrollPos);
    sessionStorage.setItem("scroll_position", scrollPos);
  };

  const handleRightClick = () => {
    const scrollPos = (containerRef.current.scrollLeft -= -280);
    setScrollposition(scrollPos);
    sessionStorage.setItem("scroll_position", scrollPos);
  };

  useEffect(() => {
    if (containerRef)
      containerRef.current.scrollLeft = sessionStorage.getItem(
        "scroll_position"
      );

    arrowRightRef.current.classList.add("arrow_display");
    arrowLeftRef.current.classList.remove("arrow_display");
  }, []);

  if (containerRef.current) {
    containerRef.current.addEventListener("scroll", () => {
      if (containerRef.current.scrollLeft === 0) {
        arrowRightRef.current.classList.add("arrow_display");
        arrowLeftRef.current.classList.remove("arrow_display");
      }

      if (containerRef.current.scrollLeft > 0) {
        arrowLeftRef.current.classList.add("arrow_display");
      }

      if (
        containerRef.current.scrollLeft ===
        containerRef.current.scrollWidth - window.innerWidth
      ) {
        arrowRightRef.current.classList.remove("arrow_display");
      }

      if (
        containerRef.current.scrollLeft <
        containerRef.current.scrollWidth - window.innerWidth
      ) {
        arrowRightRef.current.classList.add("arrow_display");
      }
    });
  }

  // hideArrowContainerOnMobile(arrowContainerRef);

  // hides arrows in iframe on mobile devices //
  useEffect(() => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      arrowContainerRef.current.classList.add("hide_arrow_container");
    }
  });

  const handleSort = (index, desc, e) => {
    setOverviewValues(sortOverViewValuesArray(overviewValues, index, desc));
    handleUI(e);
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
      <div id="arrow_container" ref={arrowContainerRef}>
        <i
          className="fas fa-chevron-left"
          ref={arrowLeftRef}
          onClick={handleLeftClick}
        ></i>
        <i
          className="fas fa-chevron-right"
          ref={arrowRightRef}
          onClick={handleRightClick}
        ></i>
      </div>
      <div id="overview_container">
        <table
          id="overview_table"
          className="table table-striped table-responsive-sm"
          ref={containerRef}
        >
          <thead className="thead-dark">
            <tr>
              <th scope="col">
                <div className="name_and_arrows">
                  Crypto{" "}
                  <i
                    className="fas fa-sort-up"
                    onClick={(e) => handleSort(0, false, e)}
                  ></i>
                  <i
                    className="fas fa-sort-down"
                    onClick={(e) => handleSort(0, true, e)}
                  ></i>
                </div>
              </th>
              <th scope="col">
                <div className="name_and_arrows">
                  Amount
                  <i
                    className="fas fa-sort-up"
                    onClick={(e) => handleSort(1, false, e)}
                  ></i>
                  <i
                    className="fas fa-sort-down"
                    onClick={(e) => handleSort(1, true, e)}
                  ></i>
                </div>
              </th>
              <th scope="col">
                <div className="name_and_arrows">
                  Initial Value
                  <i
                    className="fas fa-sort-up"
                    onClick={(e) => handleSort(2, false, e)}
                  ></i>
                  <i
                    className="fas fa-sort-down"
                    onClick={(e) => handleSort(2, true, e)}
                  ></i>
                </div>
              </th>
              <th scope="col">
                <div className="name_and_arrows">
                  Current Value
                  <i
                    className="fas fa-sort-up"
                    onClick={(e) => handleSort(3, false, e)}
                  ></i>
                  <i
                    className="fas fa-sort-down"
                    onClick={(e) => handleSort(3, true, e)}
                  ></i>
                </div>
              </th>
              <th scope="col">
                <div className="name_and_arrows">
                  Profit
                  <i
                    className="fas fa-sort-up"
                    onClick={(e) => handleSort(4, false, e)}
                  ></i>
                  <i
                    className="fas fa-sort-down"
                    onClick={(e) => handleSort(4, true, e)}
                  ></i>
                </div>
              </th>
              <th scope="col">
                <div className="name_and_arrows">
                  ROI
                  <i
                    className="fas fa-sort-up"
                    onClick={(e) => handleSort(5, false, e)}
                  ></i>
                  <i
                    className="fas fa-sort-down"
                    onClick={(e) => handleSort(5, true, e)}
                  ></i>
                </div>
              </th>
              <th scope="col">Last 7 Days</th>
            </tr>
          </thead>
          <OverviewCurrencies
            user={user}
            cryptoCurrencies={cryptoCurrencies}
            exchangeRates={exchangeRates}
            overviewValues={overviewValues}
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
