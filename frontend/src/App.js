import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { createPosition } from "./actions/positions";
import { getCurrenciesNames } from "./auxiliary/auxiliaryCryptoData";
import { getLatestCryptoPrice } from "./actions/currencies";
import { loadUser } from "./auxiliary/auxiliaryUserData";
import { signin } from "./auxiliary/auxiliaryUserData";
import { signout } from "./auxiliary/auxiliaryUserData";
import { signup } from "./auxiliary/auxiliaryUserData";

import Navbar from "./components/navbar/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import PositionInput from "./components/input/PositionInput";

import Position from "./components/portfolio/Position";
import PositionChart from "./components/portfolio/PositionChart";

import CurrencyTotalChart from "./components/portfolio/CurrencyTotalChart";

import Alert from "./components/layout/Alert";

import "./App.css";

const App = () => {
  const [user, setUser] = useState({});

  const [logedin, setLogedin] = useState(false);

  const [alert, setAlert] = useState({});

  const [cryptoCurrencies, setCryptoCurrencies] = useState({});

  useEffect(() => {
    loadUserObj();
  }, []);

  useEffect(() => {
    updateCryptoCurrenciesState();
  }, [logedin]);

  const updateCryptoCurrenciesState = async () => {
    if (logedin) {
      const currencyNames = getCurrenciesNames(user);
      const crypto = await getLatestCryptoPrice(currencyNames);
      setCryptoCurrencies(crypto);
    }
  };

  const makePosition = async (formData) => {
    const position = await createPosition(formData);
    if (position instanceof Error) {
      triggerAlert(position.response.data.errors.msg, "danger");
    } else {
      triggerAlert("Position added", "success");
      setUser({ ...user.positions.unshift(position.data) });
      updateCryptoCurrenciesState();
    }
  };

  const login = async (email, password) => {
    const token = await signin(email, password);
    if (token instanceof Error) {
      triggerAlert(token.response.data.errors.msg, "danger");
    } else {
      loadUserObj();
    }
  };

  const loadUserObj = async () => {
    const userObj = await loadUser();
    if (userObj instanceof Error) {
      triggerAlert(userObj.response.data.errors.msg, "danger");
    } else {
      setUser(userObj);
      setLogedin(true);
    }
  };

  const logout = () => {
    signout();
    setUser({});
    setLogedin(false);
  };

  const register = (email, password, password2) => {
    const token = signup(email, password, password2);
    if (token instanceof Error) {
      triggerAlert(token.response.data.errors.msg, "danger");
    } else {
      loadUser();
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
        <Navbar logout={logout} logedin={logedin} />
        <Alert alert={alert} removeAlert={removeAlert} />
        <Switch>
          {logedin && (
            <Route
              exact
              path="/"
              render={() => (
                <Landing
                  user={user}
                  cryptoCurrencies={cryptoCurrencies}
                  logedin={logedin}
                  triggerAlert={triggerAlert}
                />
              )}
            />
          )}
          <Route exact path="/position" render={() => <Position />} />
          <Route
            exact
            path="/position_chart"
            render={() => <PositionChart />}
          />
          {logedin && (
            <Route
              exact
              path="/currency_total_chart"
              render={() => (
                <CurrencyTotalChart
                  user={user}
                  cryptoCurrencies={cryptoCurrencies}
                  logedin={logedin}
                />
              )}
            />
          )}

          <Route
            exact
            path="/login"
            render={() => <Login login={login} logedin={logedin} />}
          />
          <Route
            exact
            path="/register"
            render={() => <Register register={register} logedin={logedin} />}
          />
          {logedin && (
            <Route
              exact
              path="/input"
              render={() => (
                <PositionInput
                  makePosition={makePosition}
                  loadUserObj={loadUserObj}
                  triggerAlert={triggerAlert}
                />
              )}
            />
          )}
        </Switch>
      </Fragment>
    </Router>
  );
};

export default App;
