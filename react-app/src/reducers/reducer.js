import { ACCESS_TOKEN, API_BASE_URL, EMAIL, ID } from "../constants/config";

const LOGIN_IN_PROCESS = "LOGIN_IN_PROCESS";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";
const SIGNUP_IN_PROCESS = "SIGNUP_IN_PROCESS";
const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
const SIGNUP_ERROR = "SIGNUP_ERROR";
const PRODUCT_PURCHASING = "PRODUCT_PURCHASING";
const PRODUCT_PURCHASED = "PRODUCT_PURCHASED ";
const PRODUCT_DATA = "PRODUCT_DATA";
const CUSTOMER_DATA = "CUSTOMER_DATA";

const intialState = {
  isSignupProgress: false,
  isSignupSuccess: false,
  signupError: null,
  isLoginProgress: false,
  isLoginSuccess: false,
  loginError: null,
  customer: null,
  isProductPurchasing: false,
  isProductPurchased: false,
  productsData: null,
};

function setLoginInProcess(isLoginProgress) {
  return {
    type: LOGIN_IN_PROCESS,
    isLoginProgress,
  };
}
function setLoginSuccess(isLoginSuccess) {
  return {
    type: LOGIN_SUCCESS,
    isLoginSuccess,
  };
}

function setLoginError(loginError) {
  return {
    type: LOGIN_ERROR,
    loginError,
  };
}

function setSignupInProcess(isSignupProgress) {
  return {
    type: SIGNUP_IN_PROCESS,
    isSignupProgress,
  };
}
function setSignupSuccess(isSignupSuccess) {
  return {
    type: SIGNUP_SUCCESS,
    isSignupSuccess,
  };
}

function setSignupError(signupError) {
  return {
    type: SIGNUP_ERROR,
    signupError,
  };
}

function setCustometData(customer) {
  return {
    type: CUSTOMER_DATA,
    customer,
  };
}
function setProductData(productsData) {
  return {
    type: PRODUCT_DATA,
    productsData,
  };
}

function setProductPurchasing(isProductPurchasing) {
  return {
    type: PRODUCT_PURCHASING,
    isProductPurchasing,
  };
}
function setProductPurchased(isProductPurchased) {
  return {
    type: PRODUCT_PURCHASED,
    isProductPurchased,
  };
}
export function udateStatus() {
  return (dispatch) => {
    dispatch(setSignupSuccess(false));
  };
}
export function signup(name, email, password) {
  return (dispatch) => {
    dispatch(setSignupInProcess(true));
    dispatch(setSignupSuccess(false));
    dispatch(setSignupError(null));

    fetch(API_BASE_URL + "/customer/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.customer) {
          console.log("succes", data);
          dispatch(setSignupInProcess(false));
          dispatch(setSignupSuccess(true));
          dispatch(setSignupError(null));
        } else if (data && !data.token) {
          console.log("error", data);
          dispatch(setSignupInProcess(false));
          dispatch(setSignupSuccess(false));
          dispatch(setSignupError("Signup error"));
        }
      })
      .catch(function (err) {
        console.log("error", err);
        dispatch(setSignupInProcess(false));
        dispatch(setSignupSuccess(false));
        dispatch(setSignupError(err));
      });
  };
}
export function login(email, password) {
  return (dispatch) => {
    dispatch(setLoginInProcess(true));
    dispatch(setLoginSuccess(false));
    dispatch(setLoginError(null));

    fetch(API_BASE_URL + "/customer/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.token) {
          console.log("succes", data);
          saveToLocalStorage(data);
          dispatch(setLoginInProcess(false));
          dispatch(setLoginSuccess(true));
          dispatch(setLoginError(null));
        } else if (data && !data.token) {
          console.log("error", data);
          saveToLocalStorage({});
          dispatch(setLoginInProcess(false));
          dispatch(setLoginSuccess(false));
          dispatch(setLoginError(data));
        }
      })
      .catch(function (err) {
        console.log("error", err);
        saveToLocalStorage({});
        dispatch(setLoginInProcess(false));
        dispatch(setLoginSuccess(false));
        dispatch(setLoginError("Error"));
      });
  };
}
function saveToLocalStorage(data) {
  if (data && data.token) {
    localStorage.setItem(ACCESS_TOKEN, data.token);
    localStorage.setItem(EMAIL, data.email);
    localStorage.setItem(ID, data._id);
  } else {
    localStorage.setItem(ACCESS_TOKEN, "");
    localStorage.setItem(EMAIL, "");
    localStorage.setItem(ID, "");
  }
}
export function purchaseProduct(name, price, shopName, status) {
  return (dispatch) => {
    dispatch(setProductPurchasing(true));
    fetch(API_BASE_URL + "/product/purchase", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
      },
      body: JSON.stringify({
        name: name,
        price: price,
        shopName: shopName,
        status: status,
        userId: localStorage.getItem(ID),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("product purchase", data);
        dispatch(setProductPurchased(true));
        dispatch(setProductPurchasing(false));
      })
      .catch((err) => {
        dispatch(setProductPurchased(false));
        dispatch(setProductPurchasing(false));
      });
  };
}
export function customerData() {
  return (dispatch) => {
    fetch(API_BASE_URL + "/customer/me", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
      },
      body: JSON.stringify({
        email: localStorage.getItem(EMAIL),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log("succes", data);
          dispatch(setCustometData(data));
        } else if (data && !data.token) {
          console.log("error", data);
        }
      })
      .catch(function (err) {
        console.log("error", err);
      });
  };
}

export function getAllProducts(searchText) {
  return (dispatch) => {
    fetch(
      API_BASE_URL +
        "/product/getAll?searchText=" +
        searchText +
        "&userId=" +
        localStorage.getItem(ID),
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log("ProductsData", data);
          dispatch(setProductData(data));
        } else if (data && !data.token) {
          console.log("error", data);
        }
      })
      .catch(function (err) {
        console.log("error", err);
      });
  };
}
export default function reducer(state = intialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoginSuccess: action.isLoginSuccess,
      };
    case LOGIN_IN_PROCESS:
      return {
        ...state,
        isLoginProgress: action.isLoginProgress,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginError: action.loginError,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isSignupSuccess: action.isSignupSuccess,
      };
    case SIGNUP_IN_PROCESS:
      return {
        ...state,
        isSignupProgress: action.isSignupProgress,
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        signupError: action.signupError,
      };
    case CUSTOMER_DATA:
      return {
        ...state,
        customer: action.customer,
      };
    case PRODUCT_PURCHASING:
      return {
        ...state,
        isProductPurchasing: action.isProductPurchasing,
      };
    case PRODUCT_PURCHASED:
      return {
        ...state,
        isProductPurchased: action.isProductPurchased,
      };
    case PRODUCT_DATA:
      return {
        ...state,
        productsData: action.productsData,
      };
    default:
      return state;
  }
}
