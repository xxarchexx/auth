import  * as AT from '../actions/action-types';
import { combineReducers } from 'redux';

var initial_state = {
    login: '',
    password:'',
    email:''
}

function root(state = initial_state,action){
    switch(action.type){
        case AT.LOGIN:
        return Object.assign({},state, {
            action: action.type
        });
        default: return state;
    }
}


const rootReducer = combineReducers({
    rootReduser: root
});

export default rootReducer;