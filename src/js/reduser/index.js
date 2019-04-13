import  * as AT from '../action-types';
import { combineReducers } from 'redux';

var initial_state = {
    testField: true
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