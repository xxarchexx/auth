import axios from 'axios';
import {SIGNUP  } from './action-types';

const userSignup = (data)=> {
  return {
    payload: axios.post('/registration', data),
    type: SIGNUP
  }
}

export function userSignupRequest(userData) {
  return (dispatch) =>{ 
      dispatch(userSignup(userData));
   };
}



