import { SIGNUP,SUGN_UP_SUCCESS } from '../actions/action-types';
import isEmpty from 'lodash/isEmpty';

const initialState = {
  isRegistratedSuccess: false,
  payload :{},
  user: {}
};

 var Auth = (state = initialState, action = {}) => {
  switch(action.type) {
    case SIGNUP:
       return Object.assign({},state, {
            action: action.type,
            payload: action.payload,
            redirect: true              
      });
      case SUGN_UP_SUCCESS:
          return Object.assign({},state, {
           action: action.type,
           payload: payload,
           redirect: true              
     });
      
    default: return state;
  }
}

export default Auth;
