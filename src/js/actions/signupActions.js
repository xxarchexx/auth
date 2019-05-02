import axios from 'axios';
import {SIGNUP,SUGN_UP_SUCCESS, SIGN_UP_CLEAR  } from './action-types';

const userSignup = (data)=> {
  return {
    payload:  data , 
    type: SUGN_UP_SUCCESS
  }
}

const clearData = ()=> {
  return {
    payload:  null , 
    type: SIGN_UP_CLEAR
  }
}

export function userSignupRequest(userData) {
    return (dispatch) =>{     
     axios.post('/registration',userData)
     .then( res=> {
       dispatch(userSignup(res.data))
     })
     .then( () => {
      dispatch(userClearData())
    });       
   };
}



