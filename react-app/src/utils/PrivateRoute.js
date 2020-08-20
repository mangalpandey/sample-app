import React from "react";
import { Redirect, Route } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants/config";

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem(ACCESS_TOKEN) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
