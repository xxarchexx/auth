import  SIGNUP  from '../actions/action-types';
import Auth from './auth';

import { combineReducers } from 'redux';

var initial_state = {
    login: '',
    password:'',
    email:''
}

// function root(state = initial_state,action){
//     switch(action.type){
//         case AT.LOGIN:
//         return Object.assign({},state, {
//             action: action.type
//         });
//         default: return state;
//     }
// }


const rootReducer = combineReducers({
    Auth: Auth
});

export default rootReducer;