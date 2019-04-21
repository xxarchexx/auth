import axios from 'axios'

export  function signUp(userData){
    return dispatch =>{
        return axios.post('api/users,userData')
    }
}

export function ifUserExists(identifier){
    return dispatch =>{
        return axios.get(`/api/users/${identifier}`);
    }
}