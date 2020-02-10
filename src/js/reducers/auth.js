import {
  SIGNUP,
  SUGN_UP_SUCCESS,
  SIGN_UP_CLEAR,
  LOGLOGIN_FAILED,
  LOGIN_FAILED,
  LOGIN_SUCESS,
  SHOW_MESSAGE_FORM,
  HIDE_MESSAGE_FORM
} from "../actions/action-types";

import isEmpty from "lodash/isEmpty";

const initialState = {
  isRegistratedSuccess: false,
  payload: {},
  user: {}
};

var Auth = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOGIN_SUCESS:
      return Object.assign({}, state, {
        success: true,
        payload: "Loggined"
      });
    case LOGIN_FAILED:
      return Object.assign({}, state, {
        success: false,
        payload: "Login failed"
      });
    case SIGNUP:
      return Object.assign({}, state, {
        action: action.type,
        payload: action.payload,
        success: true
      });
    case SIGN_UP_CLEAR:
      return Object.assign({}, state, {
        action: action.type,
        payload: null,
        success: false
      });
    case SUGN_UP_SUCCESS:
      return Object.assign({}, state, {
        action: action.type,
        success: true,
        payload: {needredirect : true}
      });

    case SUGN_UP_SUCCESS:
      return Object.assign({}, state, {
        action: action.type,
        success: true,
        payload: action.payload
      });

    case SHOW_MESSAGE_FORM:
      return Object.assign({}, state, {
        action: action.type,
        success: false,
        payload: action.payload
      });
    case HIDE_MESSAGE_FORM:
      return Object.assign({}, state, {
        action: action.type,
        success: true,
        payload: action.payload
      });

    default:
      return state;
  }
};

export default Auth;
