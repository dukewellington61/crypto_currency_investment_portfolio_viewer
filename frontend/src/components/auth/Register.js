import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

const Register = ({ logedin, signup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
  });

  const { firstname, lastname, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    signup(email, password, password2);
  };

  // if some nasty user enters .../login in url --> redirect to landing page
  // otherwhise the register form could be displayed to a logged in user
  if (logedin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form_container">
      <h3 className="large text-primary">Sign Up</h3>
      <p className="lead">
        <i className="fa fa-user auth_fa-user"></i> Create your account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            className="form-control input_field"
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
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
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-control input_field"
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={(e) => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
