import React, { useState, useEffect } from "react";
import "./RegistrationForm.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { signup, udateStatus } from "../../reducers/reducer";
import { ACCESS_TOKEN } from "../../constants/config";

function RegistrationForm(props) {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      redirectToHome();
    } else if (props.isSignupSuccess && !props.signupError) {
      console.log("Signup is successfull");
      props.udateStatus();
      redirectToLogin();
    } else if (!props.isSignupSuccess && props.signupError) {
      //console.log("Signup is unsuccessfull");
    }
  }, [props.isSignupSuccess]);

  const redirectToHome = () => {
    props.updateTitle("Home");
    props.history.push("/home");
  };
  const redirectToLogin = () => {
    props.updateTitle("Login");
    props.history.push("/login");
  };
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.password === state.confirmPassword) {
      props.signup(state.name, state.email, state.password);
    } else {
      props.showError("Passwords do not match");
    }
  };
  return (
    <div className="container d-flex align-items-center flex-column">
      <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
        <form>
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              aria-describedby="nameHelp"
              placeholder="Enter Name"
              value={state.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={state.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="exampleInputPassword1">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={state.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmitClick}
          >
            Register
          </button>
        </form>

        <div className="mt-2">
          <span>Already have an account? </span>
          <span className="loginText" onClick={() => redirectToLogin()}>
            Login here
          </span>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isSignupProgress: state.isSignupProgress,
    isSignupSuccess: state.isSignupSuccess,
    signupError: state.signupError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    udateStatus: () => dispatch(udateStatus()),
    signup: (name, email, password) => dispatch(signup(name, email, password)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegistrationForm)
);
