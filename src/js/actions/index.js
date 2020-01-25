import axios from "axios";
import { SIGNUP, SUGN_UP_SUCCESS, SIGN_UP_CLEAR } from "./action-types";

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

function test(data) {
  return {
    type: "TEST",
    data
  };
}

export function signIn(login, password) {
  return dispatch => {
    axios.post("/login", { login, password } ).then(e => {
      console.log(e);
      dispatch(test(e));
    });
  };
}
