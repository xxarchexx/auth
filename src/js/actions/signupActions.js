import axios from 'axios';

export function userSignupRequest(userData) {
  return dispatch => {
    return axios.post('/registration', userData);
  }
}

export function isUserExists(identifier) {
  return dispatch => {
    return axios.get(`/api/users/${identifier}`);
  }
}
