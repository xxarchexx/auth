import axios from "axios";
import { SIGNUP, SUGN_UP_SUCCESS, SIGN_UP_CLEAR,LOGIN_FAILED , LOGIN_SUCESS } from "./action-types";

export function signUp(userData) {
  return dispatch => {
    return axios.post("api/users,userData");
  };
}

export function ifUserExists(identifier) {
  return dispatch => {
    return axios.get(`/api/users/${identifier}`);
  };
}

const userSignup = data => {
  return {
    payload: data,
    type: SUGN_UP_SUCCESS
  };
};

const clearData = () => {
  return {
    payload: null,
    type: SIGN_UP_CLEAR
  };
};

export function userSignupRequest(userData) {
  return dispatch => {
    axios
      .post("/registration", userData)
      .then(res => {
        dispatch(userSignup(res.data));
      })
      .then(() => {
        dispatch(userClearData());
      });
  };
}

function successLogin() {
  return {
    type: LOGIN_SUCESS
  };
}

function faildLogin() {
  return {
    type: LOGIN_FAILED
  };
}

export function signIn(login, password) {
  return dispatch => {
    axios
      .post("/login", { login, password })
      .then(e => {
        dispatch(successLogin());
      })
      .catch(e => {
        dispatch(faildLogin());
      });
  };
}
