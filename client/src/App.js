import React, { Fragment, useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  useHistory,
  Redirect,
} from "react-router-dom";

import { createPosition } from "./actions/positions";
import { getCurrenciesNames } from "./auxiliary/auxiliaryCryptoData";
import { getLatestCryptoData } from "./actions/currencies";
import { loadUser } from "./auxiliary/auxiliaryUserData";
import { signin } from "./auxiliary/auxiliaryUserData";
import { signout } from "./auxiliary/auxiliaryUserData";
import { signup } from "./auxiliary/auxiliaryUserData";
import { getFiatExchangeRates } from "./actions/currencies";
import { getCurrentDate } from "./auxiliary/auxiliaryDateData";

import Navbar from "./components/navbar/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import AddCrypto from "./components/input/AddCrypto";
import DeductCrypto from "./components/input/DeductCrypto";

import PositionsByCurrency from "./components/positions/PositionsByCurrency";
// import PositionChart from "./components/positions/PositionChart";

import Alert from "./components/layout/Alert";

import HeroImage from "./components/layout/HeroImage";

import "./App.scss";
import "./auxiliary/auxIframe.js";

const updateCryptoCurrenciesState = async (
  logedin,
  fiat,
  triggerAlert,
  setCryptoCurrencies,
  setCurrencyNames
) => {
  if (logedin) {
    setInterval(() => {
      update();
    }, 120000);

    const update = async () => {
      const userObj = await loadUser();

      const currencyNames = getCurrenciesNames(userObj);

      setCurrencyNames(currencyNames);

      const crypto = await getLatestCryptoData(currencyNames, fiat.current);
      if (crypto instanceof Error) {
        // triggerAlert("Something went wrong", "danger");
        triggerAlert(crypto.message, "danger");
      } else {
        setCryptoCurrencies(crypto);
      }
    };

    update();
  }
};

