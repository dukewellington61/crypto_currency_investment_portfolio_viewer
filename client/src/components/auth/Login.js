import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Login = ({ login, logedin }) => {
  const [formData, setFormData] = useState({
    email: "example@portfolio.com",
    password: "123456",
  });

  const { email, password } = formData;

  let history = useHistory();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = await login(email, password);
    if (token) history.push("/");
  };

  // if some nasty user enters .../login in url --> redirect to landing page
  // otherwhise the login form could be displayed to a logged in user
  if (logedin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form_container">
      <h3 className="large text-primary">Sign In</h3>
      <p className="lead">
        <i className="fa fa-user auth_fa-user"></i>&nbsp;Log into your account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            className="form-control input_field"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            autoComplete
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-control input_field"
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
