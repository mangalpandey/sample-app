import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import PrivateRoute from "./utils/PrivateRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AlertComponent from "./components/AlertComponent/AlertComponent";
import ProductHome from "./components/ProductHome/ProductHome";
function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
      <div className="App">
        <Header title={title} />
        {
          <div>
            <Switch>
              <Route path="/" exact={true}>
                <RegistrationForm
                  showError={updateErrorMessage}
                  updateTitle={updateTitle}
                />
              </Route>
              <Route path="/register">
                <RegistrationForm
                  showError={updateErrorMessage}
                  updateTitle={updateTitle}
                />
              </Route>
              <Route path="/login">
                <LoginForm
                  showError={updateErrorMessage}
                  updateTitle={updateTitle}
                />
              </Route>
              <PrivateRoute path="/home">
                <ProductHome />
              </PrivateRoute>
            </Switch>
            <AlertComponent
              errorMessage={errorMessage}
              hideError={updateErrorMessage}
            />
          </div>
        }
      </div>
    </Router>
  );
}

export default App;