const App = () => {
  const [user, setUser] = useState({});

  const [logedin, setLogedin] = useState(false);

  const [alert, setAlert] = useState({});

  const [cryptoCurrencies, setCryptoCurrencies] = useState({});

  const [exchangeRates, setExchangeRate] = useState({});

  const [currencyNames, setCurrencyNames] = useState([]);

  const fiat = useRef("EUR");

  const fiatSymbol = useRef("€");

  let history = useHistory();

  useEffect(() => {
    loadUserObj();
  }, []);

  useEffect(() => {
    updateCryptoCurrenciesState(
      logedin,
      fiat,
      triggerAlert,
      setCryptoCurrencies,
      setCurrencyNames
    );
    updateExchangeRateState();
  }, [logedin]);

  const updateExchangeRateState = async () => {
    const date = getCurrentDate();

    const exchangeObj = await getFiatExchangeRates(date);

    if (exchangeObj instanceof Error) {
      // triggerAlert("exchangeObj.message", "danger");
      // triggerAlert(exchangeObj.message, "danger");
    } else {
      setExchangeRate(exchangeObj);
    }
  };

  const setFiatCurrency = (e) => {
    fiat.current = e.target.value;

    switch (e.target.value) {
      case "EUR":
        fiatSymbol.current = "€";
        break;
      case "USD":
        fiatSymbol.current = "$";
        break;
      default:
    }

    updateCryptoCurrenciesState(
      logedin,
      fiat,
      triggerAlert,
      setCryptoCurrencies,
      setCurrencyNames
    );
  };

  const makePosition = async (formData) => {
    const position = await createPosition(formData);
    if (position instanceof Error) {
      triggerAlert(position.response.data.errors.msg, "danger");
    } else {
      position.data.amount < 0
        ? triggerAlert("Amount deducted", "success")
        : triggerAlert("Position added", "success");
      setUser({ ...user.positions.unshift(position.data) });
      updateCryptoCurrenciesState(
        logedin,
        fiat,
        triggerAlert,
        setCryptoCurrencies,
        setCurrencyNames
      );
    }
  };

  const login = async (email, password) => {
    const token = await signin(email, password);
    if (token instanceof Error) {
      triggerAlert(token.response.data.errors.msg, "danger");
    } else {
      triggerAlert("You have sucessfully logged in!", "success");
      loadUserObj();
      // return <Redirect to="/" />;
      // history.push("/login");
      return token;
    }
  };

  const loadUserObj = async () => {
    const userObj = await loadUser();
    if (userObj instanceof Error) {
      triggerAlert(userObj.response.data.errors.msg, "danger");
      return;
    } else if (userObj) {
      setUser(userObj);
      setLogedin(true);
      return <Redirect to="/" />;
    } else if (!userObj) {
      // history.push("/login");
      triggerAlert(
        "Welcome! You are currently logged out. Log in or sign up!",
        "success"
      );
    }
  };

  const logout = () => {
    signout();
    setUser({});
    setLogedin(false);
    // history.push("/login");
    triggerAlert("You are now logged out.", "success");
  };

  const register = async (email, password, password2) => {
    const token = await signup(email, password, password2);
    if (token instanceof Error) {
      triggerAlert(token.response.data.errors.msg, "danger");
    } else {
      triggerAlert("Welcome Hodler! Enter your portfolio!", "success");
      loadUserObj();
    }
  };

  const triggerAlert = (msg, alertType) => {
    setAlert({
      message: msg,
      type: alertType,
    });
    setTimeout(() => setAlert({}), 20000);
  };

  const removeAlert = () => setAlert({});

  return (
    <Router>
      <Fragment>
        <Navbar
          logout={logout}
          logedin={logedin}
          setFiatCurrency={setFiatCurrency}
        />
        <Alert alert={alert} removeAlert={removeAlert} />

        <Switch>
          {logedin ? (
            <Route
              exact
              path="/"
              render={() => (
                <Landing
                  user={user}
                  cryptoCurrencies={cryptoCurrencies}
                  exchangeRates={exchangeRates}
                  logedin={logedin}
                  fiat={fiat}
                  fiatSymbol={fiatSymbol}
                  triggerAlert={triggerAlert}
                />
              )}
            />
          ) : (
            <Route exact path="/" render={() => <HeroImage />} />
          )}

          {!logedin && (
            <Route
              exact
              path="/login"
              render={() => <Login login={login} logedin={logedin} />}
            />
          )}

          {!logedin && (
            <Route
              exact
              path="/register"
              render={() => <Register register={register} logedin={logedin} />}
            />
          )}

          {logedin && (
            <Route
              exact
              path="/add_crypto"
              render={() => (
                <AddCrypto
                  fiat={fiat}
                  logedin={logedin}
                  makePosition={makePosition}
                  loadUserObj={loadUserObj}
                  updateCryptoCurrenciesState={updateCryptoCurrenciesState}
                  triggerAlert={triggerAlert}
                  setCryptoCurrencies={setCryptoCurrencies}
                  setCurrencyNames={setCurrencyNames}
                />
              )}
            />
          )}

          {logedin && (
            <Route
              exact
              path="/deduct_crypto"
              render={() => (
                <DeductCrypto
                  user={user}
                  currencyNames={currencyNames}
                  makePosition={makePosition}
                  loadUserObj={loadUserObj}
                  triggerAlert={triggerAlert}
                  setUser={setUser}
                  setCurrencyNames={setCurrencyNames}
                />
              )}
            />
          )}

          {logedin && (
            <Route
              exact
              path="/position"
              render={() => (
                <PositionsByCurrency
                  cryptoCurrencies={cryptoCurrencies}
                  fiat={fiat}
                  fiatSymbol={fiatSymbol}
                />
              )}
            />
          )}
        </Switch>
      </Fragment>
    </Router>
  );
};

export default withRouter(App);
// export default App;
