import React, { useState, useEffect } from "react";
import "./LoginForm.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../reducers/reducer";
import { ACCESS_TOKEN } from "../../constants/config";

function LoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      redirectToHome();
    } else if (props.isLoginSuccess && !props.loginError) {
      console.log("Login is successfull");
      redirectToHome();
    } else if (!props.isLoginSuccess && props.loginError) {
      console.log("Login is unsuccessfull");
    }
  }, [props.isLoginSuccess]);
  const handleSubmitClick = () => {
    if (!email) {
      return;
    }
    if (!password) {
      return;
    }
    props.login(email, password);
  };
  const redirectToHome = () => {
    props.updateTitle("Home");
    props.history.push("/home");
  };
  const redirectToRegister = () => {
    props.history.push("/register");
    props.updateTitle("Register Customer");
  };
  return (
    <div className="container d-flex align-items-center flex-column">
      <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
        <form>
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-check"></div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmitClick}
          >
            Submit
          </button>
        </form>

        <div className="registerMessage">
          <span>Dont have an account? </span>
          <span className="loginText" onClick={() => redirectToRegister()}>
            Register Customer
          </span>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoginProgress: state.isLoginProgress,
    isLoginSuccess: state.isLoginSuccess,
    loginError: state.loginError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => dispatch(login(email, password)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginForm)
);
