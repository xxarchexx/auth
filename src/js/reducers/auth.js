import {
  SIGNUP,
  SUGN_UP_SUCCESS,
  SIGN_UP_CLEAR,
  LOGLOGIN_FAILED,
  LOGIN_FAILED,
  LOGIN_SUCESS
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
        success :true,
        payload : "Loggined"      
      });
    case LOGIN_FAILED:
      return Object.assign({}, state, {
        success :false,
        payload : "Login failed"        
      });
    case SIGNUP:
      return Object.assign({}, state, {
        action: action.type,
        payload: action.payload,
        redirect: true
      });
    case SIGN_UP_CLEAR:
      return Object.assign({}, state, {
        action: action.type,
        payload: null,
        redirect: false
      });
    case SUGN_UP_SUCCESS:
      return Object.assign({}, state, {
        action: action.type,
        success : true,
        payload: action.payload,
        redirect: true
      });

    default:
      return state;
  }
};

export default Auth;
